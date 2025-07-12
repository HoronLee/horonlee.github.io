---
layout: post
title: ubuntu22.04-k8s-deploy
date: 2024-05-25 10:24:56
tags:
    - Linux
    - Kubernetes
    - 云计算
    - Ubuntu
categories:
    
    - 云计算
    - Kubernetes
cover: https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg
password: 
hide: 
---
# Ubuntu22.04部署K8S

- Kubernetes 版本：1.29.5
- Linux 版本：Linux master 5.15.0-107-generic #117-Ubuntu SMP Fri Apr 26 12:26:49 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
- 实测可用，几乎是最新的配置方法

> 本文中出现的172.30.27.143地址为本人学校内网环境地址，不公开在外网，请读者忽略，软件包的下载请前往各官网

# 准备工作

## 配置 host

```
172.30.26.226 master
172.30.26.227 worker1
```

## 关闭 swap 分区

打开终端，并以管理员权限执行`sudo swapoff -a`命令来禁用交换分区。

上述方法只能暂时禁用，若需要永久禁止交换分区，需要编辑 `/etc/fstab`, 在文件中找到与交换分区相关的行，通常以类似于 `/swapfile` 或 `/dev/sdXY`（其中 XY 是分区标识符）的形式出现。将这些行注释掉（在行的开头添加 # 符号），或者删除这些行，然后重启系统，示例:

```
# /swap.img     none    swap    sw      0       0
# /dev/sdXY     none    swap    sw      0       0
```

## 安装容器运行时

你需要在集群内每个节点上安装一个 [容器运行时](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes) 以使 Pod 可以运行在上面。本文概述了所涉及的内容并描述了与节点设置相关的任务。

Kubernetes 1.30 要求你使用符合[容器运行时接口](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#container-runtime)（CRI）的运行时。

有关详细信息，请参阅 [CRI 版本支持](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#cri-versions)。 本页简要介绍在 Kubernetes 中几个常见的容器运行时的用法。

- [containerd](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)
- [CRI-O](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#cri-o)
- [Docker Engine](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#docker)
- [Mirantis Container Runtime](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#mcr)

## 转发 IPv4 并让 iptables 看到桥接流量

执行下述命令：

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
sudo sysctl --system
```

# 安装continerd

我们使用`apt-get`来安装 containerd，这里需要参考Dockers的官方安装文档：

[在 Ubuntu 上安装 Docker 引擎 |Docker 文档](https://docs.docker.com/engine/install/ubuntu/)

### 设置 Docker 存储库

添加 Docker 官方 GPG 密钥

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### 添加 apt 软件源

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

###  安装 Docker 及其插件

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 启用 Docker

```bash
systemctl enable docker --now
```

## 安装 CNI 网络插件

注意，[http://containerd.io](https://link.zhihu.com/?target=http%3A//containerd.io)包括了`runc`, 但是不包括CNI插件，我们需要[手动安装CNI插件](https://link.zhihu.com/?target=https%3A//github.com/containerd/containerd/blob/main/docs/getting-started.md%23step-3-installing-cni-plugins)：

访问：[Releases · containernetworking/plugins (github.com)](https://link.zhihu.com/?target=https%3A//github.com/containernetworking/plugins/releases)获取最新版本的插件，然后将其安装到`/opt/cni/bin`中

- 下载插件`curl -O https://github.com/containernetworking/plugins/releases/download/v1.5.1/cni-plugins-linux-amd64-v1.5.1.tgz`
- 新建软件包目录`mkdir -p /opt/cni/bin`
- 解压 CNI 软件到指定目录`tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.5.1.tgz`

### 生成默认配置文件

此时还有一个重要的步骤，那就是生成containerd的配置文件。可以通过以下命令生成默认的配置文件：

```bash
containerd config default > /etc/containerd/config.toml
```

该命令同样来自同一个文档：[Customizing containerd](https://link.zhihu.com/?target=https%3A//github.com/containerd/containerd/blob/main/docs/getting-started.md%23customizing-containerd)

### 配置 containerd 的systemd cgroup 驱动

在 `/etc/containerd/config.toml` 中设置：

```text
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

为什么要配置contaierd的cgroup 驱动为systemd ，这来自文档：[Container Runtimes | Kubernetes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#cgroup-drivers)

### 重载沙箱（pause）镜像

我们在国内无法访问 k8s 官方的镜像仓库，所以需要设置 pause 镜像的国内源

在 `/etc/containerd/config.toml` 中设置：

```text
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.9"
```

一旦你更新了这个配置文件，就同样需要重启 `containerd`：`systemctl restart containerd`。

# 安装 kubeadm、kubelet 和 kubectl

这里推荐使用阿里云的镜像软件源：

```bash
apt-get update && apt-get install -y apt-transport-https
curl -fsSL https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.29/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.29/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list

apt-get update
apt-get install -y kubelet kubeadm kubectl
systemctl enable kubelet --now
```

如果有特殊的网络环境，可以使用最新 kubernetes 官方软件源：

1. 更新 `apt` 包索引，并安装使用 Kubernetes `apt` 仓库所需要的包：

```shell
sudo apt-get update
# apt-transport-https 可以是一个虚拟包；如果是这样，你可以跳过这个包
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

2. 下载 Kubernetes 软件包仓库的公共签名密钥。 同一个签名密钥适用于所有仓库，因此你可以忽略 URL 中的版本信息：

```shell
# 如果 `/etc/apt/keyrings` 目录不存在，则应在 curl 命令之前创建它，请阅读下面的注释。
# sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # allow unprivileged APT programs to read 

apt-get update
apt-get install -y kubelet kubeadm kubectl
systemctl enable kubelet --now
```

## 配置kubelet的 cgroup 驱动

[Configuring a cgroup driver | Kubernetes](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver)

很幸运的是，在v1.22版本以后，默认的驱动就是systemd了，因此如果是在安装最新版本的K8s, 那么就不需要再配置kubelet的cgroup驱动了。

# 使用 kubeadm 创建集群

## 初始化控制平面

你只需要下述简单的执行下述命令即可：

```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

之后就可以等待初始化完成，其他的需要注意的参数可以阅读官方文档。

注意这里的`--pod-network-cidr=192.168.0.0/16`是为了配合第五章的网络插件，Calico文档中推荐我们使用此配置。

第一次初始化拉取镜像可能需要一些时间，镜像拉取成功之后，初始化是非常快的，几秒内即可完成，如果失败，那必然是遇到了问题。具体遇到了什么问题就需要查看kubectl服务的日志：

## 配置kubectl

当初始化完成时，可以看到以下类似的输出：

```text
完成之后你应该看到：

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

要使非 root 用户可以运行 kubectl，请运行以下命令， 它们也是 `kubeadm init` 输出的一部分：

```text
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

或者，如果你是 `root` 用户，则可以运行：

```text
export KUBECONFIG=/etc/kubernetes/admin.conf
```

记录`kubeadm init`输出的`kubeadm join`命令。 你需要此命令[将节点加入集群](https://link.zhihu.com/?target=https%3A//kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/%23join-nodes)。

# 安装 Pod 网络附加组件

>  **你必须部署一个基于 Pod 网络插件的[容器网络接口]([网络插件 | Kubernetes](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/))(CNI)，以便你的 Pod 可以相互通信。 在安装网络之前，集群 DNS (CoreDNS) 将不会启动。并且在安装网络插件之前，node都是NotReady的状态(出自[此处]([Stand up Kubernetes | Calico Documentation (tigera.io)](https://docs.tigera.io/calico/latest/getting-started/kubernetes/hardway/standing-up-kubernetes#install-kubernetes)))。**

有许多网络插件可以使用（[安装扩展（Addon） | Kubernetes](https://kubernetes.io/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)），我们在这里，将选择安装[Calico](https://link.zhihu.com/?target=https%3A//www.tigera.io/project-calico/)插件，其参考文档：[Quickstart for Calico on Kubernetes | Calico Documentation (tigera.io)](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)（使用最新的 3.28 版本）

1. 安装 Tigera Calico 运算符和自定义资源定义。

   > 注意：由于 CRD 捆绑包的大小较大，国内访问 GitHub 也非常慢，且可能会超出请求限制，所以可以将 两个 yaml 文件下载下来，再对其 `create`！

   ```bash
   kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/tigera-operator.yaml
   ```
   
2. 通过创建必要的自定义资源来安装 Calico。有关此清单中可用的配置选项的详细信息，请参阅[安装参考](https://docs.tigera.io/calico/latest/reference/installation/api)。

   > 注意：在创建此清单之前，请阅读其内容并确保其设置适合您的环境。例如 您可能需要更改默认 IP 池 CIDR 以匹配您的容器网络 CIDR。

   编辑`custom-resources.yaml`文件，更改里面的`cidr:`后面的 IP 地址为最开始`kubeadm init`的时候`--pod-network-cidr=`后面的 IP 地址（如 10.244.0.0/16）

   ```bash
   kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/custom-resources.yaml
   ```
   
3. 使用以下命令确认所有 Pod 都在运行。（大约需要等待五分钟甚至更长时间来完成运行）

   ```bash
   watch kubectl get pods -n calico-system
   ```

   等到每个 Pod 都具有`STATUS` `Running`

   > 注意：Tigera 运算符在命名空间中安装资源。其他安装方法可能使用 命名空间。`calico-system` `kube-system`

Calico 还取消了master 节点的`control-plane`污点，但是我们**不要**这么做，因为在生产环境中master 节点最好只起到控制集群的作用`kubectl taint nodes --all node-role.kubernetes.io/control-plane-`

现在通过`kubectl get nodes -o wide`可以看到所有节点都在 Ready 的 STATUS ！

# 将控制平面节点加入Pod调度节点

节点是你的工作负载（容器和 Pod 等）运行的地方。要将新节点添加到集群，请对每台计算机执行以下操作：

- SSH 到机器

- 成为 root （例如 `sudo su -`）

- 必要时[安装一个运行时](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)

- 运行 `kubeadm init` 输出的命令，例如：

  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

- 实际上这个命令就是`kubeadm join 172.30.26.226:6443 --token esm234.gwuedugnjtoluzu2 --discovery-token-ca-cert-hash sha256:7e4f72aae1fee69937739f4844adc629d3a36fba374112cd7af0a8ceb296c545`

如果你没有令牌，可以通过在控制平面节点上运行以下命令来获取令牌：

```bash
kubeadm token list
```

输出类似于以下内容：

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

默认情况下，令牌会在 24 小时后过期。如果要在当前令牌过期后将节点加入集群， 则可以通过在控制平面节点上运行以下命令来创建新令牌：

```bash
kubeadm token create
```

输出类似于以下内容：

```console
5didvk.d09sbcov8ph2amjw
```

如果你没有 `--discovery-token-ca-cert-hash` 的值，则可以通过在控制平面节点上执行以下命令链来获取它：

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

输出类似于以下内容：

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

当你执行完加入节点的命令后，应该会出现类似如下的回显：

```console
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

几秒钟后，当你在控制平面节点上执行 `kubectl get nodes`，你会注意到该节点出现在输出中，一开始它的状态可能是 NotReady，但是等待一段时间后就会在 Ready 状态了。

# 清理

如果你在集群中使用了一次性服务器进行测试，则可以关闭这些服务器，而无需进一步清理。 你可以使用 `kubectl config delete-cluster` 删除对集群的本地引用。

但是，如果要更干净地取消配置集群， 则应首先[清空节点](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#drain)并确保该节点为空， 然后取消配置该节点。

## 移除节点

使用适当的凭据与控制平面节点通信，运行：

```bash
kubectl drain <节点名称> --delete-emptydir-data --force --ignore-daemonsets
```

在移除节点之前，请重置 `kubeadm` 安装的状态：

```bash
kubeadm reset
```

重置过程不会重置或清除 iptables 规则或 IPVS 表。如果你希望重置 iptables，则必须手动进行：

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

如果要重置 IPVS 表，则必须运行以下命令：

```bash
ipvsadm -C
```

现在移除节点：

```bash
kubectl delete node <节点名称>
```

如果你想重新开始，只需运行 `kubeadm init` 或 `kubeadm join` 并加上适当的参数。

# The End👋

现在，你已经学会了在 Ubuntu22.04 环境下搭建 kubernetes 集群，是不是觉得比在 CentOS 中要简单很多？

本文绝大多数内容都是从官方文档照搬的，这说明了官方文档就是最好的指导书，或许你之前看过很多的博文，但都或多或少有失败经历，那是因为文章具有时效性，之前可行的办法在后续版本可能就不行了，比如正在之前`kubeadm init`步骤需要添加很多的参数（或者通过配置文件进行初始化），现在却根本不需要！

如果意犹未尽，不妨看看我的新文章[Jenkins的标准用法“Jenkins-Slave” - 皓然小站 (horonlee.com)](https://blog.horonlee.com/posts/K8sJenkinsSlaveCICD)

See you soon～
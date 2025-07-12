---
title: Kubernetes脚本部署
businesscard: true
date: 2023-07-11 21:39:43
updated:
tags:
    - Linux
    - Kubernetes
    - 云计算
categories:
    
    - 云计算
    - Kubernetes
keywords:
description:
top_img:
comments:
cover: https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
swiper_index: 1
---
# 容器云平台部署
## 基础环境准备
1. 将提供的安装包 chinaskills_cloud_paas_v2.0.2.iso 上传至 master 节点/root 目录,并解到/opt 目录:
```bash
[root@localhost ~]# mount -o loop chinaskills_cloud_paas_v2.0.2.iso /mnt/
[root@localhost ~]# cp -rfv /mnt/* /opt/
[root@localhost ~]# umount /mnt/
```

2. 安装 kubeeasy
kubeeasy 为 Kubernetes 集群专业部署工具,极大的简化了部署流程。其特性如下:
- 全自动化安装流程;
- 支持 DNS 识别集群;
- 支持自我修复:一切都在自动扩缩组中运行;
- 支持多种操作系统(如 Debian、Ubuntu 16.04、CentOS7、RHEL 等);
- 支持高可用。
3. 在 master 节点安装 kubeeasy 工具:
`[root@localhost ~]# mv /opt/kubeeasy /usr/bin/kubeeasy`
4. 安装依赖包
此步骤主要完成 docker-ce、git、unzip、vim、wget 等工具的安装。
在 master 节点执行以下命令完成依赖包的安装:
```bash
[root@localhost ~]# kubeeasy install depend \
--host 10.3.61.250,10.3.61.217 \
--user root \
--password 000000 \
--offline-file /opt/dependencies/base-rpms.tar.gz
```
参数解释如下:
--host:所有主机节点 IP,如:10.24.1.2-10.24.1.10,中间用“-”隔开,表示 10.24.1.2
到 10.24.1.10 范围内的所有 IP。若 IP 地址不连续,则列出所有节点 IP,用逗号隔开,如:
10.24.1.2,10.24.1.7,10.24.1.9。
--user:主机登录用户,默认为 root。
--password:主机登录密码,所有节点需保持密码一致。
--offline-file:离线安装包路径。
可通过命令“tail -f /var/log/kubeinstall.log”查看安装详情或排查错误。
5. 配置 SSH 免密钥
安装 Kubernetes 集群的时候,需要配置 Kubernetes 集群各节点间的免密登录,方便传输文件和通讯。
在 master 节点执行以下命令完成集群节点的连通性检测:
```bash
[root@localhost ~]# kubeeasy check ssh \
--host 10.3.61.250,10.3.61.217 \
--user root \
--password 000000
```
在 master 节点执行以下命令完成集群所有节点间的免密钥配置:
```bash
[root@localhost ~]# kubeeasy create ssh-keygen \
--master 10.3.61.250 \
--worker 10.3.61.217 \
--user root --password 000000
```
--mater 参数后跟 master 节点 IP,--worker 参数后跟所有 worker 节点 IP。
## 安装 Kubernetes 集群
> 本次安装的 Kubernetes 版本为 v1.22.1。

1. 在 master 节点执行以下命令部署 Kubernetes 集群:
```bash
[root@localhost ~]# kubeeasy install kubernetes \
--master 10.3.61.250 \
--worker 10.3.61.217 \
--user root \
--password 000000 \
--version 1.22.1 \
--offline-file /opt/kubernetes.tar.gz
```
部分参数解释如下:
--master:Master 节点 IP。
--worker:Node 节点 IP,如有多个 Node 节点用逗号隔开。
--version:Kubernetes 版本,此处只能为 1.22.1。
可通过命令“tail -f /var/log/kubeinstall.log”查看安装详情或排查错误。
- 部署完成后查看集群状态:
```bash
[root@k8s-master-node1 ~]# kubectl cluster-info
Kubernetes control plane is running at https://apiserver.cluster.local:6443
CoreDNS is running at
https://apiserver.cluster.local:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```
- 查看节点负载情况:
```bash
[root@k8s-master-node1 ~]# kubectl top nodes --use-protocol-buffers
NAME               CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
k8s-master-node1   235m         5%     3943Mi          33%
k8s-worker-node1   90m          2%     2449Mi          20%
```
## 登录一道云云开发平台
1. 在浏览器上访问一道云云开发平台(http://master_IP:30080)
2. 设置 admin 用户的密码(000000000000),并登录平台,如图所示:
3. 点击集群名称查看集群概览
## 部署 KubeVirt 集群
### KubeVirt 简介
根据 Garnter 的最新预测,到 2022 年将会有 75%的生产应用全部跑在容器环境之上。
基于这个预测,其实至少还有 25%的架构由于技术原因或者是认为原因都将仍然跑在旧的
架构之上,这其中虚拟机又会占据其中的大部分份额。所以在容器技术尤其是 Kubernetes
诞生之初,就已经有开源的社区在为如何使用 Kubernetes 纳管虚拟机作为一个重要的功能在
开发和贡献,KubeVirt 就是其中之一。
使用 KubeVirt 主要解决了以下两个问题:
- 从技术层面,完全的虚拟机纳管,可以完美迁移因为内核版本过于陈旧以及语言问
题而无法迁移到容器的部分应用;
- 从管理和运维层面,符合传统的运维工作方式,以前的 SSH 等运维方式可以完美
安装 KubeVirt
本次安装的 KubeVirt 版本为 v0.47.1。
在 master 节点执行以下命令安装 KubeVirt:
`[root@k8s-master-node1 ~]# kubeeasy add --virt kubevirt`
查看 Pod:
```bash
[root@k8s-master-node1 ~]# kubectl -n kubevirt get pods
NAME                              READY   STATUS    RESTARTS   AGE
virt-api-86f9d6d4f-5qj84          1/1     Running   0          4m23s
virt-api-86f9d6d4f-zkx8c          1/1     Running   0          4m23s
virt-controller-54b79f5db-pvtfh   1/1     Running   0          3m58s
virt-controller-54b79f5db-smpq2   1/1     Running   0          3m58s
virt-handler-54s6g                1/1     Running   0          3m58s
virt-handler-h5r6q                1/1     Running   0          3m58s
virt-operator-6fbd74566c-n5smw    1/1     Running   0          4m54s
virt-operator-6fbd74566c-xgp2c    1/1     Running   0          4m54s
```
### 部署 Istio
#### Istio 简介
上云给 DevOps 团队带来了不小的压力。为了可移植性,开发人员必须使用微服务来构
建应用,同时运维人员也正在管理着极端庞大的混合云和多云的部署环境。 Istio 允许用户连
接、保护、控制和观察服务。
从较高的层面来说,Istio 有助于降低这些部署的复杂性,并减轻开发团队的压力。它是
一个完全开源的服务网格,作为透明的一层接入到现有的分布式应用程序里。它也是一个平
台,拥有可以集成任何日志、遥测和策略系统的 API 接口。Istio 多样化的特性使您能够成
功且高效地运行分布式微服务架构,并提供保护、连接和监控微服务的统一方法。Istio 解决
了开发人员和运维人员所面临的从单体应用向分布式微服务架构转变的挑战。
服务网格是用来描述组成这些应用程序的微服务网络以及它们之间的交互。随着服务网
格的规模和复杂性不断的增长,它将会变得越来越难以理解和管理。它的需求包括服务发现、
负载均衡、故障恢复、度量和监控等。服务网格通常还有更复杂的运维需求,比如 A/B 测
试、金丝雀发布、速率限制、访问控制和端到端认证。
Istio 提供了对整个服务网格的行为洞察和操作控制的能力,以及一个完整的满足微服务
应用各种需求的解决方案
通过负载均衡、服务间的身份验证、监控等方法,Istio 可以轻松地创建一个已经部署了
服务的网络,而服务的代码只需很少更改甚至无需更改。通过在整个环境中部署一个特殊的
sidecar 代理为服务添加 Istio 的支持,而代理会拦截微服务之间的所有网络通信,然后使用
其控制平面的功能来配置和管理 Istio,这包括:
- 为 HTTP、gRPC、WebSocket 和 TCP 流量自动负载均衡。
- 通过丰富的路由规则、重试、故障转移和故障注入对流量行为进行细粒度控制。
- 可插拔的策略层和配置 API,支持访问控制、速率限制和配额。
- 集群内(包括集群的入口和出口)所有流量的自动化度量、日志记录和追踪。
- 在具有强大的基于身份验证和授权的集群中实现安全的服务间通信。
- Istio 为可扩展性而设计,可以满足不同的部署需求。
#### 安装 Istio
本次安装的 Istio 版本为 v1.12.0。
在 master 节点执行以下命令进行 Istio 服务网格环境的安装:
`[root@k8s-master-node1 ~]# kubeeasy add --istio istio`
查看 Pod:
```
[root@k8s-master-node1 ~]# kubectl -n istio-system get pods
NAME                                   READY   STATUS    RESTARTS   AGE
grafana-6ccd56f4b6-5d8rw               1/1     Running   0          41s
istio-egressgateway-7f4864f59c-vp7fw   1/1     Running   0          58s
istio-ingressgateway-55d9fb9f-psh67    1/1     Running   0          58s
istiod-555d47cb65-s6sq6                1/1     Running   0          64s
jaeger-5d44bc5c5d-pgt4l                1/1     Running   0          41s
kiali-9f9596d69-5j68k                  1/1     Running   0          41s
prometheus-64fd8ccd65-f2tnl            2/2     Running   0          41s
```
查看 Istio 版本信息:
```
[root@k8s-master-node1 ~]# istioctl version
client version: 1.12.0
control plane version: 1.12.0
data plane version: 1.12.0 (2 proxies)
```
### Istio 可视化
- 访问 Grafana(http://master_IP:33000)
- 访问 Prometheus(http://master_IP:30090)
- 访问 Jaeger(http://master_IP:30686)
- 访问 Kiali(http://master_IP:20001)
## 部署 Harbor 仓库
### Harbor 仓库简介
Harbor 是一个用于存储和分发 Docker 镜像的企业级 Registry 服务器,通过添加一些企
业必需的功能特性,例如安全、标识和管理等,扩展了开源 Docker Distribution。作为一个
企业级私有 Registry 服务器,Harbor 提供了更好的性能和安全。提升用户使用 Registry 构建
和运行环境传输镜像的效率。 Harbor 支持安装在多个 Registry 节点的镜像资源复制,镜像全
部保存在私有 Registry 中, 确保数据和知识产权在公司内部网络中管控。另外,Harbor 也
提供了高级的安全特性,诸如用户管理,访问控制和活动审计等。
### 安装 Harbor 仓库
本次安装的 KubeVirt 版本为 2.3.4。
在 master 节点执行以下命令进行 Harbor 仓库的安装:
`[root@k8s-master-node1 ~]# kubeeasy add --registry harbor`
部署完成后查看 Harbor 仓库状态:
```bash
[root@k8s-master-node1 ~]# systemctl status harbor
● harbor.service - Harbor
   Loaded: loaded (/usr/lib/systemd/system/harbor.service; enabled; vendor preset: disabled)
   Active: active (running) since Tue 2023-07-11 20:12:25 CST; 2min 5s ago
     Docs: http://github.com/vmware/harbor
 Main PID: 13378 (docker-compose)
    Tasks: 9
   Memory: 7.7M
   CGroup: /system.slice/harbor.service
           └─13378 /usr/local/bin/docker-compose -f /opt/harbor/docker-compose.yml up
Jul 11 20:14:12 k8s-master-node1 docker-compose[13378]: registryctl        | 127.0.0.1 - - [11/Jul/2023:12:14...0 9
Jul 11 20:14:12 k8s-master-node1 docker-compose[13378]: harbor-portal      | 127.0.0.1 - - [11/Jul/2023:12:14....0"
Jul 11 20:14:14 k8s-master-node1 docker-compose[13378]: harbor-portal      | 172.18.0.10 - - [11/Jul/2023:12:....0"
Jul 11 20:14:14 k8s-master-node1 docker-compose[13378]: nginx              | 127.0.0.1 - "GET / HTTP/1.1" 200...1 .
Jul 11 20:14:16 k8s-master-node1 docker-compose[13378]: registry           | 172.18.0.8 - - [11/Jul/2023:12:1....1"
Jul 11 20:14:16 k8s-master-node1 docker-compose[13378]: harbor-portal      | 172.18.0.8 - - [11/Jul/2023:12:1....1"
Jul 11 20:14:16 k8s-master-node1 docker-compose[13378]: registryctl        | 172.18.0.8 - - [11/Jul/2023:12:1...0 9
Jul 11 20:14:26 k8s-master-node1 docker-compose[13378]: registry           | 172.18.0.8 - - [11/Jul/2023:12:1....1"
Jul 11 20:14:26 k8s-master-node1 docker-compose[13378]: registryctl        | 172.18.0.8 - - [11/Jul/2023:12:1...0 9
Jul 11 20:14:26 k8s-master-node1 docker-compose[13378]: harbor-portal      | 172.18.0.8 - - [11/Jul/2023:12:1....1"
Hint: Some lines were ellipsized, use -l to show in full.
```
在 Web 端通过 http://master_ip 访问 Harbor,如图所示:
使用管理员账号(admin/Harbor12345)登录 Harbor,如图所示:
### 基础运维
#### 重置集群
若集群部署失败或出现故障,可重置集群重新部署,重置命令如下:
`[root@k8s-master-node1 ~]# kubeeasy reset`
重置完成后再次执行步骤 2.2.2--2.6.2 即可重新部署集群。
#### 添加节点
在 master 节点执行以下命令安装依赖包:
```bash
[root@k8s-master-node1 ~]# kubeeasy install depend \
--host 10.3.61.250 \
--user root \
--password 000000 \
--offline-file /opt/dependencies/base-rpms.tar.gz
```
其中 10.24.2.12 为新增节点的 IP 地址。
在 master 节点执行以下命令即可加入集群:
```bash
[root@k8s-master-node1 ~]# kubeeasy add \
--worker 10.3.61.250 \
--user root \
--password 000000 \
--offline-file /opt/kubernetes.tar.gz
```
# 容器云平台基础使用
## Kubernetes 集群管理
### kubectl 常用命令
创建资源对象:
`kubectl create -f xxx.yaml`(文件)
`kubectl create -f <directory>`(目录下所有文件)
查看资源对象:
`kubectl get nodes`
`kubectl get pods -n <namespace> -o wide`
描述资源对象:
`kubectl describe nodes <node-name>`
`kubectl describe pod <pod-name> -n <namespace>`
删除资源对象:
`kubectl delete -f <filename>`
`kubectl delete pods,services -l name=<label-name>`
`kubectl delete pods --all`
执行容器的命令:
`kubectl exec <pod-name> date`(默认使用第一个容器执行 Pod 的 date 命令)
`kubectl exec <pod-name> -c <container-name> date` (指定 Pod 中的某个容器执行 date 命
令)
`kubectl exec -it <pod-name> -c <container-name> /bin/bash` (相当与 docker exec -it
`<container-name>` /bin/bash)
查看容器日志:
`kubectl logs <pod-name>`
`kubectl logs -f <pod-name> -c <container-name>` (相当于 tail -f 命令)
### kubectl 格式化输出
显示 Pod 的更多信息:
`kubectl get pods -n <namespace> -o wide`
以 yaml 格式显示:
`kubectl get pods -n <namespace> -o yaml`
以自定义列显示 Pod 信息:
`kubectl get pod <pod-name> -n <namespace> -o`
custom-columns=NAME:.metadata.name,"ANNOTATIONS":.metadata.annotations
基于文件的自定义列名输出:
`kubectl get pods <pod-name> -o=custom-columns-file=template.txt`
输出结果排序:
`kubectl get pods --sort-by=.metadata.name`
## KubeVirt 集群管理
### 基本使用
创建 vmi:
`kubectl create -f vmi.yaml`
查看 vmi:
`kubectl get vmis`
删除 vmi:
`kubectl delete vmis <vmi-name>`
### virtctl 工具
virtctl 是 KubeVirt 自带的类似于 kubectl 的命令行工具,可以直接管理虚拟机,可以控
制虚拟机的 start、stop、restart 等。
启动虚拟机:
`virtctl start <vmi-name>`
停止虚拟机:
17 / 23
`virtctl stop <vmi-name>`
重启虚拟机:
`virtctl restart <vmi-name>`
## Istio 管理
### istioctl 基本使用
istioctl 用于在 Istio 系统中创建、列出、修改以及删除配置资源。
可用的路由和流量管理配置类型有: virtualservice、 gateway、 destinationrule、 serviceentry、
httpapispec、httpapispecbinding、quotaspec、quotaspecbinding、servicerole、servicerolebinding、
policy。
使用下面命令展示 istioctl 可以访问到的 Istio 配置档的名称:
```bash
# istioctl profile list
Istio configuration profiles:
default
demo
empty
external
minimal
openshift
preview
remote
```
展示配置档的配置信息:
`istioctl profile dump demo`
显示配置文件的差异:
`istioctl profile diff default demo`
可以使用 proxy-status 或 ps 命令概览服务网格:
`istioctl proxy-status`
如果输出列表中缺少某个代理则意味着它当前未连接到 Polit 实例,所以它无法接收到
任何配置。此外,如果它被标记为 stale,则意味着存在网络问题或者需要扩展 Pilot。
istioctl 允许使用 proxy-config 或者 pc 命令检索代理的配置信息。
检索特定 Pod 中 Envoy 实例的集群配置的信息:
`istioctl proxy-config cluster <pod-name> [flags]`
检索特定 Pod 中 Envoy 实例的 bootstrap 配置的信息:
`istioctl proxy-config bootstrap <pod-name> [flags]`
检索特定 Pod 中 Envoy 实例的监听器配置的信息:
`istioctl proxy-config listener <pod-name> [flags]`
检索特定 Pod 中 Envoy 实例的路由配置的信息:
`istioctl proxy-config route <pod-name> [flags]`
检索特定 Pod 中 Envoy 实例的 endpoint 配置的信息:
`istioctl proxy-config endpoints <pod-name> [flags]`
## Helm 工具
Helm 是 Kubernetes 的包管理器,类似于 Python 的 pip 和 CentOS 的 yum,主要用来管
理 Charts。Helm Chart 是用来封装 Kubernetes 原生应用程序的一系列 YAML 文件。可以在
部署应用的时候自定义应用程序的一些 Metadata,以便于应用程序的分发。
对于应用发布者而言,可以通过 Helm 打包应用、管理应用依赖关系、管理应用版本并
发布应用到软件仓库。
对于使用者而言,使用 Helm 后不用需要编写复杂的应用部署文件,可以以简单的方式
在 Kubernetes 上查找、安装、升级、回滚、卸载应用程序
### helm 常用命令
查看版本信息:
`helm version`
查看当前安装的 Charts:
`helm list`
查询 Charts:
`helm search <chart-name>`
查看 Charts 状态:
`helm status redis`
删除 Charts:
`helm delete --purge <chart-name>`
创建 Charts:
`helm create helm_charts`
测试 Charts 语法:
`helm lint`
打包 Charts:
`cd helm_charts && helm package ./`
查看生成的 yaml 文件:
`helm template helm_charts-xxx.tgz`
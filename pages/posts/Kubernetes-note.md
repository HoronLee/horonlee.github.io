---
title: 初试Kubernetes笔记
date: 2023-04-04 13:27:28
tags:
    - Linux
    - Kubernetes
    - 云计算
categories:
    
    - 云计算
    - k8s
cover: https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg
---
# 关于k8s镜像的下载
> 说实话我真的吐了，没有科学上网真的寸步难行，没办法直接拉取k8s.gcr.io的镜像，所以只能先用阿里云的
> 但是后续的安装没办法直接使用阿里云的镜像，所以还得改tag

有个小坑，k8s官方镜像的coredns是`k8s.gcr.io/coredns/coredns:v1.8.6`而阿里的却是`registry.aliyuncs.com/google_containers/coredns:v1.8.6`，官方的多套了一层`/coredns`，这直接导致我研究了半天`报错 pull access denied`，我发现后就把阿里的镜像给删掉了一层。

因为总共要下载7个镜像（master节点），所以我打算写一个shell脚本来批量操作，经过一番高强度网上冲浪，我给整出来了：
```shell
 #!/bin/bash
images_list='
k8s.gcr.io/kube-apiserver:v1.24.0
k8s.gcr.io/kube-controller-manager:v1.24.0
k8s.gcr.io/kube-scheduler:v1.24.0
k8s.gcr.io/kube-proxy:v1.24.0
k8s.gcr.io/pause:3.7
k8s.gcr.io/etcd:3.5.3-0
k8s.gcr.io/coredns/coredns:v1.8.6
'

ali_images_list='
registry.aliyuncs.com/google_containers/kube-apiserver:v1.24.0
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.24.0
registry.aliyuncs.com/google_containers/kube-scheduler:v1.24.0
registry.aliyuncs.com/google_containers/kube-proxy:v1.24.0
registry.aliyuncs.com/google_containers/pause:3.7
registry.aliyuncs.com/google_containers/etcd:3.5.3-0
registry.aliyuncs.com/google_containers/coredns:v1.8.6
'

# 批量下载阿里镜像并且更改tag为k8s标准镜像
for i in $ali_images_list
do
        docker pull $i
        for j in $images_list
        do
                docker tag $i $j
        done
done
# 删除阿里镜像
for i in $ali_images_list
do
        docker image rm $i
done
# 导出k8s镜像为tar包
docker save -o k8s-1-24-0.tar $images_list
```

第一次写脚本这样应该很不错了吧（汗

# 关于kubeadm init的报错
> 先前安装的kubeadm等组件使用了`yum -y install  kubeadm  kubelet kubectl`，默认版本比较高
> 所以引发了下面一系列错误

```bash
[root@k8s-master01 ~]# kubeadm init --kubernetes-version=v1.24.0 --pod-network-cidr=10.224.0.0/16 --apiserver-advertise-address=192.168.100.100  --cri-socket unix:///var/run/cri-dockerd.sock
this version of kubeadm only supports deploying clusters with the control plane version >= 1.25.0. Current version: v1.24.0
To see the stack trace of this error execute with --v=5 or higher
```
需要版本高于v1.25.0的control plane，但是我升级了组件镜像为v1.25.0也同样报错！
所以我采用指定yum安装kubeadm、kubelet和kubectl：
```bash
[root@k8s-master01 ~]# yum -y remove  kubeadm  kubelet kubectl
[root@k8s-master01 ~]# yum install -y kubelet-1.25.0 kubeadm-1.25.0 kubectl-1.25.0
```
不出意外又是报错
```
[preflight] Running pre-flight checks
error execution phase preflight: [preflight] Some fatal errors occurred:
        [ERROR KubeletVersion]: the kubelet version is higher than the control plane version. This is not a supported version skew and may lead to a malfunctional cluster. Kubelet version: "1.25.0" Control plane version: "1.24.0"
[preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`
To see the stack trace of this error execute with --v=5 or higher
```
意思是kubeadm还是高于panel组件的版本，这里我尝试降级kubeadm、kubelet和kubectl：
```bash
[root@k8s-master01 ~]# yum remove -y kubelet-1.25.0 kubeadm-1.25.0 kubectl-1.25.0
[root@k8s-master01 ~]# yum install -y kubelet-1.24.0 kubeadm-1.24.0 kubectl-1.24.0
```
更换kubeadm、kubelet、kubectl版本为v1.24.0之后：
```bash
[init] Using Kubernetes version: v1.24.0
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
```
这里问题不大，我一开始拉了一点v1.25.0的镜像，我给全部换成v1.24.0就好了
PS：记得再次修改配置：
```vim
# vim /etc/sysconfig/kubelet
KUBELET_EXTRA_ARGS="--cgroup-driver=systemd"

systemctl enable kubelet
```
然后就可以正常初始化了...吗？
```bash
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[kubelet-check] Initial timeout of 40s passed.


Unfortunately, an error has occurred:
        timed out waiting for the condition

This error is likely caused by:
        - The kubelet is not running
        - The kubelet is unhealthy due to a misconfiguration of the node in some way (required cgroups disabled)

If you are on a systemd-powered system, you can try to troubleshoot the error with the following commands:
        - 'systemctl status kubelet'
        - 'journalctl -xeu kubelet'

Additionally, a control plane component may have crashed or exited when started by the container runtime.
To troubleshoot, list all containers using your preferred container runtimes CLI.
Here is one example how you may list all running Kubernetes containers by using crictl:
        - 'crictl --runtime-endpoint unix:///var/run/cri-dockerd.sock ps -a | grep kube | grep -v pause'
        Once you have found the failing container, you can inspect its logs with:
        - 'crictl --runtime-endpoint unix:///var/run/cri-dockerd.sock logs CONTAINERID'
error execution phase wait-control-plane: couldn't initialize a Kubernetes cluster
To see the stack trace of this error execute with --v=5 or higher
```
初始化control-plane超时了
至此，问题还没有解决。
---
layout: post
title: KubeVirt入门
date: 2024-05-30 16:22:50
tags: 
categories: 
cover: https://tse3-mm.cn.bing.net/th/id/OIP-C.B4Rc1aupXxDrxKPfYpOsMQHaDP?rs=1&pid=ImgDetMain
password: 
hide: 
---
# 什么是 KubeVirt？

​	KubeVirt 是一个开源项目，它使得虚拟机可以像容器一样被 Kubernetes 部署，消费和管理。它提供了一个统一的平台，让用户可以根据不同的需求，使用容器或者虚拟机来构建云原生应用。KubeVirt 项目于 2016 年启动，由 Red Hat, IBM, Google, Intel, SUSE 等多家公司和组织共同推动和贡献。经过 7 年的不懈努力，KubeVirt 于 2023 年 7 月发布了 v1.0.0 版本，标志着它已经达到了生产就绪的水平，并且有着健康的社区。(在此之前，它已经被很多公司用到了生产环境)

# 为什么选择 KubeVirt？

​	KubeVirt 技术满足了已经采用或想要采用 [Kubernetes](https://kubernetes.io/) 的开发团队的需求，但 拥有无法轻松容器化的基于虚拟机的现有工作负载。更具体地说， 技术提供了一个统一的开发平台，开发人员可以在其中构建、修改和部署应用程序 驻留在应用程序容器和虚拟机中，位于一个公共的共享环境中。

​	好处是广泛而显着的。依赖于现有基于虚拟机的工作负载的团队是 能够快速容器化应用程序。通过将虚拟化工作负载直接放置在开发工作流中， 团队可以随着时间的推移分解它们，同时仍然根据需要利用剩余的虚拟化组件。

# 必要条件

KubeVirt 需要 BIOS 支持虚拟化，也就是必须拥有 支持 VT-x（vmx）的 Intel 处理器 或者支持  AMD-V (svm) 技术的 AMD 处理器，使用`grep -Eoc '(vmx|svm)' /proc/cpuinfo`查看是否支持虚拟化，若输出不为0则支持虚拟化，可以运行 KubeVirt。

# 在 Kubernetes 中安装 KubeVirt

## 部署KubeVirt operator

设置版本环境变量

```bash
export VERSION=$(curl -s https://storage.googleapis.com/kubevirt-prow/release/kubevirt/kubevirt/stable.txt)
echo $VERSION
```

创建资源

```bash
kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/kubevirt-operator.yaml
```

## 部署 KubeVirt 自定义资源定义

```bash
kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/kubevirt-cr.yaml
```

## 检查部署

默认情况下，KubeVirt 将部署 7 个 Pod、3 个Services、1 个daemonset、3 个deployment、3 个replica sets。

- 检查部署：

  ```bash
  kubectl get kubevirt.kubevirt.io/kubevirt -n kubevirt -o=jsonpath="{.status.phase}"
  ```

- 检查组件：

  ```bash
  kubectl get all -n kubevirt
  ```

## Virtctl

> KubeVirt 提供名为 virtctl 的附加二进制文件，用于快速访问虚拟机的串行和图形端口，并处理启动/停止操作。

### Install

`virtctl` 可从 KubeVirt github 页面的发布页面获取。

- 使用这些命令安装:

  - 设置版本`VERSION=$(kubectl get kubevirt.kubevirt.io/kubevirt -n kubevirt -o=jsonpath="{.status.observedKubeVirtVersion}")`

  - 设置架构`ARCH=$(uname -s | tr A-Z a-z)-$(uname -m | sed 's/x86_64/amd64/') || windows-amd64.exe`

  - 查看架构`echo ${ARCH}`

  - 下载文件`curl -L -o virtctl https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/virtctl-${VERSION}-${ARCH}`

  - 安装

    - ```bash
      chmod +x virtctl
      sudo install virtctl /usr/local/bin
      ```

### Install as Krew plugin

`virtctl` can be installed as a plugin via the `krew` plugin manager(https://krew.dev/). Occurrences of can then be read as .`virtctl <command>...kubectl virt <command>...`

- Run the following to install:

  ```bash
  kubectl krew install virt
  ```

# 接下来...

还没写完，请参照文章[使用 CDI 进行实验 |KubeVirt.io](https://kubevirt.io/labs/kubernetes/lab2)
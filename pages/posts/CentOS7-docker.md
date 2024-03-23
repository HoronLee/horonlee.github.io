---
title: CentOS7安装配置docker
businesscard: true
date: 2022-11-27 14:46:08
updated:
tags: 
    - CentOS
    - Linux
categories: 
    - 服务器运维
    - Docker
keywords:
description: CentOS7安装配置docker以及更改配置文件
top_img:
comments:
cover: https://cdn.1min30.com/wp-content/uploads/2018/04/Logo-Docker.jpg
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
swiper_index: 
---
## CentOS下安装和配置Dcoker有一些麻烦，故本人请教学长后打算写下一些经验
### step 1：安装必要的一些系统工具
**先获得管理员Bash权限：**`su root`
```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```
### Step 2：添加软件源信息
```bash
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
### Step 3：更改软件源部分信息
```bash
sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```
### Step 4：更新并安装Docker-CE
```bash
yum makecache fast
yum -y install docker-ce
```
---
## 对Dcoker进行一些配置
1. 先运行Docker，生成配置文件：`systemctl start dokcer`
2. 编辑配置文件：`vi /etc/docker/daemon.json`
3. 键入配置文件：
**注意⚠：这个文件不能有任何字符错误，井号及其后面的字符不需要输入（仅作为注释），缩进采用四个空格！**
    ```bash
    {
        "insecure-registries":["0.0.0.0/0"],    #防止访问Harbor时报Https错
        "exec-opts":["native.cgroupdriver=cgroupfs"]    #改变docker进程方式为cgroupfs(可以不加次条)
    }
    ```
    [cgroupfs和systemd的区别](https://blog.csdn.net/avatar_2009/article/details/109603870)
4. 键入Esc，`:wq`保存退出即可
5. 重启docker：`systemctl restart docker`
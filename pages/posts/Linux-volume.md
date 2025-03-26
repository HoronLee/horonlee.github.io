---
title: Linux在线扩容磁盘
businesscard: true
date: 2022-12-19 17:19:14
updated:
tags: 
    - Linux
categories: 
    - Linux
keywords:
description:
top_img:
comments:
cover: https://tse3-mm.cn.bing.net/th/id/OIP-C.wnNG3ph-NCpb_xjB1-FsBQHaE8?pid=ImgDet&rs=1
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
CentOS7：
进入SSH并运行如下命令
```bash
yum install cloud-utils-growpart gdisk xfsprogs e2fsprogs
```
使用`fdisk -l`命令根据大小及其他信息查看要扩容的云盘，本例子中要扩容的分区为/dev/sda1
<!-- more -->
执行命令：
```bash
growpart /dev/sda 1
```
#centos 7 使用
```bash
resize2fs /dev/sda1
```
#centos 8 使用
```bash
xfsprogs  /dev/sda1
```
注意：如果您把系统设置成了中文，在运行growpart命令之前必须先运行：`LANG=en_US.UTF-8`，否则会报错如：unexpected output in sfdisk --version

CentOS6：
进入SSH并执行命令：
```bash
yum install -y dracut-modules-growroot
dracut -f
growpart /dev/sda 1
```
执行完上述命令后，使用reboot命令重启服务器。
重启完毕执行命令：
```bash
resize2fs /dev/sda1
```
Ubuntu/Debian系列操作系统：
```bash
apt install cloud-guest-utils
apt install xfsprogs
```
使用`fdisk -l`命令根据大小及其他信息查看要扩容的云盘，本例子中要扩容的分区为/dev/sda1

执行命令：
```bash
growpart /dev/sda 1
resize2fs /dev/sda1
```
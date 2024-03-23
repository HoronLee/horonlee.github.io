---
title: Ubuntu安装配置Docker&Compose
businesscard: true
date: 2022-12-02 15:33:48
updated:
tags: 
    - Ubuntu
    - Linux
categories: 
    - 服务器运维
    - Docker
    - Dcoker-compose
keywords:
description: Ubuntu关于docker&compose的教程
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
# 更新软件包索引
添加一个新的 HTTPS 软件源：
```bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```
# 导入源仓库的 GPG key：
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

# 添加apt软件源
```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
现在，Docker 软件源被启用了，你可以安装软件源中任何可用的 Docker 版本。

# 安装docker
建议直接使用apt来进行安装。
```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin
```
安装docker-compose
```bash
sudo apt-get install docker-compose
```
查看docker和docker-compose的版本`sudo docker --version`、`sudo docker-compose --version`
> 参考：https://docs.docker.com/engine/install/ubuntu/
>能看官方文档就看官方文档吧！😂
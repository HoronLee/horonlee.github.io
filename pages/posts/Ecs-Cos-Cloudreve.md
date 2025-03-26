---
title: Ecs+Cos+Cloudreve
businesscard: true
date: 2023-04-03 18:33:39
updated:
tags:
    - CentOS
    - Linux
    - Cloudreve
    - COS
categories:
    
    - 对象存储
keywords:
description:
top_img:
comments:
cover: https://img.81857.net/2020/0707/20200707024741450.jpg
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
# 下载安装Cloudreve

> 这里我选用的是阿里云的Ecs轻应用
> 并且不是使用Docker来部署（那也太傻瓜操作了吧😂

1. 登录到Shell终端
2. 部署[Cloudreve](https://cloudreve.org/)云盘软件
3. 下载Cloudreve-3.7.1软件包👉[GitHub-Release](https://github.com/cloudreve/Cloudreve/releases/tag/3.7.1)，记得选择Linux、amd64版的tar.gz包（cloudreve_3.7.1_linux_amd64.tar.gz），下载后上传到服务器的某个目录
4. cd进上传软件包的目录
5. 解压文件`tar -xvzf cloudreve_3.7.1_linux_amd64.tar.gz`
6. 解压之后文件应该全部在当前目录，现在给予运行权限`chmod +x ./cloudreve`
7. 现在理论上可以直接运行Cloudreve了`./cloudreve`，运行成功之后会显示初始账号密码，访问网页的地址就是http://*$IP*:5212（记得在服务器安全组开启5212的端口放行）。

>但是为了以后方便开机自启和软件后台运行，我们需要为它配置[守护进程](https://blog.csdn.net/lianghe_work/article/details/47659889)

登录进去的主页大概是张这样的（我改了一些配色啥的）：![Cloudreve](https://minio-api.horonlee.com/blogpic/img/20250312115454563.png)

# 配置守护进程
> 这里我们采用systemd方式（Systemctl）
> 还有一个叫做Supervisor的，我没用过所以不写（逊了

1. 编辑配置文件`vim /usr/lib/systemd/system/cloudreve.service`，其中PATH_TO_CLOUDREVE替换成你cloudreve的安装目录
```vim
[Unit]
Description=Cloudreve
Documentation=https://docs.cloudreve.org
After=network.target
After=mysqld.service
Wants=network.target

[Service]
WorkingDirectory=/PATH_TO_CLOUDREVE
ExecStart=/PATH_TO_CLOUDREVE/cloudreve
Restart=on-abnormal
RestartSec=5s
KillMode=mixed

StandardOutput=null
StandardError=syslog

[Install]
WantedBy=multi-user.target
```
2. 更新配置`systemctl daemon-reload`
3. 启动服务`systemctl start cloudreve`
4. 设置自启动`systemctl enable cloudreve`
5. 查看进程状态和部分log`systemctl status cloudreve`

# 使用Nginx配置反向代理
> 我也想，但是考虑到国内服务器备案变严格了，非80、443端口也没办法用域名直接访问了，所以就作此就罢。

# 连接到腾讯Cos对象储存

直接看[这篇文章](https://cloud.tencent.com/developer/article/2041954)罢，一路没什么好说的。
配置完cos储存策略后，记得设置你所在的用户组的储存策略为cos的，然后上传一个文件试试，如果没问问题就会呈现以下效果：
![Cloudreve+cos](https://minio-api.horonlee.com/blogpic/img/20250312115457671.png)

# 使用宝塔面板Nginx的重定向或者反向代理代理IP+端口的访问方式

> 我推荐使用重定向，因为这样不用看代理服务器的带宽，也能低成本的让我们免去记忆Cloudreve所在服务器IP的麻烦

注意：记得取消勾选**保留URI参数**，要不然后面会多一个“/”导致直接打开的网页404。

![宝塔设置](https://minio-api.horonlee.com/blogpic/img/20250312115459942.png)
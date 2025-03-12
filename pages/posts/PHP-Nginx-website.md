---
title: 使用PHP+Nginx搭建网页
businesscard: true
date: 2023-04-21 13:35:43
updated:
tags:
    - Ubuntu
    - Linux
    - PHP
    - Nginx
categories:
    - 服务器运维
    - PHP
keywords:
description:
top_img:
comments:
cover: https://tse1-mm.cn.bing.net/th/id/OIP-C.XjFkev6xFnnCtjNLejCCaAHaHa?pid=ImgDet&rs=1
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
swiper_index: 3
---
> 本教程基于[这篇Nginx文章](https://blog.horon.top/2023/04/20/ubuntu安装配置nginx及基础用法/)，如果不解之处可前往查阅
<!-- more -->
# 安装PHP
```bash
sudo apt-get update     # 更新软件源
sudo apt-get install php    # 安装php
php -v  # 查看php版本
```

# 安装PHP-fpm
1. 先确定php版本`php -v`
```bash
PHP 8.1.2-1ubuntu2.11 (cli) (built: Feb 22 2023 22:56:18) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.1.2, Copyright (c) Zend Technologies
    with Zend OPcache v8.1.2-1ubuntu2.11, Copyright (c), by Zend Technologies
```
可以看到我这里php版本是8.1（目前默认安装的最新版）
2. 安装对应版本的PHP-fpm`sudo apt-get install php-fpm`
3. 查看php-fpm的状态`sudo systemctl status php8.1-fpm`
```bash
root@HoronLeeFirstEcs:~# systemctl status php8.1-fpm
● php8.1-fpm.service - The PHP 8.1 FastCGI Process Manager
     Loaded: loaded (/lib/systemd/system/php8.1-fpm.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-04-20 20:10:43 CST; 17h ago
       Docs: man:php-fpm8.1(8)
    Process: 259478 ExecStartPost=/usr/lib/php/php-fpm-socket-helper install /run/php/php-fpm.sock /etc/php/8.1/fpm/pool.d/www.conf 81 (code=exited, status=0/SUCCESS)
   Main PID: 259475 (php-fpm8.1)
     Status: "Processes active: 0, idle: 2, Requests: 4, slow: 0, Traffic: 0req/sec"
      Tasks: 3 (limit: 1929)
     Memory: 8.9M
        CPU: 2.739s
     CGroup: /system.slice/php8.1-fpm.service
             ├─259475 "php-fpm: master process (/etc/php/8.1/fpm/php-fpm.conf)
```

# 配置Nginx和PHP-FPM
> 使用Nginx发布PHP网页，就需要这两个程序之间有沟通，这个时候就需要对其进行相应配置

1. 配置Nginx`sudo vim /etc/nginx/sites-available/default`
2. 在其中自带的server字段中找到`# pass PHP scripts to FastCGI server`下的关于php的被注释的子字段（大约第56行），将其改为（或者直接添加）：
**注意PHP版本号！**
```vim
location ~ \.php$ {
               include snippets/fastcgi-php.conf;
               fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        }
```
如果你找不到位置，我这里提供其他部分的内容：
```vim
server_name _;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
在这里👉location ~ \.php$ {
               include snippets/fastcgi-php.conf;
               fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        }👈在这里
        # pass PHP scripts to FastCGI server
        #
        #location ~ \.php$ {
        #       include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
        #       fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        #}
```
3. 配置php-fpm`vim /etc/php/8.1/fpm/pool.d/www.conf`
```vim
; The address on which to accept FastCGI requests.
; Valid syntaxes are:
;   'ip.add.re.ss:port'    - to listen on a TCP socket to a specific IPv4 address on
;                            a specific port;
;   '[ip:6:addr:ess]:port' - to listen on a TCP socket to a specific IPv6 address on
;                            a specific port;
;   'port'                 - to listen on a TCP socket to all addresses
;                            (IPv6 and IPv4-mapped) on a specific port;
;   '/path/to/unix/socket' - to listen on a unix socket.
; Note: This value is mandatory.
listen = /run/php/php8.1-fpm.sock
```
一般来说自带的配置文件不用改，我没有做任何更改
4. 重启一下nginx和php-fpm：`sudo systemctl restart nginx`&`sudo systemctl restart php8.1-fpm`

# 测试PHP站点

1. 进入默认站点目录`cd /var/www/html`
2. 新建php文件`sudo vim test.php`
3. 写入测试内容`<?php phpinfo();?>`
4. 保存退出
5. 访问`http://$IP/test.php`，可以显示PHP系统信息即表示PHP站点搭建完成！
![PHPInfo](https://minio-api.horonlee.com/blogpic/img/20250312120233597.png)
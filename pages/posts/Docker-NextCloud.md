---
title: 使用Docker部署NextCloud
businesscard: true
date: 2022-12-20 15:30:00
updated:
tags: 
    - CentOS
    - Linux
    - NextCloud
categories: 
    - 服务器运维
    - Docker
keywords:
description:
top_img:
comments:
cover: https://pic4.zhimg.com/v2-3e8ac6726d140c2590887773da7dcdea_720w.jpg?source=172ae18b
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
# 使用docker-compose创建、配置nextcloud
参考博文（docker-compose来源）：https://blog.csdn.net/shangyexin/article/details/106306680
## 创建一个用于存放nextcloud文件的目录，并在其中新建名为docker-compose.yaml的文件写入以下内容
```vim
version: '3.2'

services:
  db:
    image: postgres:12
    container_name: nextcloud_db
    restart: always
    volumes:
      - ./db:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB_FILE=/run/secrets/postgres_db
      - POSTGRES_USER_FILE=/run/secrets/postgres_user
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
    secrets:
      - postgres_db
      - postgres_password
      - postgres_user

  app:
    image: nextcloud
    container_name: nextcloud
    restart: always
    ports:
      - 9002:80
    volumes:
      - ./app:/var/www/html
    environment:
      - POSTGRES_HOST=db
      - POSTGRES_DB_FILE=/run/secrets/postgres_db
      - POSTGRES_USER_FILE=/run/secrets/postgres_user
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
      - NEXTCLOUD_ADMIN_PASSWORD_FILE=/run/secrets/nextcloud_admin_password
      - NEXTCLOUD_ADMIN_USER_FILE=/run/secrets/nextcloud_admin_user
    depends_on:
      - db
    secrets:
      - nextcloud_admin_password
      - nextcloud_admin_user
      - postgres_db
      - postgres_password
      - postgres_user

secrets:
  nextcloud_admin_password:
    file: ./init_secrets/nextcloud_admin_password.txt # put admin password to this file
  nextcloud_admin_user:
    file: ./init_secrets/nextcloud_admin_user.txt # put admin username to this file
  postgres_db:
    file: ./init_secrets/postgres_db.txt # put postgresql db name to this file
  postgres_password:
    file: ./init_secrets/postgres_password.txt # put postgresql password to this file
  postgres_user:
    file: ./init_secrets/postgres_user.txt # put postgresql username to this file
```
## 在docker-compose文件夹下添加一些配置文件
总共添加了五个文件，在`./init_secrets/`下，文件结构名称细节如下：
> "."代表的就是当前目录（即第一步新建的文件夹）
```bash
.
├── ./app
│   ├── ./app/3rdparty
│   ├── ./app/apps
│   ├── ...省略
│   └── ./app/version.php
├── ./db
│   ├── ./db/base
│   ├── ./db/global
│   ├── ...省略
│   └── ./db/postmaster.pid
├── ./docker-compose.yaml   #docker模板文件
└── ./init_secrets          #这个文件夹以及下方的txt文件都需要自己新建
    ├── ./init_secrets/nextcloud_admin_password.txt #填入你想要设置的nextcloud的管理员密码
    ├── ./init_secrets/nextcloud_admin_user.txt     #填入你想要设置的nextcloud的管理员账号
    ├── ./init_secrets/postgres_db.txt              #填入使用的postgres数据库的数据库名
    ├── ./init_secrets/postgres_password.txt        #填入使用的postgres数据库的数据库密码
    └── ./init_secrets/postgres_user.txt            #填入使用的postgres数据库的访问用户名
```
## 启动docker-compose并配置访问域名
1. 启动docker`sudo docker-compose up -d`
2. 如果没有任何Error报错并且compose正常起来了，那就可以试着访问`http://$IP:9002/`来访问你的nextcloud的站点了
3. 记得填写在`./init_secrets/`下当时新建的文件中的信息（账号密码等）
4. 一般你会遇到这个问题：“您正在访问来自不信任域名的服务器”，那么该如何解决呢？
## 添加受信任的域名或者IP访问nextcloud站点
1. 查看nextcloud容器状态`docker ps -a`
```bash
CONTAINER ID   IMAGE                                COMMAND                  CREATED        STATUS                  PORTS                                                           NAMES
83bedf582a71   nextcloud                            "/entrypoint.sh apac…"   5 hours ago    Up 4 hours              0.0.0.0:9002->80/tcp, :::9002->80/tcp                           nextcloud
7cf9ee8751af   postgres:12                          "docker-entrypoint.s…"   5 hours ago    Up 5 hours              5432/tcp                                                        nextcloud_db
```
1. 进入nextcloud的docker控制台`docker exec -it $ID bash`
2. 搜寻一下nextcloud的config.php配置文件`find / -name "config.php"`
```bash
/var/www/html/config/config.php
find: '/proc/1/map_files': Operation not permitted
find: '/proc/32/map_files': Operation not permitted
find: '/proc/33/map_files': Operation not permitted
find: '/proc/34/map_files': Operation not permitted
find: '/proc/35/map_files': Operation not permitted
find: '/proc/36/map_files': Operation not permitted
find: '/proc/37/map_files': Operation not permitted
find: '/proc/38/map_files': Operation not permitted
find: '/proc/44/map_files': Operation not permitted
find: '/proc/45/map_files': Operation not permitted
```
1. nextcloud的容器中默认不带有绝大部分常用软件（指令），所以需要自己安装，先更新软件源`apt-get update`
2. 然后安装vim编辑器`apt-get install vim -y`，随后确保vim编辑器安装完成。
3. 编辑配置文件`vi /var/www/html/config/config.php`，更改其中的'trusted_domains'配置文件（在`0 => '127.0.0.1',`下面添加一行配置文件）：
```vim
'trusted_domains' => array(
        0 => '127.0.0.1',
        1 => preg_match('/cli/i',php_sapi_name())?'127.0.0.1':$_SERVER['SERVER_NAME'],
),
```
释义：$_SERVER[‘SERVER_NAME’] 为获得当前访问的域名或IP，最初只设置了server_name，后来在查看cron任务时，发现在cli模式下是无法获得的，所以增加了cli模式判断，cli模式直接给个本地IP忽悠程序，正常模式将当前访问的域名或IP动态的添加的信任的域名中。——来自https://www.codeprj.com/blog/a315071.html
4. 保存退出，重启容器，over
[![nextcloud-dashboard.png](https://pic.horon.top/images/2022/12/20/nextcloud-dashboard.png)](https://pic.horon.top/image/V8n)
# 更新NextCloud
当提示有新的版本可以升级时，可以使用下面的命令进行升级:
```bash
docker-compose down
docker-compose pull
docker-compose up -d
```
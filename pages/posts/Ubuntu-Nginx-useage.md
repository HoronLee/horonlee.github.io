---
title: Ubuntu安装配置Nginx及基础用法
businesscard: true
date: 2023-04-20 22:05:15
tags:
  - Ubuntu
  - Linux
  - Nginx
categories:
  - 服务器运维
  - Nginx
cover: https://tse4-mm.cn.bing.net/th/id/OIP-C.E5LOy1agA--ii7IJgV7WMAHaD4?pid=ImgDet&rs=1
---
# 安装Nginx
直接apt安装即可`sudo apt install nginx`

## 查看Nginx服务状态
```bash
sudo systemctl enable nginx    # 开机自启
sudo systemctl status nginx    # 输出以下结果即为Nginx正常运行
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-04-20 20:08:51 CST; 2h 4min ago
       Docs: man:nginx(8)
    Process: 258455 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
    Process: 258456 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 258457 (nginx)
      Tasks: 3 (limit: 1929)
     Memory: 3.7M
        CPU: 44ms
     CGroup: /system.slice/nginx.service
             ├─258457 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
```
## 访问Nginx初始页
> 别忘记先关闭ufw防火墙，或者开通服务器的80端口
> 文中的`$IP`就是虚拟机的IP地址，在虚拟机中也就是`127.0.0.1`

在浏览器输入`http://$IP/`，若出现`Welcome to nginx!`即为成功运行Nginx。

# Nginx文件结构
> 文中的操作系统使用的是Ubuntu，和CentOS没有很大区别。
> 以下内容为本人自己的总结（若有疏漏请指正）

Nginx分为站点目录和配置文件目录，其中：
- 站点目录在`/var/www`下
  - 其中`html`为默认文件夹，其中的`index.nginx-debian.html`为Nginx默认的站点目录
- 配置文件目录在`/etc/Nginx`下
  - 其中`sites-available/`中的`default`就是Nginx的默认配置文件，里面可以设置Nginx最重要的虚拟主机，重定向等功能
  - 以下是文件结构：
```bash
root@HoronLeeFirstEcs:/etc/nginx# tree
.
├── conf.d
├── fastcgi.conf
├── fastcgi_params
├── koi-utf
├── koi-win
├── mime.types
├── modules-available
├── modules-enabled
│   ├── 50-mod-http-geoip2.conf -> /usr/share/nginx/modules-available/mod-http-geoip2.conf
│   └── 省略
├── nginx.conf
├── proxy_params
├── scgi_params
├── sites-available
│   ├── '
│   └── default
├── sites-enabled
│   └── default -> /etc/nginx/sites-available/default
├── snippets
│   ├── fastcgi-php.conf
│   └── snakeoil.conf
├── uwsgi_params
└── win-ut
```

# 使用Nginx新建一个网页

1. 进入站点站点目录`cd /var/www`
2. 新建网页文件夹`mkdir /var/www/test`
3. 新建网页文件并写入html内容`vim test.html`
```vim
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>迫真测试网页</title>
    <title>表白初号机</title>
  </head>
</html>
```
4. 保存退出后再进入站点配置文件目录`cd /etc/Nginx/sites-available`
5. 编辑默认配置文件`vim default`
6. 添加一个server字段
```vim
server {
        listen 81;   # 这是监听端口
        listen [::]:81;  # 这是监听端口（IPv6）   

        server_name test;    # 服务器名字，随意

        root /var/www/test;  # 站点目录
        index index.html;    # 站点默认文件（即优先使用的网页文件）

        location / {         # 暂时不用深入了解，可以理解为是一个规则
                try_files $uri $uri/ =404;
        }
}
```
7. 编辑好之后保存并退出（别忘记开通防火墙的81端口）
8. 重启Nginx服务`sudo systemctl restart`
9. 访问`http://$IP:81`，如果上一步没有报错，并且看到了新的网页，就说明建站成功了！

# 使用Nginx进行重定向
> 比如我需要在访问`http://$IP:82`的时候自动跳转到`http://$IP:81`
> 这个时候就需要用到Nginx的重定向
> 重定向有多种方法，这里采用upstream字段的方法

1. 和之前一样编辑站点配置文件`vim default`
2. 在整个文件的最前面添加以下字段：
```vim
upstream test_servers {
        server 127.0.0.1:81 max_fails=5 fail_timeout=10s weight=10;
}
```
3. 然后在下面新建一个虚拟服务器（和之前差不多）
```vim
server {
        listen 82;
        location / {
            proxy_pass http://test_servers;
        }
}
```
4. 这你可以理解为这个服务器由`http://test_servers`进行代理，监听的是81端口，但是最终显示的还是`test_servers`中所属权重（weight=）最高的网页内容
5. 重启Nginx服务`sudo systemctl restart`
6. 访问`http://$IP:82`，如果上一步没有报错，并且看到之前端口为81的网页了！

> 写在最后，其实upstream块是Nginx用来做负载均衡用的，这里只有一个后端服务器，所以无论如何都会只指向这个站点，起到了所谓的重定向，实际应用当中不可能这样操作，要不然你的老板可能让你第二天不要去上班了。

# 使用Nginx进行负载均衡
> 其实就是建立反向代理和upstream
> 比如我们想要访问test.com这个网页，但是我们想要将访问的实际请求分不到服务器集群中的两台机器上
1. 和之前一样编辑站点配置文件`vim default`
2. 在整个文件的最前面添加以下字段：
```vim
upstream test_com {
        server 192.168.1.2:80 max_fails=5 fail_timeout=10s weight=10; # 这里的upstream字段中添加两个相同权重(weight)的服务器
        server 192.168.1.3:80 max_fails=5 fail_timeout=10s weight=10; # 就可以实现负载均衡，还能根据各个服务器的性能进行分配
}
```
3. 然后在下面新建一个虚拟服务器（和之前差不多）
```vim
server {
        listen 80;
        location / {
            proxy_pass http://test_com;
        }
}
```

# 使用Nginx运行PHP网页
> 应该写在别的文章里哦~
### 更新中...
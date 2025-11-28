---
title: 通过SRS实现在线直播
businesscard: true
date: 2022-11-27 11:41:22
tags:
  - Ubuntu
  - Linux
categories:
  - 练习
  - 推流
cover: https://ossrs.net/lts/zh-cn/assets/images/SRS-SingleNode-4.0-sd-658929b39b78f504e82487d55e1bd282.png
---
# Dcoker Compose封装SRS-docker
## 1.Docker指令→制作Docker-compose
### 什么是[docker-compose？](https://www.runoob.com/docker/docker-compose.html)
### 什么是[SRS？](https://ossrs.net/lts/zh-cn/assets/images/SRS-SingleNode-4.0-sd-658929b39b78f504e82487d55e1bd282.png)
---
```bash
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/docker.conf
```
- 可以看到，镜像采用了阿里的地址：`registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4`
- 端口开了三个：`1935，1985，8080`
由此可以直接写出一份docker-compose.yaml
```yaml
version: '3'
services:
  ossrs:
    image: registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4
    ports:
      - 1985:1985
      - 8080:8080
      - 1935:1935
    container_name: srs
    restart: always
    hostname: srs
```
1. 进入root目录：cd /root
2. 创建docker文件夹：mkdir docker
3. 进入docker文件夹：cd docker/
4. 创建srs文件夹：mkdir srs
5. 进入srs文件夹：cd srs/
6. 创建dockercompose文件：touch docker-compose.yaml
7. 写入模板内容：vim docker-compose.yaml
    1. 点击i进入插入
    2. 在Xshell终端进行粘贴
    3. 点击Esc，输入`:wq`，保存退出
## 2.使用docker-compose来启用容器
1. 进入srs的docker-compose模板文件目录下
2. 在yaml文件目录下执行`docker-compose up -d`即可开启docker-compose
3. 输入`docker-compose ps`来查看容器模板是否正常启动
    ```bash
    NAME                COMMAND                  SERVICE             STATUS              PORTS
    srs                 "./objs/srs -c conf/…"   ossrs               running             0.0.0.0:1935->1935/tcp, :::1935->1935/tcp, 0.0.0.0:1985->1985/tcp, :::1985->1985/tcp, 8000/udp, 0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 10080/udp
    ```
4. 输入`docker ps`来查看容器是否运行
    ```bash
    CONTAINER ID   IMAGE                                           COMMAND                  CREATED      STATUS        PORTS                                                                                                                                                  NAMES                                                                                                   "docker-entrypoint.s…"   2 days ago   Up 26 hours   3306/tcp                                                                                                                                               nextcloud-db-1
    2c030381a45b   registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4   "./objs/srs -c conf/…"   2 days ago   Up 26 hours   0.0.0.0:1935->1935/tcp, :::1935->1935/tcp, 0.0.0.0:1985->1985/tcp, :::1985->1985/tcp, 8000/udp, 0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 10080/udp   srs
    ```
## 3.进入Web界面进行推流和在线查看
`$IP:8080`**代表当前IP地址:指定的端口**，$IP是会变动的
1. 进入`http://$IP:8080/`，可以看到简洁的SRS描述：`rtmp://$IP/live/livestream`
2. 打开OBS[**下载地址**](https://obsproject.com/)
3. OBS中添加屏幕录像到场景的画布，在设置-推流中，服务器填写`rtmp://$IP:8080/live/livestream`，串流密钥填写`stream`，应用退出，然后在主页开始推流
4. 随后就可以通过`http://$IP:8080`→`控制台`→`视频流`→`预览`来进行管理和观看直播了！
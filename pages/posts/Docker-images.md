---
title: Docker镜像的封装和制作
businesscard: true
date: 2022-11-29 08:29:08
tags:
  - Linux
categories:
  - 服务器运维
  - Docker
description: 使用Dockerfile来制作docker镜像
cover: https://tse4-mm.cn.bing.net/th/id/OIP-C.lWhTZRrL2WT6AUIJ0wTAwgHaE8?pid=ImgDet&rs=1
---
# Ubuntu环境下制作自己的Docker镜像——MC服务器
> 制作Docker镜像一般有2种方法：
    1. 使用DockerHub仓库中已有的环境，安装自己使用的软件环境后完成image创建
    2. 通过Dockerfile，完成镜像image的创建
        本教程采用较为方便的Dockerfile方法进行制作
## 1. 制作一个MCServer的tar.gz的压缩包
这是paper-1.19.2-294.jar服务端核心的`run.sh`启动脚本
```sh
nohup java -Xms2048m -Xmx3096m -jar /root/docker/mcjava/mcserver/paper-1.19.2-294.jar nogui &
```
启动之后就会自动下载一些必要文件，然后我们再在当前操作的目录下下载一个Linux的Jdk1.17的RPM安装包
**项目文件架构图总览↓**
```bash
.
├── Halo    # 其他docker目录
│   └── docker-compose.yaml
└── mcjava  # 项目文件夹
    ├── docker-compose.yaml # docker-compose
    ├── Dockerfile  # 制作镜像必要的文件
    ├── jdk-17.0.5_linux-x64_bin.rpm    # MCServer需要的Jdk
    ├── mcserver    # MC服务器文件夹，里面是服务端完整文件
    └── mcserver.tar.gz # mcserver里面的文件压缩的tar.gz压缩包
```
# 2. 制作Dockerfile文件用于构建镜像
1. 新建文件`touch Dockerfile`
2. 编辑内容`vim Dockerfile`
3. 可以直接复制以下内容粘贴到终端
    ```yaml
    FROM 10.3.61.254:81/operating-system/centos:7.5.1804    # 本地Harbor中的centos7.5镜像，作为基础镜像
    MAINTAINER Horon    # 镜像的作者
    USER root   # 镜像中的指令操作权限为root
    ADD jdk-17.0.5_linux-x64_bin.rpm /root/ # 将Dockerfile目录下的jdk安装包放入容器中的/root/下
    RUN rpm -ivh /root/jdk-17.0.5_linux-x64_bin.rpm # 在容器中安装jdk
    RUN rm -f /root/jdk-17.0.5_linux-x64_bin.rpm    # 删除容器中的jdk安装包
    ADD mcserver.tar.gz /root/docker/mcjava/    # 将Dcokerfile目录下的mc服务端压缩包放入容器中指定目录，会自动解压
    RUN chmod 777 /root/docker/mcjava/mcserver/run.sh   # 给予MC服务器中的启动脚本所有权限
    EXPOSE 25565    # 开放容器中CentOS的防火墙25565端口
    ENTRYPOINT ["sh"]   # 守护进程为sh（一般可以写这个）
    ```
4. 保存退出Esc`:wq`
### Dockerfile的其他指令：
> 常用指令如下
    1. ADD
    ADD命令有两个参数，源和目标。它的基本作用是从源系统的文件系统上复制文件到目标容器的文件系统。如果源是一个URL，那该URL的内容将被下载并复制到容器中。
    2. COPY
    用于将文件作为一个新的层添加到镜像中。通常使用 COPY 指令将应用代码赋值到镜像中。
    3. CMD
    和RUN命令相似，CMD可以用于执行特定的命令。和RUN不同的是，这些命令不是在镜像构建的过程中执行的，而是在用镜像构建容器后被调用。
    4. ENTRYPOINT
    配置容器启动后执行的命令，并且不可被 docker run 提供的参数覆盖。
    每个 Dockerfile 中只能有一个 ENTRYPOINT，当指定多个时，只有最后一个起效。
    ENTRYPOINT 帮助你配置一个容器使之可执行化，如果你结合CMD命令和ENTRYPOINT命令，你可以从CMD命令中移除“application”而仅仅保留参数，参数将传递给ENTRYPOINT命令。
    5. ENV
    ENV命令用于设置环境变量。这些变量以”key=value”的形式存在，并可以在容器内被脚本或者程序调用。这个机制给在容器中运行应用带来了极大的便利。
    6. EXPOSE
    EXPOSE用来指定端口，使容器内的应用可以通过端口和外界交互。
    7. FROM
    FROM命令可能是最重要的Dockerfile命令。改命令定义了使用哪个基础镜像启动构建流程。基础镜像可以为任意镜 像。如果基础镜像没有被发现，Docker将试图从Docker image index来查找该镜像。FROM命令必须是Dockerfile的首个命令。
    8. MAINTAINER
    我建议这个命令放在Dockerfile的起始部分，虽然理论上它可以放置于Dockerfile的任意位置。这个命令用于声明作者，并应该放在FROM的后面。
    9. RUN
    RUN命令是Dockerfile执行命令的核心部分。它接受命令作为参数并用于创建镜像。不像CMD命令，RUN命令用于创建镜像（在之前commit的层之上形成新的层）。
    10. USER
    USER命令用于设置运行容器的UID。
    11. VOLUME
    VOLUME命令用于让你的容器访问宿主机上的目录。
    12. WORKDIR
    WORKDIR命令用于设置CMD指明的命令的运行目录。
# 3. 构建镜像并且启动容器
1. 制作镜像：`docker build -t mcserver:1.0 .`
   - `-t` 设置名字和标签
   - `mcserver:1.0`  前面是名字后面是标签（一般写版本号，如lasted）
   - `.` 后面这个点代表使用当前路径下的`Dockerfile`文件来构建镜像
***构建日志***
    ```bash
    root@horon-PowerEdge-T420:~/docker/mcjava# docker build -t mcserver:1.0 .
    Sending build context to Docker daemon  582.6MB
    Step 1/10 : FROM 10.3.61.254:81/operating-system/centos:7.5.1804
    ---> cf49811e3cdb
    Step 2/10 : MAINTAINER AAA
    ---> Using cache
    ---> 9b5fff18b7fa
    Step 3/10 : USER root
    ---> Using cache
    ---> dda67c5040a2
    Step 4/10 : ADD jdk-17.0.5_linux-x64_bin.rpm /root/
    ---> Using cache
    ---> 80df6712143b
    Step 5/10 : RUN rpm -ivh /root/jdk-17.0.5_linux-x64_bin.rpm
    ---> Using cache
    ---> a94136862bdc
    Step 6/10 : RUN rm -f /root/jdk-17.0.5_linux-x64_bin.rpm
    ---> Using cache
    ---> 77805e07e5f2
    Step 7/10 : ADD mcserver.tar.gz /root/docker/mcjava/
    ---> Using cache
    ---> e880c4a334b6
    Step 8/10 : RUN chmod 777 /root/docker/mcjava/mcserver/run.sh
    ---> Running in bcbe5010bc07
    Removing intermediate container bcbe5010bc07
    ---> 052140cfe43c
    Step 9/10 : EXPOSE 25565
    ---> Running in 17078c509c9c
    Removing intermediate container 17078c509c9c
    ---> 7a39f43bf210
    Step 10/10 : ENTRYPOINT ["sh"]
    ---> Running in d6dc38331468
    Removing intermediate container d6dc38331468
    ---> 65111cae31dd
    Successfully built 65111cae31dd
    Successfully tagged mcserver:1.0    # 构建完成
    ```
2. 启动容器
    - 查看镜像：`docker image ls`
    ```bash
    root@horon-PowerEdge-T420:~/docker/mcjava# docker image ls
    REPOSITORY                                    TAG        IMAGE ID       CREATED          SIZE
    mcserver                                      1.0        65111cae31dd   5 minutes ago    894MB
    ```
    - 启动容器：`docker run -itd mcserver:1.0`
    ```bash
    root@horon-PowerEdge-T420:~/docker/mcjava# docker run -itd mcserver:1.0
    48c0fc3c66fef5aa9acb8b1a4e04ff58e430991a0b5ce067a562d891580494d0
    ```
    - 查看容器状态：`docker ps`
    ```bash
    CONTAINER ID   IMAGE                                           COMMAND                  CREATED         STATUS         PORTS                                                                                                                                                  NAMES
    48c0fc3c66fe   mcserver:1.0                                    "sh"                     7 seconds ago   Up 4 seconds   25565/tcp
    ```
    - 进入容器后台开启服务器：`docker exec -it `
    ```bash
    root@horon-PowerEdge-T420:~/docker/mcjava# docker exec -it 48c bash
    [root@48c0fc3c66fe /]# ls
        bin  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var            
    ```
    可以看到系统正常运行，接下来可以开启服务器了！
    - 进入目录执行服务器启动sh脚本：`sh /root/docker/mcjava/mcserver/run.sh`
    - 查看nohup日志文件：`cat nohup.out`
        ```bash
        [root@48c0fc3c66fe mcserver]# cat nohup.out
            Starting org.bukkit.craftbukkit.Main
                System Info: Java 17 (Java HotSpot(TM) 64-Bit Server VM 17.0.5+9-LTS-191) Host: Linux 5.15.0-53-generic (amd64)
                Loading libraries, please wait...
                2022-11-29 02:19:07,244 ServerMain WARN Advanced terminal features are not available in this environment
        [02:19:11 INFO]: Building unoptimized datafixer
                ···中间过程省略···
        [02:19:20 INFO]: Done (2.615s)! For help, type "help"
        [02:19:20 INFO]: Timings Reset
        ```
3. 退出容器：`exit`
4. 大功告成！！！
# 3. 整一个Docker-compose来代替繁琐的run命令
```yaml
version: '3'
services: 
  mcserver:
    image: mcserver:1.0
    container_name: mcserver
    restart: always
    ports:
      - 25565:25565
    tty: true
```
启动docker-compose：`docker-compose up`(同级目录下)
# 4. 完结撒花
这个教程或许有些唠叨，但是也是为了巩固知识嘛~
希望会对看了的友友有所帮助！
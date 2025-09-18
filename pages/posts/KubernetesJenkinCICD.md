---
layout: post
title: 使用 Jenkins&GitLab 构建 CICD
date: 2024-05-20 17:24:26
tags:
    - Linux
    - Kubernetes
    - 云计算
    - CICD
    - Jenkins
categories:
    - 云计算
    - Devops
    - Jenkins
cover: https://bu.dusays.com/2024/09/30/66fa0a7e96de2.png
password: 
hide: 
---
# Kubernetes使用Jenkins构建CICD

## 引子

这篇文章是我在学校帮老师写的，旨在于帮助同学更好的学习 kubernetes、使用 Jenkins 软件和理解 CICD 流程，其中 jenkins 和 gitlab-ce 的镜像均可以从 [Docker Hub](https://hub.docker.com/) 拉取，项目文件就是我的个人文档[HoronDoc](https://github.com/HoronLee/HoronDoc.git)，同志们可以自行下载构建（不包含 Dockerfile），或者在我的个人 NAS 上下载[VitePressProject](http://horon.ddns.net:5212/s/pbfw)（包含 Dockerfile）。下面就是正文了，enjoy:D

##  虚拟机信息

本教程为 Kubernetes 双节点安装，IP 如下：

Master 节点：172.30.26.174

​    4 个 vCPU

​    4G 内存

Worker节点：172.30.26.175（标记为 worker tag，pod 主动在此节点运行）

​    4 个 vCPU

​    12G 内存

## 准备阶段

在 root 目录新建文件夹 cicd，用于存放本次练习的所有资源文件

```
mkdir jenkins
cd jenkins
```

将Master节点root目录下的.kube目录scp到Worker节点

`scp -r .kube worker:/root`

编辑这个传到 worker 节点的.kube 文件中的 config 文件，将server: https://apiserver.cluster.local:6443 改为 https://172.30.26.174:6443

也就是 master 节点的 ip，目的是为了 后续 jenkins容器中可以正常访问 k8s 的 apiserver

### 创建DevOps 命名空间

`kubectl create ns devops`

### 安装 Docker（双节点）

```
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
```

### 修改containerd配置（双节点）

Containerd从v1.5之后就不推荐了以config.toml作为镜像仓库的配置文件，但是目前还是可以这样做的

`vim /etc/containerd/config.toml`

找到此字段并且添加以下内容 (155 行左右，记得缩进)，请对应自己的harbor所在节点地址，也就是Master节点

```yaml
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://hub-mirror.c.163.com"]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."172.30.26.172"]
          endpoint = ["http://172.30.26.172"]
```

然后重启：

```
systemctl daemon-reload
systemctl restart containerd 
```

### 配置镜像仓库非HTTPS登录 (双节点）

编辑新文件：`vi /etc/docker/daemon.json`

写入以下内容，地址是Master节点IP（也就是接下来要安装Harbor的地址）

```json
{
 "insecure-registries": ["172.30.26.174"]
}
```

重启docker

`systemctl daemon-reload && systemctl restart docker`

## 安装 Harbor 镜像仓库

将harbor-offline-installer-v2.9.4.tgz下载到opt目录下

`curl -O http://172.30.27.143/CICD/harbor-offline-installer-v2.9.4.tgz`

解压文件`tar xvf harbor-offline-installer-v2.9.4.tgz`

进入harbor安装目录`cd harbor`

编写安装配`cp harbor.yml.tmpl harbor.yml`

`vim harbor.yml`

将第五行hostname:后面的IP改为Master节点IP

`hostname: 172.30.26.174`

删除里面13-18行以取消https配置

执行脚本来安装harbor`./install.sh`

![image-20240930095151300](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161913221.png)

出现如图回显说明Harbor安装完成

访问Harbor

http://172.30.26.174/

​    账号：admin

​    密码：Harbor12345

![image-20240930095225791](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161918034.png)

###  新建项目

新建名为“vitepress“ 的项目，并且设定为公开

![image-20240930095241492](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161923506.png)

登录Harbor

`docker login 172.30.26.174`

输入账号和密码，即可登录

![image-20240930095403692](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161931096.png)

## 安装Jenkins

### 上传镜像(worker 节点)

`curl -O http://172.30.27.143/CICD/jenkins-Gitlab.tar`

`ctr -n k8s.io image import jenkins-Gitlab.tar`

### 生成 jenkins基础资源文件

`kubectl create deployment jenkins --image=docker.io/jenkins/jenkins:latest --port=8080 --namespace=devops --dry-run=client -o yaml >> jenkins.yaml`

删除最后两行，这里不做资源限制

```yaml
resources: {}
status: {}
```

添加或修改为以下部分：

```
   serviceAccountName: jenkins
….
    imagePullPolicy: IfNotPresent
    securityContext: 
     runAsUser: 0
     privileged: true
…
    volumeMounts:
    - mountPath: /var/jenkins_home
     name: jenkinshome
    - mountPath: /usr/bin/docker
     name: docker
    - mountPath: /var/run/docker.sock
     name: dockersock
    - mountPath: /usr/bin/kubectl
     name: kubectl
    - mountPath: /root/.kube
     name: kubeconfig
   volumes:
   - name: jenkinshome
    hostPath:
     path: /home/jenkins_home
   - name: docker
    hostPath:
     path: /usr/bin/docker
   - name: dockersock
    hostPath:
     path: /var/run/docker.sock
   - name: kubectl
    hostPath:
     path: /usr/bin/kubectl
   - name: kubeconfig
    hostPath:
     path: /root/.kube
---(这半角横杠一定要写，用于分割资源类型)
```

![image-20240930095715999](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161937650.png)

### 生成 jenkins 服务资源文件

`kubectl create service nodeport jenkins --tcp=8080:8080 --node-port=30880 --namespace=devops --dry-run=client -o yaml >> jenkins.yaml`

---(这半角横杠一定要写，用于分割资源类型)

### 创建集群规则

`kubectl create clusterrole jenkins --verb=* --resource=* --namespace=devops --dry-run=client -o yaml >> jenkins.yaml`

---(这半角横杠一定要写，用于分割资源类型) 

### 创建服务账户

`kubectl create serviceaccount jenkins --namespace=devops --dry-run=client -o yaml >> jenkins.yaml`

---(这半角横杠一定要写，用于分割资源类型)

### 创建集群账户规则绑定

`kubectl create clusterrolebinding jenkins --clusterrole=jenkins --serviceaccount=devops:jenkins --namespace=devops --dry-run=client -o yaml >> jenkins.yaml`

### 创建 Jenkins 资源

`kubectl apply -f jenkins.yaml`

查看资源是否正常启动

`kubectl -n devops get po -o wide`

输出：

```bash
NAME            READY  STATUS  RESTARTS  AGE  IP       NODE   NOMINATED NODE  READINESS GATES
jenkins-6c6bf5fc6f-4gsj8  1/1   Running  0     34m  10.244.174.7  worker  <none>      <none>
```

 

### 访问 Jenkins

http://172.30.26.174:30880/

可以通过describe来查看当前Pod在哪个节点运行

`kubectl -n devops describe po jenkins-6c6bf5fc6f-9tmcc|grep Node`

显示：Node:       worker/172.30.26.175

说明在Worker节点运行

 

### 查看管理员密钥

有两种方法，一种是进入Pod中查看：

`kubectl -n devops exec deploy/jenkins – cat /var/jenkins_home/secrets/initialAdminPassword`

还有一种更方便，直接查看Pod挂载出来的目录的内容（在Pod所在节点执行）

`cat /home/jenkins_home/secrets/initialAdminPassword`

输出并且填入：

`8cdc972300d94e52bb460fb4a567d1e1`

### 安装插件

#### 如果 pod 可以访问外网

就选择安装社区推荐的插件，等待插件安装完成，然后设置管理员用户，账号 jenkins，密码 000000。在进入主页后，再自行下载这些插件：Blue Ocean、GitLab。

![image-20240930095753447](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161952732.png)

![image-20240930095802958](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916161957551.png)

前往 Download progress 页面可以查看下载进度

勾选底端

![image-20240930102401496](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162002996.png)

然后等待安装完成自动重启

 

#### 如果 pod 不能访问外网

提示 jenkins 似乎已经离线，且慢，请勿在网页进行操作

则按照以下步骤安装插件

下载插件包：http://172.30.27.143/CICD/jenkinsPlugins.tar.gz

解压：`tar zxvf jenkinsPlugins.tar.gz`

查看 jenkins pod：`kubectl -n devops get po`

拷贝插件入 pod 中：

`kubectl -n devops cp plugins/ jenkins-d468c8f4c-r8k9r:/var/jenkins_home`

重启 jenkins pod：

`kubectl -n devops rollout restart deployment jenkins`

### 创建用户

![image-20240930095812105](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162104776.png)

### 在安全设置中设置任何人可做任何事

![image-20240930100004081](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162109820.png)

点击下方保存配置

## 安装 GitLab

### 加载镜像(worker 节点)

已经在 jenkins 步骤完成

### 生成 GitLab基础资源文件

`kubectl create deployment gitlab --image=docker.io/gitlab/gitlab-ce:latest --namespace=devops --port=80 --dry-run=client -o yaml >> gitlab.yaml`

添加或修改为以下部分：

```yaml
    imagePullPolicy: IfNotPresent
    name: gitlab-ce
    env:
    - name: GITLAB_ROOT_PASSWORD
      value: CloudCICD@123
    - name: GITLAB_PORT
      value: "80"
```

![image-20240930100106527](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162121938.png)

---(这半角横杠一定要写，用于分割资源类型)

### 生成 GitLab服务资源文件

`kubectl create service nodeport gitlab --tcp=80:80 --node-port=30888 --namespace=devops --dry-run=client -o yaml >> gitlab.yaml`

### 创建 GitLab资源

`kubectl apply -f gitlab.yaml`

GitLab 启动非常的慢，请至少等待十分钟，可以使用 kubectl 命令查看日志和详细信息

`kubectl -n devops logs [pod id] | tail`

### 访问 GitLab

http://172.30.26.174:30888/

输入账号密码登录

账号：root

密码：CloudCICD@123

 

### 配置Jenkins连接GitLab

（1）设置Outbound requests

登录Gitlab管理员界面（http://master:30888/admin），如图所示： 

![image-20240930100115861](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162128657.png)

在左侧导航栏选择“Settings→Network”，设置“Outbound requests”，勾选“Allow requests to the local network from web hooks and services”复选框，如图所示：

![image-20240930100124892](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162133456.png)

配置完成 Save changes 

### 创建GitLab API Token 

单击GitLab用户头像图标，在左侧导航栏选择“Preferences”，如图所示：

![image-20240930100133759](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162139665.png)

在左侧导航栏选择“Access Tokens”添加Token，如图所示：

注意，Expiration date 尽量往后选择几天

![image-20240930100145192](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162147823.png)

单击“Create personal access token”按钮生成Token，如图所示：

![image-20240930100150892](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162204603.png)

![image-20240930100156642](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162209305.png)

记录下Token（glpat-earMgQ66g4SdoMNjJr6e），后面配置Jenkins时会用到。

### 配置Jenkins 与 GitLab连接

登录Jenkins首页，选择“系统管理→系统配置”，配置GitLab信息，取消勾选“Enable authentiviion for ‘/project’ end-point”，输入“Connection name”和“Gitlab host URL”，如图所示：

![image-20240930100203731](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162215083.png)

添加Credentials，单击“添加”→“Jenkins”按钮添加认证信息，将Gitlab API Token填入，如图所示：

![image-20240930100212507](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162220486.png)

选择新添加的证书，然后单击“Test Connection”按钮，如图所示：

![image-20240930100217835](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162235863.png)

返回结果为Success，说明Jenkins可以正常连接GitLab，点击左下角保存。

## 创建 GitLab项目仓库

进入 gitlab，点击 Create a project

![image-20240930100227418](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162247033.png)

选择添加空项目

![image-20240930100232816](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162253031.png)

![image-20240930101122150](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162257501.png)

点击Create Project创建项目

### 上传项目

下载项目文件：

`curl -O http://172.30.27.143/CICD/VitePressProject.tar.gz`

解法并且进入目录：

`tar zxf VitePressProject.tar.gz`

`cd VitePressProject`

### 安装git

```bash
yum install git -y
git config --global user.name "Administrator"
git config --global user.email "admin@example.com"
git init
git add .
git commit -m "Initial commit"  # IP地址请改为自己GitLab的IP和端口
git remote add origin http://172.30.26.174:30888/root/vitepress.git
git push --set-upstream origin master  # 输入账号密码
```

![image-20240930101137940](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162305273.png)

刷新GitLab网页可以看到项目已经上传成功了

![image-20240930101144723](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162313277.png)

## 新建流水线

### ![image-20240930101200139](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162317858.png) ![image-20240930101219825](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162322186.png)配置构建触发器

![image-20240930101302787](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916165338127.png)记录下GitLab webhook URL的地址（http://172.30.26.174:30880/project/vitepress)，后期配置webhook需要使用。

### 配置流水线

在定义域中选择“Pipeline script from SCM”，此选项指示Jenkins从源代码管理（SCM）仓库获取流水线。在SCM域中选择“Git”，然后输入“Repository URL”

![image-20240930101313851](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162329829.png)

![image-20240930101324283](/Users/horonlee/Library/Application Support/typora-user-images/image-20240930101324283.png)

新建凭据

![image-20240930101348495](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162532043.png)

最后点击下方保存，自动回到流水线控制台

![image-20240930101354353](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162536493.png)

## 编写流水线

Pipeline有两种创建方法——可以直接在Jenkins的Web UI界面中输入脚本；也可以通过创建一个Jenkinsfile脚本文件放入项目源码库中。

一般推荐在Jenkins中直接从源代码控制（SCMD）中直接载入Jenkinsfile Pipeline这种方法。

登录GitLab进入vitepress项目，选择新建文件

![image-20240930101406512](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162541869.png)将流水线脚本输入到Jenkinsfile中，更改kubernetes.yaml文件中所使用的镜像的名字，将其harbor.io改为自己harbor仓库的地址，本文是`172.30.26.174`

```json
pipeline{
  agent none
  environment { 
    DOCKER_REGISTRY_IP = '172.30.26.174'  //这个IP请改为Harbor仓库的IP
    IMAGE_NAME = 'vitepress/vitepress'
    IMAGE_TAG = 'dev'
    DOCKER_USERNAME = 'admin'
    DOCKER_PASSWORD = 'Harbor12345'
  }
  stages {
    stage('image-build') {
      agent any
      steps {
        script {
          sh "docker build -t ${DOCKER_REGISTRY_IP}/${IMAGE_NAME}:${IMAGE_TAG} ."
          sh "echo ${DOCKER_PASSWORD} | docker login ${DOCKER_REGISTRY_IP} -u ${DOCKER_USERNAME} --password-stdin"
          sh "docker push ${DOCKER_REGISTRY_IP}/${IMAGE_NAME}:${IMAGE_TAG}"
        }
      }
    }
    stage('project-deploy') {
      agent any
      steps {
        script {
          sh "kubectl apply -f kubernetes.yaml"
          sh "kubectl -n devops get po -o wide"
          sh "kubectl -n devops get svc -o wide"
        }
      }
    }
  }
}
```

提交更改即可

![image-20240930101420695](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162548160.png)

## 配置WebHook

在GitLab的项目中，通常会使用Webhook的各种事件来触发对应的构建，通常配置好后会向设定好的URL发送post请求。

登录GitLab，进入viteress项目，现在左侧导航栏“Settings→Webhooks”，将前面记录的GitLab webhook URL地址填入URL处，禁用SSL认证

![image-20240930101425998](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162552748.png)

![image-20240930101431483](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162556982.png) ![image-20240930101442677](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162604832.png) ![image-20240930101456619](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162611251.png)

![image-20240930101503195](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162617113.png) 

结果返回HTTP 200则表明Webhook配置成功

## 运行流水线

登录Jenkins 刷新页面，因为刚才测试了一个提交动作被 webhook 捕捉，所以可以看到vitepress项目已经开始构建

![image-20240930101512669](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162621255.png)

在流水线的 ConsoleOutput 中可以查看日志

![image-20240930101529611](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162628606.png)

也可以进入Blue Ocean查看构建日志和成果

![image-20240930101537100](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162633237.png)

等待一段时间即可构建完成

![image-20240930101542664](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162638322.png)

如果构建失败，需要前往 Harbor 仓库删除上传的镜像以及 worker 节点上 ctr -n k8s.io image ls|grep vitepress 显示的所有镜像，再次运行流水线

## 检查CICD情况

进入Harbor，可以看到Jenkins的流水线推送上去的镜像

![image-20240930101548089](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162643441.png)

查看是否有测试pod在运行

```bash
kubectl get pod
NAME             READY  STATUS  RESTARTS  AGE
vitepress-65c4df475c-8sfwf  1/1   Running  0     8m42s
kubectl get svc -o wide
NAME     TYPE    CLUSTER-IP   EXTERNAL-IP  PORT(S)     AGE   SELECTOR
kubernetes  ClusterIP  10.96.0.1   <none>    443/TCP     4d6h  <none>
vitepress  NodePort  10.111.47.80  <none>    5173:30173/TCP  9m19s  app=vitepres
```

 接下来去查看pod展示的网页

http://172.30.26.174:30173/

![image-20240930101558588](https://minio-api.horonlee.com/obsidian/assets/博文/KubernetesJenkinCICD/IMG-20250916162648528.png)

可以访问网页说明应用自动测试部署成功，CICD流程到此结束！

# 补充

暂无...
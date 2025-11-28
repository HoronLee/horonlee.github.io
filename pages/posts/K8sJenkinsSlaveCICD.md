---
layout: post
title: Jenkins的标准用法“Jenkins-Slave”
date: 2024-05-24 11:42:20
tags:
    - Linux
    - Kubernetes
    - 云计算
    - CICD
    - Jenkins
categories:
    - 服务器运维
    - 云计算
    - Jenkins
cover: https://i2.wp.com/digitalvarys.com/wp-content/uploads/2019/05/jenkins-master-slave-config.png?fit=1963%2C1079&ssl=1
password:
hide:
---
# kubernetes构建 Jenkins-Master&Slave 架构

## 引子

这篇文章是我在学校帮助专业老师撰写的，旨在于帮助同学更好的学习 Jenkins 的使用，所有内容都是基于最新的官方文档编写，且经过检验，可以放心食用！

下面就是正文了，enjoy:D

## 准备工作

虚拟机节点信息：

- master 节点：172.30.26.172

  - 4 个 vCPU

  - 4G 内存
- worker1节点：172.30.26.173（标记为 worker tag，pod 主动在此节点运行）

  - 8 个 vCPU
  - 16G 内存（12G 内存足够）

相关镜像：

1. [[jenkins/jenkins - Docker Image | Docker Hub](https://hub.docker.com/r/jenkins/jenkins)](https://hub.docker.com/_/jenkins)
2. [jenkins/inbound-agent - Docker 镜像 |Docker 中心](https://hub.docker.com/r/jenkins/inbound-agent/)
3. [gitlab/gitlab-ce - Docker Image | Docker Hub](https://hub.docker.com/r/gitlab/gitlab-ce)

所用项目：[YunYouJun/valaxy: 🌌 Next Generation Static Blog Framework (Beta) 下一代静态博客框架（支持页面/配置热重载） (github.com)](https://github.com/YunYouJun/valaxy)，本文更改了 Dockerfile，删除了第一阶段的构建！

---

将 master 节点的`.kube`配置文件拷贝到 worker1 节点，方便后续的工作

`scp -r /root/.kube worker1:/root`

### 设置JenkinsMaster容忍度

> kubernetes 在安装完成后会在 master 节点添加一个名为 control-plane 的污点，这个污点不会容忍任何非指定的 pod 运行在 master 节点，但是我们需要讲 jenkins-master 安排在 master 节点，该怎么做呢？以下是处理思路。

最简单的方法就是移除所有节点的 control-plane 污点 `kubectl taint nodes --all node-role.kubernetes.io/control-plane-`，然后再指定`nodeSelector`。(nodeSelector的用法看第二种方法)

>  还有一种方法我更推荐，在生产环境也可以这样操作：

为 master 节点打上标签`jenkins=master`：`kubectl label no master jenkins=master`

在创建 jenkins-master 的时候使用标签选择器，就可以强制让 pod 运行在有 NoSchedule 的Taints 的主节点上

但是此时还是不能让 pod 成功调度到 master 节点，因为 master 节点在初始化时就被标记了[污点](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)“node-role.kubernetes.io/control-plane”，所以我们需要为 master 节点配置容忍度，允许拥有特定键值对标签的 pod 运行在这个节点上。

所以需要在`spec.template.spec`配置以下内容：

```yaml
nodeSelector:
  jenkins: "master"
tolerations:
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Exists"
    effect: "NoSchedule"
```

> 设置HTTP访问镜像仓库（所有节点都要做）：/etc/containerd/config

Containerd从v1.5之后就不推荐了以config.toml作为镜像仓库的配置文件，这里我们采用新的配置方法

```bash
mkdir -p /etc/containerd/certs.d/172.30.26.172
vim /etc/containerd/certs.d/172.30.26.172/hosts.toml
```

在文件中写入以下内容

```toml
server = "http://172.30.26.172"
[host."http://172.30.26.172"]
capabilities = ["pull", "resolve", "push"]
skip_verify = true
```

然后重启 `systemctl restart containerd `

## 安装 Harbor 镜像仓库

> 官方下载地址：[Releases · goharbor/harbor (github.com)](https://github.com/goharbor/harbor/releases)

将harbor-offline-installer-v2.9.4.tgz下载到opt目录下

`curl -O http://172.30.27.143/CICD/harbor-offline-installer-v2.9.4.tgz`

解压文件`tar xvf harbor-offline-installer-v2.9.4.tgz`

进入harbor安装目录`cd harbor`

编写安装配`cp harbor.yml.tmpl harbor.yml`

`vim harbor.yml`

将第五行hostname:后面的IP改为Master节点IP

`hostname: http://172.30.26.172/`

删除里面13-18行以取消https配置

执行脚本来安装harbor`./install.sh`

![](/attachment/K8sJenkinsSlaveCICD/0b489e311b5b45e574814990a45fb21b.png)

出现如图回显说明Harbor安装完成

访问Harbor

http://172.30.26.172/

​    账号：admin

​    密码：Harbor12345

登录 Harbor 仓库

```
[root@master ~]# docker login 172.30.26.172
Username: admin
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store
```

## 部署 Gitea

> 什么是 Gitea？Gitea 是一个轻量级的 DevOps 平台软件。从开发计划到产品成型的整个软件生命周期，他都能够高效而轻松的帮助团队和开发者。包括 Git 托管、代码审查、团队协作、软件包注册和 CI/CD。它与 GitHub、Bitbucket 和 GitLab 等比较类似。 Gitea 最初是从 [Gogs](http://gogs.io/) 分支而来，几乎所有代码都已更改。对于我们Fork的原因可以看 [这里](https://blog.gitea.com/welcome-to-gitea/)。

### 使用 docker 安装 Gitea

⚠️Gitea 部署在 worker1 节点

在 root 目录下创建文件夹 gitea，并进入，创建 docker-compose.yaml 文件并编辑

`mkdir gitea && cd gitea && vim docker-compose.yaml`

```yaml
version: "3"
networks:
  gitea:
    external: false
services:
  server:
    image: gitea/gitea:1.21.11
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=mysql
      - GITEA__database__HOST=db:3306
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=gitea
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
    depends_on:
      - db
  db:
    image: mysql:5.7.39
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=gitea
      - MYSQL_USER=gitea
      - MYSQL_PASSWORD=gitea
      - MYSQL_DATABASE=gitea
    networks:
      - gitea
    volumes:
      - ./mysql:/var/lib/mysql
```

 启动 docker compose：`docker compose up -d`

看到 docker compose 都启动之后，进入网页进行安装http://172.30.26.173:3000/

编辑数据库的连接配置（默认可以不改），设置管理员信息

- 管理员用户名root
- 电子邮件admin@example.com
- 密码 000000

然后点击 `立即安装`，稍等片刻即可进入登录页面，输入账号密码，进入主页

![](/attachment/K8sJenkinsSlaveCICD/5b86f1537c409e568d2dcf94e64a02cd.png)

### 使用 Helm 安装Gitea

> 安装 Helm

什么是 [Helm |快速入门指南 (helm.sh)](https://helm.sh/zh/docs/intro/quickstart/)？

1. `wget http://172.30.27.143/CICD/helm-v3.15.0-linux-amd64.tar.gz`
2. `tar zxf helm-v3.15.0-linux-amd64.tar.gz`
3. `mv linux-amd64/helm /usr/local/bin/helm`
4. `rm -rf linux-amd64/`

> 安装 Gitea

```bash
helm repo add gitea https://dl.gitea.com/charts
helm repo update
helm install gitea gitea/gitea
```

## 新建 Git 项目

点击仓库列表边上的➕号，开始添加仓库的步骤，名称填写 `valaxy`，然后直接点击最下面的按钮新建仓库

### 创建本地项目

下载项目 wget http://172.30.27.143/CICD/jenkins-slave/ValaxyBlogProject.tar.gz

解压项目 `tar zxf valaxy-blog.tar.gz`

进入项目文件 `cd valaxy-blog`

### 上传项目

```bash
git init
git checkout -b main
git add .
git commit -m "first commit"
git remote add origin http://172.30.26.173:3000/root/valaxy.git
git push -u origin main

[root@master valaxy-blog]# git push -u origin main
Username for 'http://172.30.26.173:3000': root	//输入之前的账号密码即可
Password for 'http://root@172.30.26.173:3000':
Counting objects: 56, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (41/41), done.
Writing objects: 100% (56/56), 101.45 KiB | 0 bytes/s, done.
Total 56 (delta 0), reused 0 (delta 0)
remote: . Processing 1 references
remote: Processed 1 references in total
To http://172.30.26.173:3000/root/valaxy.git
 * [new branch]      main -> main
分支 main 设置为跟踪来自 origin 的远程分支 main。
```

刷新 gitea 网页，即可看到项目上传完成

## 安装Jenkins-Master

### 配置 NFS

安装NFS服务（这个需要在所有K8S的节点上安装）

`yum install -y nfs-utils`

创建共享目录（这个只需要在master节点）

`mkdir -p /opt/nfs/jenkins`

编写NFS的共享配置

`vim /etc/exports`

```
/opt/nfs/jenkins *(rw,no_root_squash)
```

`*`代表对所有IP都开放此目录，`rw`是读写，`no_root_squash`不压制root权限

启动服务

`systemctl enable nfs --now`

查看NFS共享目录

```bash
[root@master ~]# showmount -e 172.30.26.172
Export list for 172.30.26.172:
/opt/nfs/jenkins *
```

---

创建并进入jenkins目录

`mkdir jenkins && cd jenkins`

**步骤 1**：为 Jenkins 创建命名空间。 最好将所有 DevOps 工具分类为与其他应用程序不同的命名空间。

```
kubectl create namespace devops
```

**步骤2：**创建“serviceAccount.yaml”文件并复制以下管理员服务帐户清单。

```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: jenkins-admin
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["*"]
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jenkins-admin
  namespace: devops
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: jenkins-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: jenkins-admin
subjects:
- kind: ServiceAccount
  name: jenkins-admin
  namespace: devops
```

“serviceAccount.yaml”创建一个“jenkins-admin”集群角色，“jenkins-admin”服务帐户，并将“clusterRole”绑定到服务帐户。

“jenkins-admin”群集角色具有管理群集组件的所有权限。 您还可以通过指定单个资源操作来限制访问。

现在使用 kubectl 创建服务帐户。

```
kubectl apply -f serviceAccount.yaml
```

**步骤3：** 创建“volume.yaml”并复制以下持久卷清单。

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: jenkins-pv-volume
  labels:
    type: local
spec:
  storageClassName: local-storage
  claimRef:
    name: jenkins-pv-claim
    namespace: devops
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  local:
    path: /opt/nfs/jenkins	#之前设置的nfs存储目录
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - master	#Master节点主机名
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pv-claim
  namespace: devops
spec:
  storageClassName: local-storage
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
```

对于卷，我们使用“本地”存储类进行演示。 这意味着，它会在“/opt/nfs/jenkins”位置下的特定节点中创建一个“PersistentVolume”卷。

由于“本地”存储类需要节点选择器，因此您需要正确指定工作节点名称，以便将 Jenkins Pod 调度到特定节点中。

如果 Pod 被删除或重新启动，数据将保留在节点卷中。 但是，如果节点被删除，您将丢失所有数据。

理想情况下，应使用云提供商提供的可用存储类或群集管理员提供的存储类来使用持久性卷，以便在节点故障时保留数据。

让我们使用 kubectl 创建卷

```
kubectl create -f volume.yaml
```

**步骤4：**创建名为“deployment.yaml”的部署文件，并复制以下部署清单。

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
  namespace: devops
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins-server
  template:
    metadata:
      labels:
        app: jenkins-server
    spec:
      nodeSelector:
        jenkins: "master"
      tolerations:
      - key: "node-role.kubernetes.io/control-plane"
        operator: "Exists"
        effect: "NoSchedule"
      securityContext:
            fsGroup: 1000
            runAsUser: 1000
      serviceAccountName: jenkins-admin
      containers:
        - name: jenkins
          image: docker.io/jenkins/jenkins:latest
          imagePullPolicy: IfNotPresent
          resources:
            limits:
              memory: "2Gi"
              cpu: "1000m"
            requests:
              memory: "500Mi"
              cpu: "500m"
          ports:
            - name: httpport
              containerPort: 8080
            - name: jnlpport
              containerPort: 50000
          livenessProbe:
            httpGet:
              path: "/login"
              port: 8080
            initialDelaySeconds: 90
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 5
          readinessProbe:
            httpGet:
              path: "/login"
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          volumeMounts:
            - name: jenkins-data
              subPath: jenkinsMaster
              mountPath: /var/jenkins_home
      volumes:
        - name: jenkins-data
          persistentVolumeClaim:
              claimName: jenkins-pv-claim
```

在此 Jenkins Kubernetes 部署中，我们使用了以下内容：

1. “securityContext”，以便 Jenkins pod 能够写入本地持久卷。
2. 用于监视 Jenkins pod 运行状况的 Liveness and readiness 探测。
3. 基于保存 Jenkins 数据路径“/var/jenkins_home”的本地存储类的本地持久性卷。

使用 kubectl 创建部署。

```
kubectl apply -f deployment.yaml
```

检查部署状态。

```
kubectl get deployments -n devops
```

现在，您可以使用以下命令获取部署详细信息。

```
kubectl describe deployments --namespace=devops
```

### 使用 Kubernetes 服务访问 Jenkins

现在，我们已经创建了一个部署。 但是，它不对外界开放。 为了从外部世界访问 Jenkins 部署，我们需要创建一个服务并将其映射到部署。

创建“service.yaml”并复制以下服务清单：

```
apiVersion: v1
kind: Service
metadata:
  name: jenkins-service
  namespace: devops
  annotations:
      prometheus.io/scrape: 'true'
      prometheus.io/path:   /
      prometheus.io/port:   '8080'
spec:
  selector:
    app: jenkins-server
  type: NodePort
  ports:
  - name: httpport
    port: 8080
    targetPort: httpport
    nodePort: 32000
  - name: jnlpport
    port: 50000
    targetPort: jnlpport
    nodePort: 32500
```

使用 kubectl 创建 Jenkins 服务。

```
kubectl apply -f service.yaml
```

现在，当浏览到端口 32000 上的任何一个节点 IP 时，您将能够访问 Jenkins 仪表板。

```
http://<master-ip>:32000
```

查看 jenkins 的 pod 在 running 状态，通过http://172.30.26.172:32000/访问 jenkins

查看 jenkins 初始密码`cat /opt/nfs/jenkins/jenkinsMaster/secrets/initialAdminPassword`

创建用户，然后选择保存并完成

![](/attachment/K8sJenkinsSlaveCICD/9b336640664bd348ece99f30fbcefda0.png)

![](/attachment/K8sJenkinsSlaveCICD/946290a3c2091ddaa7b912e9ee5bd04e.png)

![](/attachment/K8sJenkinsSlaveCICD/98901ba24512e988e1ec0e4671b64197.png)

设置全局安全设置为任何用户可以做任何事

![](/attachment/K8sJenkinsSlaveCICD/372e2b973fc459b466f4aff23d8803e4.png)

### 安装插件

前往 系统管理-插件管理-Available plugins，搜索Kubernetes和Docker这两个插件，都进行安装，可以选择性安装Blue Ocean，这样可以更好的观察流水线的运作

## 配置 JankinsCloud

> ⚠️注意，所有 IP 地址请改为master 节点的 IP

进入cloud 节点配置页面http://172.30.26.172:32000/manage/cloud/（系统管理-Clouds-New cloud）

点击 New Cloud

- Cloud Name `worker1`

- Type `Kubernetes`

进入下一步

- 在终端输入`kubectl cluster-info`获得 ApiServer 的地址https://172.30.26.172:6443

- Kubernetes 地址`https://172.30.26.172:6443`

- Kubernetes 服务证书 key填写`.kube/config`中`certificate-authority-data:`字段的密钥

```
LS0tLS1CRUdJTiBDRVJUSUZJ...(省略)
```

- 勾选`禁用 HTTPS 证书检查`

- Kubernetes 命名空间`devops`

点击`连接测试`，显示`Connected to Kubernetes v1.29.0`即可

---

- Jenkins 地址`http://172.30.26.172:32000/`

- Jenkins 通道`172.30.26.172:32500`不能加任何协议，因为是 tcp 传输协议，值就是 jenkins service 的另一个暴露的端口

![](/attachment/K8sJenkinsSlaveCICD/d953a2e1c3f6ec4e582f16d80169cbd6.png)

![](/attachment/K8sJenkinsSlaveCICD/b7dc69fe9e8373ad6772bf7459c0c467.png)

最后点击下方 Save 保存

## 配置 Jankins-Slave

在 Jankins-Slave 架构中，Slave 节点通常由 `jenkins/inbound-agent` 镜像直接生成，在流水线完成后，此节点就会被删除，因为本项目需要构建的是 vite 项目，所以我们需要自定义一个 Slave 节点的镜像，以便项目的构建

### 构建特殊的 agent 镜像

在 root 目录创建`inbound-agent-node`目录，在此目录完成镜像构建 `cd inbound-agent-node`

下载 nodejs 程序 `wget https://nodejs.org/dist/v20.13.1/node-v20.13.1-linux-x64.tar.xz`

编辑 Dockerfile

`vim inbound-agent-node-Dockerfile`

```dockerfile
FROM jenkins/inbound-agent
USER root
WORKDIR /usr/local
ADD node-v20.13.1-linux-x64.tar.xz .
ENV PATH="/usr/local/node-v20.13.1-linux-x64/bin:${PATH}"
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
ENTRYPOINT ["jenkins-agent"]
```

构建镜像，镜像的 tag 前面的**地址**需要改成自己的 **Harbor 仓库地址**

 `docker build -t 172.30.26.172/library/inbound-agent-node:latest . -f inbound-agent-node-Dockerfile`

推送到 Harbor `docker push 172.30.26.172/library/inbound-agent-node:latest`

在 `worker1` 节点拉取这个镜像 `ctr -n k8s.io image pull --plain-http 172.30.26.172/library/inbound-agent-node:latest`

### 设置 Pod Template

Pod Template 就是 slave 节点将会启动的Pod，我们可以设置多个Pod Template 来适配多个流水线的运作，这里我们只新建一个 Pod Template

进入 系统管理-Clouds-worker1-Pod Templates，点击右上角的 Add a pod template 进入Pod template settings 页面，接下来设置 Pod Template。

- 名称 `jenkins-slave`

- 命名空间 `devops`

- 标签列表 `jenkins-slave-k8s`

![](/attachment/K8sJenkinsSlaveCICD/10f7a756c0cb6faba2fe1e8503306205.png)

卷设置，点击`添加卷`，选择 `Host Path Volume`，接下来需要填入多个从主机映射到 Pod 中的文件

| Host Path Volume  | 主机路径                        | 挂载路径                        |
| ----------------- | ------------------------------- | ------------------------------- |
| docker 命令       | /usr/bin/docker                 | /usr/bin/docker                 |
| docker 套接字     | /var/run/docker.sock            | /var/run/docker.sock            |
| kubectl 配置文件  | /root/.kube                     | /root/.kube                     |
| kubectl 命令      | /usr/bin/kubectl                | /usr/bin/kubectl                |
| ctr 命令          | /usr/bin/ctr                    | /usr/bin/ctr                    |
| containerd 套接字 | /run/containerd/containerd.sock | /run/containerd/containerd.sock |

![](/attachment/K8sJenkinsSlaveCICD/5043353c0c6a28475e97d3dfe3fd5ca3.png)

然后翻动页面到下方，找到`Run As User ID`和`Run As Group ID`，填入`0`，目的是让 Pod 中的容器可以正常执行 docker 和 ctr 命令。（0 是宿主机 root 用户的组 ID）

#### 设置容器

> 最新 Jenkins 默认如果 pod 名称不设置为 jnlp 的话，会自动启动一个 inbound-agent 镜像来

在刚才的 Pod template settings 中找到`容器列表`选项，点击`添加容器`选择 `Container Template`

- 名称 `nodejs`
- Docker 镜像 `172.30.26.172/library/inbound-agent-node:latest`
- 运行的命令 `sleep`
- 命令参数 `9999999`
- 勾选 `分配伪终端`

点击下方 Save 完成 Pod Template 的设置

## 配置并运行流水线

新建流水线，命名 ValaxyBlog

点击配置，在高级项目选项中配置流水线脚本，其中`environment`是环境变量的配置，请将`DOCKER_REGISTRY`改为 Harbor 仓库地址，`Checkout Code`步骤中的`git url`后面的仓库地址请改为自己的 Gitea 项目的 http 地址，

```json
pipeline {
  agent {
    label 'jenkins-slave-k8s'
  }
  environment {
        DOCKER_REGISTRY = "172.30.26.172"
        IMAGE_NAME = "library/valaxy"
        IMAGE_TAG = "dev"
        DOCKER_USERNAME = 'admin'
        DOCKER_PASSWORD = 'Harbor12345'
        DEPLOY_PORT = '30080'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git url: 'http://172.30.26.173:3000/root/valaxy.git', branch: 'main'
            }
        }
        stage('Build Application') {
            steps {
                container ('nodejs') {
                    script {
                        sh 'pnpm i'
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    }
                }
            }
        stage('Push Docker Image') {
            steps {
                echo "Docker image will pushed to ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                sh "echo ${DOCKER_PASSWORD} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USERNAME} --password-stdin"
                sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                sh 'docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} || true'
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh '''
                    kubectl create deployment valaxy --image=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} --dry-run=client -o yaml >> valaxy-manifests.yaml
                    echo "---" >> valaxy-manifests.yaml
                    kubectl create service nodeport valaxy --tcp=80:80 --node-port=${DEPLOY_PORT} --dry-run=client -o yaml >> valaxy-manifests.yaml
                    '''
                    sh """
                    sed -i '22a \\
        imagePullPolicy: IfNotPresent' valaxy-manifests.yaml
                    """
                    sh '''
                    ctr -n k8s.io image pull --plain-http ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                    sh '''
                    kubectl delete -f valaxy-manifests.yaml || true
                    kubectl apply -f valaxy-manifests.yaml
                    '''
                }
            }
        }
    }
}
```

![](/attachment/K8sJenkinsSlaveCICD/807955afc089205f93637c40c8aa0e90.png)

点击左侧的立即构建，流水线就开始运行了

可以进入构建的 Console Output 中看到构建的详细情况

也可以进入 BlueOcean 更直观的看到构建细节

在构建过程中，我们可以在宿主机上通过`kubectl -n devops get po`指令查看临时生成的 jenkins-slave pod，它正在运行 jenkins-master 下发的流水线

![](/attachment/K8sJenkinsSlaveCICD/0a317e0774105ec4e51f7d1e72c43f56.png)

构建完成后，访问 http://172.30.26.172:30080就可以看到博客正常被测试发布了，临时的 jenkins-slave pod 也被自动删除了

![](/attachment/K8sJenkinsSlaveCICD/8102a2a36ddd415b5e66b5bfbee37bca.png)

🎉看到此页面就代表我们已经通过 agent 节点的功能完成了 CICD！

# The End

恭喜你完成了本次练习！相信你一定对 Jenkins 的使用有了更深的理解，当然上文还是倾向于实操步骤，我没有详细说明一些配置项目的作用，以及流水线的各种细节功能，这是因为我也没有完全理解 jenkins 的 pipeline 的编写，如果你还想继续深究，请前往 [Jenkins 用户手册](https://www.jenkins.io/zh/doc/)进行查阅，一定会有很多的收货！

下面是我在撰写这边文章的时候记录的测试步骤，其中包含了设置多个 Container Pod 的相关知识，如果你感兴趣可以继续往下看！

那么本文理论上就到此为止了，see u～

## 功能测试

### 设置 Pod template

进入 worker1 这个 cloud 的配置页面http://172.30.26.172:32000/manage/cloud/worker1/

点击 `Pod templates`-`Add a pod template`

名称`jenkins-slave`

命名空间`devops`

标签列表`jenkins-slave-k8s`

#### 容器列表

点击`添加容器`-`Container Template`

名称`jnlp`

Docker 镜像`docker.io/jenkins/inbound-agent:latest`

运行的命令`jenkins-agent`

命令参数删除自带的 `9999999`

☑️`分配伪终端`

点击最下方 Create 完成 pod template 的创建
![](/attachment/K8sJenkinsSlaveCICD/3d2d07f1e7c31a845649d52cbc340692.png)

### 测试jenkins-slave

新建一个名为 `jnlp-test`的流水线

填写流水线脚本

```json
pipeline {
  agent {
    label 'jenkins-slave-k8s'
  }
  stages {
    stage('test') {
        steps {
            script {
                println "Thie pipeline is run in jenkins-slave."
            }
        }
    }
  }
}
```

保存，运行流水线，点击`立即构建`

查看`Console Output`

```json
Started by user jenkins
[Pipeline] Start of Pipeline
[Pipeline] node
Agent jenkins-slave-fxpzg is provisioned from template jenkins-slave
---
apiVersion: "v1"
......省略
    name: "workspace-volume"

Running on jenkins-slave-fxpzg in /home/jenkins/agent/workspace/jnlp-test
[Pipeline] {
[Pipeline] stage
[Pipeline] { (test)
[Pipeline] script
[Pipeline] {
[Pipeline] echo
Thie pipeline is run in jenkins-slave.
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
```

出现`Thie pipeline is run in jenkins-slave.`就代表使用 jenkins-slave 构建成功了！

在构建的过程中通过`kubectl -n devops get po`可以查看到有一个名为`jenkins-slave-5jjcw`的 pod 在 running 状态，当流水线运行完成后，这个 pod 又会马上消失，这代表我们确实完成了动态的 jenkins-slave 的功能实现。

### 设置多个 Pod Template

进入 clouds>worker1>jenkins-slave 页面

点击`添加容器`-`Container Template`

名称`nodejs`

Docker 镜像`172.30.26.172/library/inbound-agent-node:latest`

运行的命令`sleep`

命令参数保持 `9999999`

#### 自定义一个 agent 镜像

> 因为项目是基于 vite 的项目，所以构建需要 node 环境

创建inbound-agent-node目录，在此目录完成镜像构建

下载 nodejs 程序 `wget https://nodejs.org/dist/v20.13.1/node-v20.13.1-linux-x64.tar.xz`

编辑 Dockerfile

`vim inbound-agent-node-Dockerfile`

```dockerfile
FROM jenkins/inbound-agent
USER root
WORKDIR /usr/local
ADD node-v20.13.1-linux-x64.tar.xz .
ENV PATH="/usr/local/node-v20.13.1-linux-x64/bin:${PATH}"
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
ENTRYPOINT ["jenkins-agent"]
```

构建镜像 `docker build -t 172.30.26.172/library/inbound-agent-node:latest . -f inbound-agent-node-Dockerfile`

推送到 Harbor `docker push 172.30.26.172/library/inbound-agent-node:latest`

#### 编写流水线

> 根据最新的 kubernetes 插件的规则进行编写，官方页面写了两种方法，这里使用第三种方法，不用手动写 Pod Template——[Kubernetes 的 |Jenkins 插件](https://plugins.jenkins.io/kubernetes/)

```json
pipeline {
  agent {
    label 'jenkins-slave-k8s'
  }
  stages {
    stage('test') {
      steps {
        container ('jnlp') {
          script {
            println "This pipeline is run in jnlp pod."
            sh 'node -v || true'
          }
        }
        container ('nodejs') {
          script {
            println "This pipeline is run in node pod."
            sh 'node -v'
            sh 'npm -v'
            sh 'pnpm -v'
          }
        }
      }
    }
  }
}
```

运行流水线，在 Console Output 中可以看到自动生成的 yaml 文件中有了两个 Containers，证明了`test stage`中的第唯一一个`steps`中确实启动了两个容器，通过 kubectl 命令可以看到有一个 pod 在运行，说面多 pod template 模式功能测试成功。

```bash
Started by user jenkins
[Pipeline] Start of Pipeline
[Pipeline] node
Agent jenkins-slave-1g78h is provisioned from template jenkins-slave
---
apiVersion: "v1"
......yaml 省略
Running on jenkins-slave-1g78h in /home/jenkins/agent/workspace/jnlp-test
...省略
[Pipeline] echo
This pipeline is run in jnlp pod.
[Pipeline] sh
+ node -v
/home/jenkins/agent/workspace/jnlp-test@tmp/durable-8ed80d21/script.sh.copy: 1: node: not found
+ true
...省略
[Pipeline] echo
This pipeline is run in node pod.
[Pipeline] sh
+ node -v
v20.13.1
[Pipeline] sh
+ npm -v
10.5.2
[Pipeline] sh
+ pnpm -v
9.1.2
...省略
```

```bash
[root@master ~]# kubectl -n devops get po
NAME                       READY   STATUS    RESTARTS      AGE
jenkins-79f4445887-lncxs   1/1     Running   2 (45h ago)   46h
jenkins-slave-2zwxb        2/2     Running   0             41s
```

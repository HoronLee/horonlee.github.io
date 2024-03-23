---
layout: post
title: 在k8s中构建CICD
date: 2024-02-27 15:07:00
tags: 
    - CentOS
    - Linux
    - Kubernetes
categories: 
    - 服务器运维
    - 云计算
    - Kubernetes
    - CICD
cover: https://www.kubernetes.org.cn/img/2020/10/jenkins-logo.jpg
password: 
hide: 
---
# 安装CICD所需资源
`curl -O http://mirrors.douxuedu.com/competition/BlueOcean.tar.gz && tar -zxf BlueOcean.tar.gz && cp BlueOcean/tools/docker-compose-Linux-x86_64 /usr/bin/docker-compose && docker-compose version && tar -zxf BlueOcean/harbor-offline-installer.tar.gz -C /opt/ && sh /opt/harbor/install.sh && docker login -uadmin -pHarbor12345 172.16.2.90 && docker load -i BlueOcean/images/maven_latest.tar && docker tag maven 172.16.2.90/library/maven && docker push 172.16.2.90/library/maven && docker load -i BlueOcean/images/java_8-jre.tar && docker load -i BlueOcean/images/jenkins_jenkins_latest.tar && docker load -i BlueOcean/images/gitlab_gitlab-ce_latest.tar && kubectl create ns devops`

<!-- more -->

# 部署应用
## Jenkins部署
容器部分
`kubectl create deployment jenkins --image=jenkins/jenkins:latest --namespace=devops --port=8080 --dry-run=client -o yaml >> jenkins.yaml`
服务部分
`kubectl create service nodeport jenkins --tcp=8080:8080 --namespace=devops --dry-run=client -o yaml >> jenkins.yaml`
修改部分内容
```yaml
      serviceAccountName: jenkins
        imagePullPolicy: IfNotPresent
        securityContext: 
          runAsUser: 0
          privileged: true
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
---
    nodePort: 30880
---
kubectl create clusterrole jenkins --verb=* --resource=* --namespace=devops --dry-run=client -o yaml >> jenkins.yaml
---
kubectl create serviceaccount jenkins --namespace=devops --dry-run=client -o yaml >> jenkins.yaml
---
kubectl create clusterrolebinding jenkins --clusterrole=jenkins --serviceaccount=devops:jenkins --namespace=devops --dry-run=client -o yaml >> jenkins.yaml
```
## GitLab部署
容器部分
`kubectl create deployment gitlab --image=gitlab/gitlab-ce:latest --port=80 --namespace=devops --dry-run=client -o yaml >> gitlab.yaml`
服务部分
`kubectl create service nodeport gitlab --tcp=80:80 --namespace=devops --dry-run=client -o yaml >> gitlab.yaml`
修改部分内容
```
        env:
        - name: GITLAB_ROOT_PASSWORD
          value: admin@123
        - name: GITLAB_PORT
          value: "80"
```
## Jenkinsfile流水线
```
pipeline{
    agent none
    stages{
        stage('mvn-build'){
            agent {
                docker {
                    image '10.26.15.244/library/maven'
                    args '-v /root/.m2:/root/.m2'
                }
            }
            steps{
                sh 'cp -rfv /opt/repository /root/.m2/ && ls -l /root/.m2/repository'
                sh 'mvn package -DskipTests'
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true 
            }
        }
        stage('image-build'){
            agent any
            steps{
                sh 'cd gateway && docker build -t 10.26.15.244/springcloud/gateway -f Dockerfile .'
                sh 'cd config && docker build -t 10.26.15.244/springcloud/config -f Dockerfile .'
                sh 'docker login 10.26.15.244 -u=admin -p=Harbor12345'
                sh 'docker push 10.26.15.244/springcloud/gateway'
                sh 'docker push 10.26.15.244/springcloud/config'
            }
        }
        stage('cloud-deploy'){
            agent any
            steps{
                sh 'kubectl create ns springcloud'
                sh 'kubectl apply -f yaml/deployment/gateway-deployment.yaml'
                sh 'kubectl apply -f yaml/deployment/config-deployment.yaml'
                sh 'kubectl apply -f yaml/svc/gateway-svc.yaml'
                sh 'kubectl apply -f yaml/svc/config-svc.yaml'
            }
        }
    }
}
```

# 使用NFS和PVC持久化存储Jenkins数据

## 配置NFS服务

Worker节点

```bash
mkdir /opt/jenkins_home
vi /etc/exports
写入：/opr/jenkins_home *(rw,sync,no_root_squash)
systemctl enable nfs-server --now
```

Master节点

```bash
mkdir /opt/jenkins_home
mount nfs-server-ip:/opt/jenkins_home /opt/jenkins_home
df -Th | grep jenkins
输出：$nfs-server-ip-address:/opt/jenkins_home nfs4 40G 19G 22G 46% /opt/jenkins_home
```

## nfs-storage实现Jenkins持久化存储



在deployment下方加上卷挂载信息

```yaml
        volumeMounts:
        - name: jenkins
          mountPath: /var/jenkins_home
      volumes:
      - name: jenkins
        persistentVolumeClaim:
          claimName: jenkins-pvc
```

创建pv.yaml

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: jenkins-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  nfs:
    server: $nfs-server-ip-address
    path: /opt/jenkins_home
```

创建pvc.yaml

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```


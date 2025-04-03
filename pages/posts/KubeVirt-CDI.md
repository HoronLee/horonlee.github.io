---
layout: post
title: KubeVirt使用CDI来导入虚拟机镜像
date: 2024-06-28 14:47:06
tags:
    - Linux
    - Kubernetes
    - 云计算
    - KubeVirt
categories:
    
    - 云计算
    - 虚拟化
cover: https://tse3-mm.cn.bing.net/th/id/OIP-C.B4Rc1aupXxDrxKPfYpOsMQHaDP?rs=1&pid=ImgDetMain
password: 
hide: 
---

# 使用容器化数据导入器 （CDI） 进行试验

> 本文参照官方文档编撰[使用 CDI 进行实验 |KubeVirt.io --- Experiment with CDI | KubeVirt.io](https://kubevirt.io/labs/kubernetes/lab2.html)

## 安装 CDI

在本练习中，我们使用其 Operator 部署最新版本的 CDI。

```bash
export VERSION=$(basename $(curl -s -w %{redirect_url} https://github.com/kubevirt/containerized-data-importer/releases/latest))
kubectl create -f https://github.com/kubevirt/containerized-data-importer/releases/download/$VERSION/cdi-operator.yaml
kubectl create -f https://github.com/kubevirt/containerized-data-importer/releases/download/$VERSION/cdi-cr.yaml
```

检查在上一步中创建的 cdi CustomResource （CR） 的状态。CR 的阶段将从“正在部署”更改为“已部署”，因为它部署的 Pod 已创建并达到“正在运行”状态。

```bash
kubectl get cdi cdi -n cdi
```

查看添加的“cdi”容器。

```bash
kubectl get pods -n cdi
```

## 使用 CDI 导入磁盘映像

首先，需要创建一个指向要导入的源数据的 DataVolume。在此示例中，我们将使用 DataVolume 将 Fedora40 云镜像导入 PVC 并启动一个使用它的虚拟机。

这里我们使用更加灵活的管理方案，因为 CDI 导入器会自动生成对应镜像的 PVC，所以我们最好通过自定义 nfs 的 storageclass 来保证每一次都可以自动创建 PV 去对接自动生成的 PVC，所以我们先配置 nfs-storage

### 配置 nfs-storage

#### 安装 nfs-server

- 在每个机器 `yum install -y nfs-utils`
- 在master 执行以下命令  `echo "/data/k8s *(insecure,rw,sync,no_root_squash)" > /etc/exports`
  执行以下命令，启动 nfs 服务
- 创建共享目录 `mkdir -p /data/k8s`
- 在master执行 `systemctl enable rpcbind` `systemctl enable nfs-server` `systemctl start rpcbind` `systemctl start nfs-server`
- 使配置生效 `exportfs -r`
- 检查配置是否生效 `exportfs`

### 配置默认存储

> 在master上配置动态供应的默认存储类yaml，172.30.26.211为master的ip地址

vim nfs-storage.yaml并且创建此资源

```yaml
# 为NFS设置rbac
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["persistentvolumes"]
    verbs: ["get", "list", "watch", "create", "delete"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "update"]
  - apiGroups: ["storage.k8s.io"]
    resources: ["storageclasses"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "update", "patch"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["endpoints"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io
---
# 创建nfs subdir external provisioner
kind: Deployment
apiVersion: apps/v1
metadata:
  name: nfs-client-provisioner
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nfs-client-provisioner
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          # image: registry.k8s.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2
          image: k8s.dockerproxy.com/sig-storage/nfs-subdir-external-provisioner:v4.0.2
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: k8s-sigs.io/nfs-subdir-external-provisioner
            - name: NFS_SERVER
              # value: NFS server的ip
              value: 192.168.3.10
            - name: NFS_PATH
              # value: NFS server的共享目录
              value: /data/k8s
      volumes:
        - name: nfs-client-root
          nfs:
            # value: NFS server的ip
            server: 192.168.3.10
            path: /data/k8s
---
# 创建StorageClass
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-client
provisioner: k8s-sigs.io/nfs-subdir-external-provisioner # or choose another name, must match deployment's env PROVISIONER_NAME'
parameters:
  pathPattern: "${.PVC.namespace}/${.PVC.annotations.nfs.io/storage-path}" # 此处也可以使用 "${.PVC.namespace}/${.PVC.name}" 来使用pvc的名称作为nfs中真实目录名称
  onDelete: delete
```

#### 确认配置是否生效

```bash
kubectl get sc
kubectl get pod -A
```

```bash
➜  kubevirt kubectl get sc
kubectl get pod -A
NAME                   PROVISIONER                                   RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path                         Delete          WaitForFirstConsumer   false                  28d
nfs-client             k8s-sigs.io/nfs-subdir-external-provisioner   Delete          Immediate              false                  9m27s
default       nfs-client-provisioner-658dc7fc94-r5vx2   1/1     Running     0              10m
```

## 创建 DataVolume

自定义 CDI 控制器将使用此 DataVolume 创建具有相同名称和正确规范/注释的 PVC，以便特定于导入的控制器检测到它并启动导入器 pod。此 Pod 将收集源字段中指定的镜像。

`vim dv_fedora.yaml`

```yaml
apiVersion: cdi.kubevirt.io/v1beta1
kind: DataVolume
metadata:
  name: "fedora"
spec:
  storage:
    resources:
      requests:
        storage: 5Gi
    storageClassName: nfs-client	#需要指定镜像存储类
  source:
    http:      
      url: "http://172.30.27.143/kubernetes/images/Fedora-Cloud-Base-AmazonEC2.x86_64-40-1.14.raw.xz"
```

`kubectl create -f dv_fedora.yml`

在此期间会产生一个用于导入镜像的 pod，

```bash
root@worker1:/data/k8s# kubectl get po
NAME                                    READY   STATUS    RESTARTS      AGE
importer-fedora40                       1/1     Running   0             70s
```

稍等片刻，nfs 共享目录中就会出现指定的目录


```bash
➜  kubevirt kubectl get pv
NAME                                       CAPACITY     ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM            STORAGECLASS   VOLUMEATTRIBUTESCLASS   REASON   AGE
pvc-261b9f51-28ca-496f-acac-46dbc10dc3de   5681173672   RWX            Delete           Bound    default/fedora   nfs-client     <unset>                          8m57s
```

##  创建虚拟机

`vim vm1_pvc.yml`

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  creationTimestamp: 2018-07-04T15:03:08Z
  generation: 1
  labels:
    kubevirt.io/os: linux
  name: vm1
spec:
  running: true
  template:
    metadata:
      creationTimestamp: null
      labels:
        kubevirt.io/domain: vm1
    spec:
      domain:
        cpu:
          cores: 2
        devices:
          disks:
          - disk:
              bus: virtio
            name: disk0
          - cdrom:
              bus: sata
              readonly: true
            name: cloudinitdisk
        machine:
          type: q35
        resources:
          requests:
            memory: 1024M
      volumes:
      - name: disk0
        persistentVolumeClaim:
          claimName: fedora
      - cloudInitNoCloud:
          userData: |
            #cloud-config
            hostname: vm1
            disable_root: false
            ssh_pwauth: True
            ssh_authorized_keys:
              - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG7GvuX3fVzOBYn0c53OGemzlQr2JaNJN2uKb4pXEdax root@master
        name: cloudinitdisk
```

- 其中volumes中的claimName需要对应之前创建的 datavolume 的 name
- ssh_authorized_keys需要对应你本机生成的公钥，用于 ssh 免密登录，ssh 登录后可修改用户密码再用控制台登录

创建虚拟机`kubectl create -f vm1_pvc.yml`

稍等一会儿可以看到 vm 和 vmi 都已经在 Running 状态

```bash
root@master:~/kubevirt# kubectl get vm
NAME   AGE   STATUS    READY
vm1    14s   Running   True
root@master:~/kubevirt# kubectl get vmi
NAME   AGE   PHASE     IP                NODENAME   READY
vm1    11s   Running   192.168.235.189   worker1    True
```

### 连接虚拟机

通过控制台连接，使用 ctrl+] 来退出控制台

```bash
root@master:~/kubevirt# virtctl console vm1
Successfully connected to vm1 console. The escape sequence is ^]

vm1 login:
```

通过 ssh 连接（需要之前配置免密登录）

```bash
root@master:~/kubevirt# ssh 192.168.235.189
The authenticity of host '192.168.235.189 (192.168.235.189)' can't be established.
ED25519 key fingerprint is SHA256:ey51NxBB0WK8MR0/eDzFYFNQBkztZfOYMndH2b2rppE.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.235.189' (ED25519) to the list of known hosts.
[root@vm1 ~]# 
```

#### 暴露虚拟机端口

使用 virtctl 来手动暴露虚拟机的某个端口，这里我们选择 ssh 服务

```bash
virtctl expose vmi vm1 --name=vm1-ssh --port=20222 --target-port=22 --type=NodePort
root@master:~/kubevirt# virtctl expose vmi vm1 --name=vm1-ssh --port=20222 --target-port=22 --type=NodePort
Service vm1-ssh successfully exposed for vmi vm1
root@master:~/kubevirt# kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)           AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP           25d
vm1-ssh      NodePort    10.102.4.109   <none>        20222:31228/TCP   4s
```

可以看到自动创建了一个 NodePort 类型的 Service，这样就可以在集群外访问虚拟机了！

当然，如果未设置密码，还是需要使用公钥！

```bash
ssh -i ~/.ssh/公钥 fedora@172.30.26.211 -p 31228
```

---

到此为止，我们就完成了对 KubeVirt 的基础使用！

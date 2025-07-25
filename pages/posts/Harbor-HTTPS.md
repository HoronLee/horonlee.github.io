---
layout: post
title: Harbor配置HTTPS访问
date: 2025-07-12 22:58:31
tags: 
    - Harbor
    - Devops
categories: 
    - 云计算
    - Kubernetes
cover: https://minio-api.horonlee.com/blogpic/img/20250724220528555.png
password: 
hide: 
---
##  需求
docker部署了一个harbor，需要配置docker和k3s集群https访问harbor，主机物理地址192.168.6.166

当前在家庭网络的OpenWrt中配置了harbor.local.com指向192.168.6.166
```bash
➜  ssl git:(master) ✗ kubectl run -i --tty dns-test --image=busybox --restart=Never --rm -- sh
If you don't see a command prompt, try pressing enter.
/ # ping local.com
PING local.com (192.168.6.166): 56 data bytes
64 bytes from 192.168.6.166: seq=0 ttl=64 time=0.082 ms
--- local.com ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.082/0.087/0.093 ms
/ # ping harbor.local.com
PING harbor.local.com (192.168.6.166): 56 data bytes
64 bytes from 192.168.6.166: seq=0 ttl=64 time=0.115 ms
--- harbor.local.com ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.098/0.106/0.115 ms
```
可以看到在k8s中也是生效的，如果无法配置路由器，也不要紧，可以按照下文改本机和k8s集群的配置！
## 签发证书
来自未来的TIPS：这里推荐一个工具[本地证书生成器](https://github.com/Fishdrowned/ssl.git)，可以很方便得本地自签泛域名证书，适合docker和k8s内部自用
下文是来自于harbor文档的签署方法，我推荐用生成器
### 生成 CA 私钥
```bash
openssl genrsa -out ca.key 4096
```
### 生成自签 CA 证书
```bash
openssl req -x509 -new -nodes -sha512 -days 3650 \
  -subj "/C=CN/ST=Zhejiang/L=Hangzhou/CN=MyPersonal Root CA" \
  -key ca.key \
  -out ca.crt
```
### 生成 Harbor 域名私钥
```bash
openssl genrsa -out harbor.local.com.key 4096
```
### 生成 Harbor 域名的 CSR
```bash
openssl req -sha512 -new \
  -subj "/C=CN/ST=Zhejiang/L=Hangzhou/CN=harbor.local.com" \
  -key harbor.local.com.key \
  -out harbor.local.com.csr
```
### 生成 v3.ext 示例
```bash
cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=harbor.local.com
IP.1=192.168.6.166
EOF
```
### 创建 v3.ext文件
```bash
openssl x509 -req -sha512 -days 3650 \
  -extfile v3.ext \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -in harbor.local.com.csr \
  -out harbor.local.com.crt
```
## 添加域名解析
### 本机解析
```bash
➜  ~ cat /etc/hosts 
# Static table lookup for hostnames.
# See hosts(5) for details.
127.0.0.1        localhost
::1              localhost
192.168.6.166    harbor.local.com
```
### K8S集群解析
直接编辑coredns的configmap，在hosts字段中添加所需解析
```bash
kubectl -n kube-system edit configmap coredns

hosts {
  192.168.6.166 harbor.local.com
  fallthrough
}
```
## Docker使用证书
切记，在配置文件中不能再配置`"insecure-registries": ["192.168.6.166:8088"]`之类的字段了！
```bash
➜  docker cat daemon.json
{
        "registry-mirrors": [
                "https://docker.1ms.run",
                "https://docker.1panelproxy.com"
        ]
}
```
创建文件夹，放入三样证书
```bash
➜  harbor.local.com:8082 pwd
/etc/docker/certs.d/harbor.local.com:8082
➜  harbor.local.com:8082 ls
ca.crt  harbor.local.com.cert  harbor.local.com.key
```
## k3s使用证书
和docker同理，指定三样证书文件即可，但是需要额外编写配置字段，如下
```bash
➜  ~ cat /etc/rancher/k3s/registries.yaml 
mirrors:
  harbor.local.com:
    endpoint:
      - "https://harbor.local.com:8082"
configs:
  "harbor.local.com:8082":
    auth:
      username: admin
      password: horon63163798
    tls:
      cert_file: /opt/harbor/certs.d/harbor.local.com.cert
      key_file: /opt/harbor/certs.d/harbor.local.com.key
      ca_file: /opt/harbor/certs.d/ca.crt
```
## Containerd使用证书
先创建配置文件，注意目录也需要添加端口号
```bash
root@R430:/opt/harbor# mkdir -p /etc/containerd/certs.d/harbor.local.com:8082
root@R430:/opt/harbor# cat > /etc/containerd/certs.d/harbor.local.com:8082/hosts.toml << EOF
server = "https://harbor.local.com:8082"
[host."https://harbor.local.com:8082"]
  capabilities = ["pull", "resolve", "push"]
  skip_verify = true
EOF
```
重启containerd
```bash
root@R430:/opt/harbor# systemctl restart containerd
```
用nerdctl登录测试，其中参数`--insecure-registry`可以不加
```bash
root@R430:/opt/harbor# nerdctl login -u admin --insecure-registry harbor.local.com:8082
Enter Password: 
WARN[0003] skipping verifying HTTPS certs for "harbor.local.com:8082" 
Login Succeeded
```
成功！
## k8s授权访问
使用如下命令创建一个Secret对象
```bash
kubectl create secret docker-registry registry-secret --namespace=default --docker-server=[不带有协议的harbor域名] --docker-username=admin --docker-password=[你的密码]
```
测试
```bash
➜  ssl git:(master) ✗ kubectl run -i --tty dns-test --image=harbor.local.com:8082/library/busybox --restart=Never --rm -- sh
If you don't see a command prompt, try pressing enter.
/ # 

➜  /opt kubectl describe po dns-test
...省略
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  14s   default-scheduler  Successfully assigned default/dns-test to r430
  Normal  Pulling    13s   kubelet            Pulling image "harbor.local.com:8082/library/busybox"
  Normal  Pulled     13s   kubelet            Successfully pulled image "harbor.local.com:8082/library/busybox" in 243ms (243ms including waiting). Image size: 2156518 bytes.
  Normal  Created    13s   kubelet            Created container: dns-test
  Normal  Started    13s   kubelet            Started container dns-test
```
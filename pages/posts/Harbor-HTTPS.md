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
cover: https://pic2.zhimg.com/v2-dfe8f68e2594f9f28387d7880bd66507_1440w.jpg?source=172ae18b
password: 
hide: 
---
##  需求
docker部署了一个harbor，需要配置docker和k3s集群https访问harbor，主机物理地址192.168.6.166
## 签发证书
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
openssl genrsa -out harbor.horon.top.key 4096
```
### 生成 Harbor 域名的 CSR
```bash
openssl req -sha512 -new \
  -subj "/C=CN/ST=Zhejiang/L=Hangzhou/CN=harbor.horon.top" \
  -key harbor.horon.top.key \
  -out harbor.horon.top.csr
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
DNS.1=harbor.horon.top
IP.1=192.168.6.166
EOF
```
### 创建 v3.ext文件
```bash
openssl x509 -req -sha512 -days 3650 \
  -extfile v3.ext \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -in harbor.horon.top.csr \
  -out harbor.horon.top.crt
```
## 添加域名解析
### 本机解析
```bash
➜  ~ cat /etc/hosts 
# Static table lookup for hostnames.
# See hosts(5) for details.
127.0.0.1        localhost
::1              localhost
192.168.6.166    harbor.horon.top
```
### K8S集群解析
直接编辑coredns的configmap，在hosts字段中添加所需解析
```bash
kubectl -n kube-system edit configmap coredns

hosts {
  192.168.6.166 harbor.horon.top
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
➜  harbor.horon.top:8089 pwd
/etc/docker/certs.d/harbor.horon.top:8089
➜  harbor.horon.top:8089 ls
ca.crt  harbor.horon.top.cert  harbor.horon.top.key
```
## k3s使用证书
和docker同理，指定三样证书文件即可，但是需要额外编写配置字段，如下
```bash
➜  ~ cat /etc/rancher/k3s/registries.yaml 
mirrors:
  harbor.horon.top:
    endpoint:
      - "https://harbor.horon.top:8089"
configs:
  "harbor.horon.top:8089":
    auth:
      username: admin
      password: horon63163798
    tls:
      cert_file: /opt/harbor/certs.d/harbor.horon.top.cert
      key_file: /opt/harbor/certs.d/harbor.horon.top.key
      ca_file: /opt/harbor/certs.d/ca.crt
```
## Containerd使用证书
暂未实现...
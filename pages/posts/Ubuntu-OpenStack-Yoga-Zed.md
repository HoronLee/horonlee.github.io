---
title: Ubuntu搭建OpenStack-Yoga(Zed)
businesscard: true
date: 2023-02-23 22:30:44
updated:
tags:
    - CentOS
    - Linux
    - OpenStack
categories:
    - 服务器运维
    - 集群
    - OpenStack-Yoga(Zed)
keywords:
description:
top_img:
comments:
cover: https://tse1-mm.cn.bing.net/th/id/OIP-C.CZwj5SbW0RXNrztZceTZtwHaEK?pid=ImgDet&rs=1
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
# Ubuntu搭建OpenStack-Zed
注意：本篇只作为个人笔记，记录搭建过程的一些坑和问题，仅供参考！
所有服务的密码都是123456。
# 网络配置
1. Nat网卡用于下载文件：192.168.74.128~131
2. 仅主机：192.168.100.*
3. 仅主机：192.168.200.*
子网掩码：255.255.255.0(/24)
以下是网卡静态配置，ens34和ens35就是两张仅主机网卡（配置为静态），ens33是NAT网卡（无所谓）。
```
# This is the network config written by 'subiquity'
network:
  ethernets:
    ens33:
      dhcp4: true
    ens34:
      addresses: [192.168.100.129/24]
      dhcp4: false
      nameservers:
        addresses: [114.114.114.114]
    ens35:
      addresses: [192.168.200.129/24]
      dhcp4: false
      nameservers:
        addresses: [114.114.114.114]
```
## hosts
127.0.0.1 localhost
192.168.100.128 controller
192.168.100.129 computer
192.168.100.130 computer1
192.168.100.131 block
配置完之后每个节点互相用host名ping一下看看能不能互相ping通
> 官网的配置
> 10.0.0.11       controller
> 10.0.0.31       compute1
> 10.0.0.41       block1
# controller
## 网卡
1. nes33：192.168.74.128
2. ens34：192.168.100.128
3. ens35：192.168.200.128

## NTP服务
> 重点：local stratum 10  #开启，即使server指令中时间服务器不可用，也允许将本地时间作为标准时间授予其他客户端

在chronyd.conf文件中务必加上`local stratum 10`，参数，否则会造成有NTP服务的连接但是同步数据，即为0ns延迟！(其实写个1也可以的)

## 安装
add-apt-repository cloud-archive:zed
apt install python3-openstackclient

## SQL数据库
apt install mariadb-server python3-pymysql
执行`mysql_secure_installation`的过程中我没有禁止root账户远程登录数据库。

## 消息队列
apt install rabbitmq-server
记得密码123456和给权限

## Memcached
apt install memcached python3-memcache
-l 192.168.100.128

## Etcd
apt install etcd
```
ETCD_NAME="controller"
ETCD_DATA_DIR="/var/lib/etcd"
ETCD_INITIAL_CLUSTER_STATE="new"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster-01"
ETCD_INITIAL_CLUSTER="controller=http://192.168.100.128:2380"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.100.128:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.100.128:2379"
ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380"     #存疑
ETCD_LISTEN_CLIENT_URLS="http://192.168.100.128:2379"
```

## 出大问题
OpenStack官网没有Zed的OpenStack主体安装指南？我还没法用`add-apt-repository cloud-archive:yoga`来换软件源，啊！
还好后来找到了（

## Keystone
数据库巴拉巴拉
Apache Http服务加一个ServerName controller
老规矩新建admin-openrc作为keystone的管理员认证变量
```
export OS_USERNAME=admin
export OS_PASSWORD=123456
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3
```

## Glance
数据库巴拉巴拉
注册限额设置就不设置了（怕麻烦bushi）

不确定：在/etc/glance/glance-api.conf中，配置对梯形失真的访问权限：[oslo_limit]
```
[oslo_limit]
auth_url = http://controller:5000
auth_type = password
user_domain_id = default
username = MY_SERVICE #不知道需不需要改为123456，文档没说要改
system_scope = all
password = MY_PASSWORD  #不知道需不需要改为123456，文档没说要改
endpoint_id = ENDPOINT_ID
region_name = RegionOne
```

不确定：确保MY_SERVICE帐户具有读者访问权限 系统范围资源（如限制）：
```
root@controller:/home/controller# openstack role add --user MY_SERVICE --user-domain Default --system all reader
No user with a name or ID of 'MY_SERVICE' exists.
```

吐槽一句，文档给的测试镜像cirros下载实在是太慢了，我用香港的服务器下载才好一点，国内科学上网还是慢。

## Placement
数据库巴拉巴拉

## Nova
数据库巴拉巴拉

## 将计算节点添加到单元数据库
**注意，本操作需要在所有computer节点配置好nova服务之后执行！**
- 列出来nove节点：`openstack compute service list --service nova-compute`
  - 我这里就会出现三个节点，其中两个是computer和computer1，当然controller也会有一个/
- 列出当前所有服务节点：`openstack compute service list`
- 列出当前所有服务的API端点`openstack catalog list`
- 列出当前所有镜像`openstack image list`


添加新计算节点时，必须在控制器节点上运行以注册这些新计算 节点。或者，您可以在 中设置适当的间隔：nova-manage cell_v2 discover_hosts/etc/nova/nova.conf
```
[scheduler]
discover_hosts_in_cells_interval = 300
```

## Neutron
先配置controller再配置其他节点
**注意**：一般使用`网络选项 2：自助服务网络`来配置网络

出大问题，执行`openstack extension list --network`指令验证网络操作结果输出`Faild to retreieve extensions list from Network API`，这不纯纯的寄了吗？这都最后一个服务了啊，就差一个面板了，啊啊啊啊啊啊！！！！

# computer
## 网卡
1. nes33：192.168.74.129
2. ens34：192.168.100.129
3. ens35：192.168.200.129

## 安装
add-apt-repository cloud-archive:zed
apt install nova-compute
apt install mariadb-server python3-pymysql

## nova
数据库巴拉巴拉

> [vnc]
> 如果用于访问远程控制台的 Web 浏览器驻留在 无法解析主机名，必须替换为 控制器节点。controller

确定计算节点是否支持硬件加速 虚拟机：
```
egrep -c '(vmx|svm)' /proc/cpuinfo
```
结果我输出了12？1是支持，0是不支持，那我12是支持还是不支持？暂且假设大于1就是支持吧，那就不用配置为QEMU了。


# computer1
## 网卡
1. nes33：192.168.74.130
2. ens34：192.168.100.130
3. ens35：192.168.200.130
## 安装
add-apt-repository cloud-archive:zed
apt install nova-compute

# block
## 网卡
1. nes33：192.168.74.131
2. ens34：192.168.100.131
3. ens35：92.168.200.131
## 安装
add-apt-repository cloud-archive:zed
apt install python3-openstackclient
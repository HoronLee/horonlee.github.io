---
title: OpenStack运维笔记
businesscard: true
date: 2023-07-02 13:03:41
updated:
tags: 
    - CentOS
    - Linux
    - OpenStack
categories:
    - 服务器运维
    - 云计算
    - OpenStack
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
swiper_index: 1
---
# 环境准备
## hostname配置（controller+compute）
1. `hostnamectl set-hostname $hostname` 、`bash`
2. `vi /etc/hosts`编辑host文件
3. ping一下测试连通性

## 修改网卡配置为静态ip（controller+compute）
1. vim /etc/sysconfig/network-scripts/ifcfg-$网卡名
    ```vim
    TYPE=Ethernet     # 不可更改
    BOOTPROTO=static
    DEFROUTE=yes
    NAME=eno1     
    DEVICE=eno1    # 不可更改，与设备名一致
    ONBOOT=yes

    IPADDR=192.168.100.10  # controller和compute不一样
    NETMASK=255.255.255.0
    ```
2. systemctl restart network

## 关闭防火墙和selinux，并设置不开机自启动（controller+compute）
1. systemctl stop firewalld
2. systemctl disable firewalld
3. setenforce 0
4. sed -i "s/SELINUX=.*/SELINUX=disabled/" /etc/selinux/config

## vsftp服务配置（controller）

1. 安装ftp服务`yum install -y vsftpd`
2. 在配置文件中加入配置项`echo "anon_root=/opt" >> /etc/vsftpd/vsftpd.conf `
3. `systemctl start vsftpd`、`systemctl enable vsftpd`

## 配置yum源（Controller+Compute）
1. 删除自带的所有yum仓库`rm -rf /etc/yum.repos.d/*`
2. 将比赛给予的yum源配置完毕
    `vi /etc/yum.repos.d/http.repo`
    ```vim
    [centos]
    name=centos
    baseurl=http://10.3.61.229/centos
    gpgcheck=0
    enabled=1

    [iaas]
    name=iaas
    baseurl=http://10.3.61.229/openstack/iaas-repo
    gpgcheck=0
    enabled=1
    ```
3. 测试`yum clean && yum repolist`

## 配置yum源（Demo）

### controller

> 镜像准备

1. 创建两个文件夹`mkdir /opt/{centos7-2009,iaas-train}`
2. 挂载镜像`mount /root/CentOS-7-x86_64-DVD-2009.iso /mnt/`
3. 复制iso内容文件到指定文件夹`cp -r /mnt/* /opt/centos7-2009/`
4. 卸载当前镜像`umount /mnt/`
5. 挂载镜像`mount /root/CentOS-7-x86_64-DVD-2009.iso /mnt/`
6. 复制iso内容文件到指定文件夹`cp -r /mnt/* /opt/iaas-train/`
7. 卸载当前镜像`umount /mnt/`

> yum源配置

**Controller**
`mv /etc/yum.repos.d/* /media/`
`cat  /etc/yum.repos.d/yum.repo`

```vim
[centos]
name=centos7-2009
baseurl=file:///opt/centos7-2009
gpgcheck=0
enabled=1
[openstack]
name=openstack-iaas
baseurl=file:///opt/iaas-train/iaas-repo
gpgcheck=0
enabled=1
```
**Compute**
> 指向了controller的ftp对外公开的地址

`mv /etc/yum.repos.d/* /media/`
`cat  /etc/yum.repos.d/yum.repo`

```vim
[centos]
name=centos7-2009
baseurl=ftp://controller/centos7-2009
gpgcheck=0
enabled=1
[openstack]
name=openstack-iaas
baseurl=ftp://controller/iaas-train/iaas-repo
gpgcheck=0
enabled=1
```

## 提前分区磁盘（仅compute）
1. 取消挂载`umount /mnt`
2. 取消vdb盘的自动挂载
    `vi /etc/fstab`
    将最后一行
    /dev/vdb /mnt auto defaults,nofail,x-systemd.requires=cloud-init.service,comment=cloudconfig 0 2
    删除
### 分区磁盘
1. `fdisk /dev/vdb`
2. 总共分4个区（10G+10G+10G+5G）
3. `n p enter enter +10G`
4. `n p enter enter +10G`
5. `n p enter enter +10G`
6. `p`
7. `w`
8. 检查`lsblk`

# 安装openstack
> 组件预览
> ⚠如果没有placement组件，则nova组件无法正常工作

| 组件名称  | Controller | Compute |   作用   |
| :-------- | :--------: | :-----: | :------: |
| Keystone  |     √      |    ×    | 身份验证 |
| Glance    |     √      |    ×    | 镜像管理 |
| Placement |     √      |    ×    | 放置服务 |
| Nova      |     √      |    √    | 计算服务 |
| Neutron   |     √      |    √    | 网络服务 |
| Dashboard |     √      |    ×    | 管理面板 |

## 安装openstack-iaas软件包（controller+compute）
`yum install openstack-iaas -y`

## 修改初始脚本文件
1. vi /etc/openstack/openrc.sh
2. 删除第一列注释ctrl+v，↓到最后一行单击n
3. 填充大部分密码：`:%s/PASS=/PASS=000000/`
4. 补全遗漏的密码，第73行（:set number）：`METADATA_SECRET=000000`、第6行和第15行的主机密码。
5. 
    ```vim
    $HOST_IP=10.3.61.245
    HOST_PASS=000000
    $HOST_NAME=controller
    $HOST_IP_NODE=10.3.61.224
    $HOST_PASS_NODE=000000
    $HOST_NAME_NODE=compute
    $network_segment_IP=10.3.61.0/24
    $RABBIT_USER=openstack
    RABBIT_PASS=000000
    DB_PASS=000000
    $DOMAIN_NAME=demo
    ADMIN_PASS=000000
    DEMO_PASS=000000
    KEYSTONE_DBPASS=000000
    GLANCE_DBPASS=000000
    GLANCE_PASS=000000
    PLACEMENT_DBPASS=000000
    PLACEMENT_PASS=000000
    NOVA_DBPASS=000000
    NOVA_PASS=000000
    NEUTRON_DBPASS=000000
    NEUTRON_PASS=000000
    METADATA_SECRET=000000
    $INTERFACE_NAME=eth1
    $Physical_NAME=provider
    $minvlan=101
    $maxvlan=200
    CINDER_DBPASS=000000
    CINDER_PASS=000000
    $BLOCK_DISK=vdb1
    SWIFT_PASS=000000
    $OBJECT_DISK=vdb2
    $STORAGE_LOCAL_NET_IP=10.3.61.225（计算节点网络段IP，因为这里计算节点的网络段与管理段使用的是同一网络，所以为计算节点的管理段IP）
    TROVE_DBPASS=000000
    TROVE_PASS=000000
    HEAT_DBPASS=000000
    HEAT_PASS=000000
    CEILOMETER_DBPASS=000000
    CEILOMETER_PASS=000000
    AODH_DBPASS=000000
    AODH_PASS=000000
    ZUN_DBPASS=000000
    ZUN_PASS=000000
    KURYR_PASS=000000
    OCTAVIA_DBPASS=000000
    OCTAVIA_PASS=000000
    MANILA_DBPASS=000000
    MANILA_PASS=000000
    $SHARE_DISK=vdb3
    CLOUDKITTY_DBPASS=000000
    CLOUDKITTY_PASS=000000
    BARBICAN_DBPASS=000000
    BARBICAN_PASS=000000
    ```
6. 运行脚本`iaas-pre-host.sh`
7. 重新连接服务器

## 安装数据库&调优（controller）
1. 安装mysql`iaas-install-mysql.sh`
2. 配置文件调优`vi /etc/my.cnf`
   1. 数据库支持大小写`lower_case_table_names=1`
   2. 数据库缓存`innodb_buffer_pool_size=4G`
   3. 数据库的log buffer即redo日志缓冲`innodb_log_buffer_size=64M`
   4. 设置数据库的redo log即redo日志大小`innodb_log_file_size=256M`
   5. 数据库的redo log文件组即redo日志的个数配置`innodb_log_files_in_group=2`
   6. 保存退出后重启服务`systemctl restart mariadb`
   7. 参数检查`mysql -uroot -p000000 -e "show variables like 'innodb_%';"`

## Keystone安装使用（controller）

> 每次openstack操作引入环境变量
> `source /etc/keystone/admin-openrc.sh`

> 在controller节点上使用iaas-install-keystone.sh脚本安装Keystone服务。安装完成后，使用相关命令，创建用户chinaskill，密码为000000。完成后提交控制节点的用户名、密码和IP地址到答题框。

1. 安装keystone`iaas-install-keystone.sh`
2. 创建用户`chinaskill`：`openstack user create --password 000000 chinaskill`
3. 列出用户表：`openstack user list`
```bash
[root@controller ~]# openstack user list
+----------------------------------+------------+
| ID                               | Name       |
+----------------------------------+------------+
| d772a4faa23843dc9b3b19dd20fef6ee | admin      |
| bb98134937d748b4a4f2abaea41a8cb2 | demo       |
| 078316ff563447f0af17d5fb4186f6a1 | chinaskill |
+----------------------------------+------------+
```
## Glance安装使用（controller）

> 在controller节点上使用iaas-install-glance.sh脚本安装glance 服务。使用命令将提供的cirros-0.3.4-x86_64-disk.img镜像（该镜像在HTTP服务中，可自行下载）上传至平台，命名为cirros，并设置最小启动需要的硬盘为10G，最小启动需要的内存为1G。完成后提交控制节点的用户名、密码和IP地址到答题框。

1. 安装Glance`iaas-install-glance.sh`
2. 下载测试镜像`curl -O http://10.3.61.229/openstack/images/cirros-0.3.4-x86_64-disk.img`
3. 创建镜像`openstack image create --min-disk 10 --min-ram 1024 --file cirros-0.3.4-x86_64-disk.img cirros`
4. 创建centos镜像`openstack image create --disk-format qcow2 --container-format bare --public --file /root/CentOS-7-x86_64-2009.qcow2 centos7-2009`
5. 列出镜像列表`openstack image show cirros`
6. 检测结果`openstack-service status|grep glance`

## Placement安装使用（controller）

1. 安装Placement`iaas-install-placement.sh`

## Nova安装使用（controller+compute）
> ⚠先在controller上安装Placement组件
> 在controller节点和compute节点上分别使用iaas-install-placement.sh脚本、iaas-install-nova -controller.sh脚本、iaas-install-nova-compute.sh脚本安装Nova服务。安装完成后，请修改nova相关配置文件，解决因等待时间过长而导致虚拟机启动超时从而获取不到IP地址而报错失败的问题。配置完成后提交controller点的用户名、密码和IP地址到答题框。

### controller+compute

1. 控制节点安装nova`iaas-install-nova-controller.sh`
2. （controller的dashboard装完后装）计算节点安装nova`iaas-install-nova-compute.sh`

### Nova优化
> 解决因等待时间过长而导致虚拟机启动超时从而获取不到IP地址而报错失败的问题
> ⚠在双节点Nova安装完毕后再优化
双节点执行`openstack-config --set /etc/nova/nova.conf DEFAULT vif_plugging_is_fatal false`

检测`cat /etc/nova/nova.conf`

## Neutron安装使用（controller+compute）

### controller+compute

1. 控制节点安装neutron`iaas-install-neutron-controller.sh`
2. （controller的dashboard装完后装）计算节点安装neutron`iaas-install-neutron-compute.sh`
3. 检测`openstack-service status`、`openstack network agent list`

## Dashboard安装使用（controller）

> 在controller节点上使用iaas-install-dashboad.sh脚本安装dashboad服务。安装完成后，将Dashboard中的Djingo数据修改为存储在文件中（此种修改解决了ALL-in-one快照在其他云平台Dashboard不能访问的问题）。完成后提交控制节点的用户名、密码和IP地址到答题框。

1. 安装dashboard`iaas-install-dashboad.sh`
2. 优化：
   1. 将Dashboard中的Djingo数据修改为存储在文件中`vi +104 /etc/openstack-dashboard/local_settings`、`ESSION_ENGINE = 'django.contrib.sessions.backends.file'`（将此行的cache修改为file）
3. 检测`curl -L http://controller/dashboard`、`cat /etc/openstack-dashboard/local_settings |grep SESSION`

# 运维题目

## Glance使用（比赛没有）（controller）

1. 使用镜像cirros-0.3.4-x86_64-disk.img通过命令上传镜像至OpenStack中`glance image-create --name cirros-0.3.4 --disk-format qcow2 --container-format bare --progress`
2. 查看镜像`glance image-list`
3. 镜像的详细信息`glance image-show $ID`
4. 更新镜像`glance help image-update `
5. 如果需要改变镜像启动硬盘最低要求值（min-disk）1G，min-disk默认单位为G。使用glance image-update更新镜像信息`glance image-update --min-disk=1 $ID`
6. 使用命令更新镜像启动内存最低要求值（min-ram）为1G，min-ram默认单位为M。使用glance image-update更新镜像`glance image-update --min-disk=1 $ID`
7. 使用命令更新镜像启动内存最低要求值（min-ram）为1G，min-ram默认单位为M。使用glance image-update更新镜像`glance image-update --min-ram=1024 $ID`
8. 删除上传至OpenStack平台中的镜像`glance image-delete $ID`

## Nova使用（controller+compute）

> flavor类型为OpenStack在创建云主机时需要提供的云主机大小类型，云主机的资源大小可使用不同的flavor类型来进行定义。

1. 使用命令创建一个flavor，10G的硬盘大小，1G内存，2颗vcpu，ID为1，名称为centos。`openstack flavor create --disk 10 --ram 1024  --vcpus 2 --id 1 centos`
2. 查看flavor类型列表`openstack flavor list`
3. flavor类型的详细信息`openstack flavor show centos`

> 访问安全组为是OpenStack提供给云主机的一个访问策略控制组，通过安全组中的策略可以控制云主机的出入访问规则。

1. 查看当前所创建的访问安全组列表`openstack security group list`
2. 查看安全组中的安全规则`openstack  security group rule list default`
3. 查看规则的详细信息`openstack  security group rule show $ID`
4. 创建安全组（都可以在dashboard完成）

## Cinder块存储安装使用（controller+compute）

> 在控制节点和计算节点上分别使用iaas-install-swift-controller.sh和iaas-install-swift-compute.sh脚本安装Swift服务。安装完成后，使用命令创建一个名叫examcontainer的容器，将cirros-0.3.4-x86_64-disk.img镜像上传到examcontainer容器中，并设置分段存放，每一段大小为10M。

1. 安装：控制节点`iaas-install-cinder-controller.sh`、计算节点`iaas-install-cinder-compute.sh`
2. 计算节点分一个5G的分区
    ```bash
    fdisk /dev/vdb
    n enter enter enter enter
    n enter +5G
    p
    w
    lsblk
    ```
3. 计算节点扩容块存储
   1. 创建物理卷`pvcreate /dev/vdb5`
   2. 扩展cinder-volume卷组，加入到cinder块存储的后端存储中`vgextend cinder-volumes /dev/vdb5`
   3. 检测`vgdisplay`

**基本使用**
1. 查询块存储服务状态`openstack volume service list`
2. 建块存储，大小为2G，名称为“volume”`openstack volume create --size 2 volume`
3. 查看块存储列表信息`openstack volume list`
4. 查看某一块存储的详细信息`openstack volume show volume`
5. 将创建的“volume”块存储添加至云主机“cirros-test”上`openstack server add volume cirros-test volume`
6. 将 “volume” 卷大小从2G扩容至3G`openstack volume set --size 3 volume`
7. 将扩容后的卷“volume”挂载至云主机“cirros-test”上`openstack server add volume centos_server volume`、`openstack volume list`


## Swift对象存储安装使用（controller+compute）

> 上传

1. 安装：控制节点`iaas-install-swift-controller.sh`、计算节点`iaas-install-swift-compute.sh`
2. 创建swift-test的容器`openstack container create swift-test`
3. 上传镜像到容器中`swift upload swift-test -S 10000000 cirros-0.3.4-x86_64-disk.img`
4. 创建本地文件结构`# mkdir test`、`cp anaconda-ks.cfg test/`
5. 在swift-test容器中创建一个object`openstack object create swift-test test/anaconda-ks.cfg `
6. 显示详细信息`openstack container show swift-test`、`openstack object show swift-test test/anaconda-ks.cfg`
7. 检测`openstack-service status | grep swift`

> 下载

1. 将“swift-test”容器中“test/anaconda-ks.cfg”对象下载至本地/opt/目录下`cd /opt/`、`openstack object save swift-test test/anaconda-ks.cfg`

> 删除

1. 删除容器内的对象`openstack object delete swift-test test/anaconda-ks.cfg`
2. 删除容器`openstack container delete swift-test`
   1. 因为容器里有对象，所以不能直接删除
    ```bash
    [root@controller opt]# openstack container delete swift-test
    Conflict (HTTP 409) (Request-ID: tx1eef6ea7aae947a49bdb3-0064a37fcc)
    ```
   2. 需要加一个参数`openstack container delete --recursive swift-test `

> 分片存储

1. 创建容器`swift post test`
2. 上传镜像并分片存储（cirros-0.3.4-x86_64-disk.img镜像、每个片段10MB）`swift upload test -S 10000000 cirros-0.3.4-x86_64-disk.img`
3. 查看cirros镜像的存储路径`swift stat test cirros-0.3.4-x86_64-disk.img`
4. 查看存储路径中的数据片`swift list test_segments`

## Manila文件共享安装使用（controller+compute）

> 在控制和计算节点上分别使用iaas-install-manila-controller.sh和iaas-install-manila-compute.sh脚本安装manila服务。安装服务后创建default_share_type共享类型（不使用驱动程序支持），接着创建一个大小为2G的共享存储名为share01并开放share01目录对OpenStack管理网段使用权限。最后提交控制节点的用户名、密码和IP地址到答题框。

1. 安装：控制节点`iaas-install-manila-controller.sh`、计算节点`iaas-install-manila-compute.sh`
2. 在控制节点主机，创建(不适用驱动程序支持)default_share_type共享类型`manila type-create default_share_type false`
3. 在控制节点主机，创建一个大小为2G的共享存储名为share01并开放share01目录对OpenStack管理网段使用权限
   1. 创建共享卷`manila create NFS 2 --name share01`
   2. 开放share01目录对OpenStack管理网段（自己所在的操作网段）使用权限`manila access-allow share01 ip 10.3.61.0/24 --access-level rw`
4. 检测`manila access-list share01`
5. 查看share01共享文件目录的访问路径`manila show share01 | grep path | cut -d'|' -f3`
    `path = 10.3.61.225:/var/lib/manila/mnt/share-0c605af8-f232-4ff2-b5ad-f2c35047e4cb`
6. 在OpenStack控制节点将share01共享目录挂载至/mnt目录下`mount -t nfs 10.3.61.225:/var/lib/manila/mnt/share-0c605af8-f232-4ff2-b5ad-f2c35047e4cb /mnt/`
7. 检查`df -h`

## Cloudkitty安装使用

> 使用iaas-install-cloudkitty.sh脚本安装cloudkitty服务，安装完毕后，启用hashmap评级模块，接着创建volume_thresholds组，创建服务匹配规则volume.size，并设置每GB的价格为0.01。接下来对应大量数据设置应用折扣，在组volume_thresholds中创建阈值，设置若超过50GB的阈值，应用2%的折扣（0.98）。设置完成后提交控制节点的用户名、密码和IP地址到答题框。

1. 控制节点安装`iaas-install-cloudkitty.sh`
2. 引导环境变量`source /etc/keystone/admin-openrc.sh`
3. 启用hashmap评级模块`openstack rating module enable hashmap `
4. 创建hashmap service`openstack rating hashmap service create volume.size`
5. 创建hashmap service group`openstack rating hashmap group create  volume_thresholds `
6. 创建volume单价`openstack rating hashmap mapping create -s [第4步创建的hashmap service的id] -g [第5步创建的hashmap service group的id] -t flat 0.01`
7. 创建service rule`openstack rating hashmap threshold create -s [第4步创建的hashmap service的id] -g [第5步创建的hashmap service group的id] -t rate 50 0.98`
8. 检测`cloudkitty module list`、`cloudkitty hashmap threshold list -s $(cloudkitty hashmap service list |grep volume | awk -F '|' '{print $3}')`

> 云主机计费

1. 创建云主机服务instance_test，通过命令创建service服务`openstack rating hashmap service create instance_test`
    ```bash
    +---------------+--------------------------------------+
    | Name          | Service ID                           |
    +---------------+--------------------------------------+
    | instance_test | 8c9cea7a-d2d3-4731-890c-926ef61679db |
    +---------------+--------------------------------------+
    ```
2. 并对其创建名为flavor_name的fields`openstack rating hashmap field create $ServiceID flavor_name`
    ```bash
    +-------------+--------------------------------------+--------------------------------------+
    | Name        | Field ID                             | Service ID                           |
    +-------------+--------------------------------------+--------------------------------------+
    | flavor_name | 18ee37dc-bc98-4091-a8d4-d3888e2dd6b1 | 8c9cea7a-d2d3-4731-890c-926ef61679db |
    +-------------+--------------------------------------+--------------------------------------+
    ```
3. 并设置规格为m1.small的云主机单价为1元`openstack rating hashmap mapping create --field-id $FieldID -t flat --value  m1.small 1`
    ```bash
    +--------------------------------------+----------+------------+------+--------------------------------------+------------+----------+------------+
    | Mapping ID                           | Value    | Cost       | Type | Field ID                             | Service ID | Group ID | Project ID |
    +--------------------------------------+----------+------------+------+--------------------------------------+------------+----------+------------+
    | e3e87d6b-71e2-474b-a353-440824b3c37a | m1.small | 1.00000000 | flat | 18ee37dc-bc98-4091-a8d4-d3888e2dd6b1 | None       | None     | None       |
    +--------------------------------------+----------+------------+------+--------------------------------------+------------+----------+------------+
    ```

> 镜像计费

1. 创建镜像收费服务image_size_test`openstack rating hashmap service create image_size_test`
    ```bash
    +-----------------+--------------------------------------+
    | Name            | Service ID                           |
    +-----------------+--------------------------------------+
    | image_size_test | 7bd8943d-fc5a-4860-b96e-61acab18f98a |
    +-----------------+--------------------------------------+
    ```
2. 为该服务单价设置为0.8元`openstack rating hashmap mapping create -s $ServiceID -t flat 0.8`
```bash
+--------------------------------------+-------+------------+------+----------+--------------------------------------+----------+------------+
| Mapping ID                           | Value | Cost       | Type | Field ID | Service ID                           | Group ID | Project ID |
+--------------------------------------+-------+------------+------+----------+--------------------------------------+----------+------------+
| 45be8ff6-0930-417f-b427-c4abeff5ac1c | None  | 0.80000000 | flat | None     | 7bd8943d-fc5a-4860-b96e-61acab18f98a | None     | None       |
+--------------------------------------+-------+------------+------+----------+--------------------------------------+----------+------------+
```

> 创建优惠服务

1. 创建名为dis_tests的服务`openstack rating hashmap service create dis_tests`
    ```bash
    +-----------+--------------------------------------+
    | Name      | Service ID                           |
    +-----------+--------------------------------------+
    | dis_tests | deeb1874-7970-4c6a-a27c-6530c0894dcf |
    +-----------+--------------------------------------+
    ```
2. 为dis_tests服务设置单价为0.8元`openstack rating hashmap mapping create -s $ServiceID -t flat 0.8`
    ```bash
    +--------------------------------------+-------+------------+------+----------+--------------------------------------+----------+------------+
    | Mapping ID                           | Value | Cost       | Type | Field ID | Service ID                           | Group ID | Project ID |
    +--------------------------------------+-------+------------+------+----------+--------------------------------------+----------+------------+
    | ad1090df-c20f-4242-b924-20c11667f28a | None  | 0.80000000 | flat | None     | deeb1874-7970-4c6a-a27c-6530c0894dcf | None     | None       |
    +--------------------------------------+-------+------------+------+----------+--------------------------------------+----------+------------+
    ```
3. 设置dis_tests服务使用量超过10000时提供8折优惠`openstack rating hashmap threshold create -s $ServiceID -t rate 10000 0.8`
    ```bash
    +--------------------------------------+----------------+------------+------+----------+--------------------------------------+----------+------------+
    | Threshold ID                         | Level          | Cost       | Type | Field ID | Service ID                           | Group ID | Project ID |
    +--------------------------------------+----------------+------------+------+----------+--------------------------------------+----------+------------+
    | 786c9bfb-3a67-4bce-851c-a10d6ad565fe | 10000.00000000 | 0.80000000 | rate | None     | deeb1874-7970-4c6a-a27c-6530c0894dcf | None     | None       |
    +--------------------------------------+----------------+------------+------+----------+--------------------------------------+----------+------------+
    ```

## Barbican安装使用（controller）

> 使用iaas-install-barbican.sh脚本安装barbican服务，安装服务完毕后，使用openstack命令创建一个名为secret01的密钥，创建完成后提交控制节点的用户名、密码和IP地址到答题框。

1. 控制节点安装`iaas-install-barbican.sh`
2. 创建一个名为secret01 的密钥`openstack secret store --name secret01 --payload secretkey`
    ```bash
    +---------------+------------------------------------------------------------------------+
    | Field         | Value                                                                  |
    +---------------+------------------------------------------------------------------------+
    | Secret href   | http://controller:9311/v1/secrets/1e821d32-94b0-4b13-b1f5-0530a02db037 |
    | Name          | secret01                                                               |
    | Created       | None                                                                   |
    | Status        | None                                                                   |
    | Content types | None                                                                   |
    | Algorithm     | aes                                                                    |
    | Bit length    | 256                                                                    |
    | Secret type   | opaque                                                                 |
    | Mode          | cbc                                                                    |
    | Expiration    | None                                                                   |
    +---------------+------------------------------------------------------------------------+
    ```
3. 查询secret列表信息`openstack secret list`
    ```bash
    +------------------------------------------------------------------------+----------+---------------------------+--------+-----------------------------+-----------+------------+-------------+------+------------+
    | Secret href                                                            | Name     | Created                   | Status | Content types               | Algorithm | Bit length | Secret type | Mode | Expiration |
    +------------------------------------------------------------------------+----------+---------------------------+--------+-----------------------------+-----------+------------+-------------+------+------------+
    | http://controller:9311/v1/secrets/1e821d32-94b0-4b13-b1f5-0530a02db037 | secret01 | 2023-07-04T07:23:17+00:00 | ACTIVE | {u'default': u'text/plain'} | aes       |        256 | opaque      | cbc  | None       |
    +------------------------------------------------------------------------+----------+---------------------------+--------+-----------------------------+-----------+------------+-------------+------+------------+
    ```
4. 获取secret01密钥的元数据`openstack secret get $Secrethref`
    ```bash
    +---------------+------------------------------------------------------------------------+
    | Field         | Value                                                                  |
    +---------------+------------------------------------------------------------------------+
    | Secret href   | http://controller:9311/v1/secrets/1e821d32-94b0-4b13-b1f5-0530a02db037 |
    | Name          | secret01                                                               |
    | Created       | 2023-07-04T07:23:17+00:00                                              |
    | Status        | ACTIVE                                                                 |
    | Content types | {u'default': u'text/plain'}                                            |
    | Algorithm     | aes                                                                    |
    | Bit length    | 256                                                                    |
    | Secret type   | opaque                                                                 |
    | Mode          | cbc                                                                    |
    | Expiration    | None                                                                   |
    +---------------+------------------------------------------------------------------------+
    ```
5. 获取secret01密钥的数据`openstack secret get $Secrethref --payload`
    ```bash
    +---------+-----------+
    | Field   | Value     |
    +---------+-----------+
    | Payload | secretkey |
    +---------+-----------+
    ```
6. 使用openstack命令生成并存储密钥`openstack secret order create --name secret02 --algorithm aes --bit-length 256 --mode cbc --payload-content-type application/octet-stream key`
    ```bash
    +----------------+-----------------------------------------------------------------------+
    | Field          | Value                                                                 |
    +----------------+-----------------------------------------------------------------------+
    | Order href     | http://controller:9311/v1/orders/e0427665-312d-49d3-b2ba-b6c041793bc0 |
    | Type           | Key                                                                   |
    | Container href | N/A                                                                   |
    | Secret href    | None                                                                  |
    | Created        | None                                                                  |
    | Status         | None                                                                  |
    | Error code     | None                                                                  |
    | Error message  | None                                                                  |
    +----------------+-----------------------------------------------------------------------+
    ```
7. 通过命令显示生成的密钥列表`openstack secret order list`
    ```bash
    +-----------------------------------------------------------------------+------+----------------+------------------------------------------------------------------------+---------------------------+--------+------------+---------------+
    | Order href                                                            | Type | Container href | Secret href                                                            | Created                   | Status | Error code | Error message |
    +-----------------------------------------------------------------------+------+----------------+------------------------------------------------------------------------+---------------------------+--------+------------+---------------+
    | http://controller:9311/v1/orders/e0427665-312d-49d3-b2ba-b6c041793bc0 | Key  | N/A            | http://controller:9311/v1/secrets/81b762a7-9702-45b9-b673-04da4bd8da2e | 2023-07-04T07:27:55+00:00 | ACTIVE | None       | None          |
    +-----------------------------------------------------------------------+------+----------------+------------------------------------------------------------------------+---------------------------+--------+------------+---------------+
    ```
8. 使用命令显示生成的密钥`openstack secret order get $Orderhref`
    ```bash
    +----------------+------------------------------------------------------------------------+
    | Field          | Value                                                                  |
    +----------------+------------------------------------------------------------------------+
    | Order href     | http://controller:9311/v1/orders/e0427665-312d-49d3-b2ba-b6c041793bc0  |
    | Type           | Key                                                                    |
    | Container href | N/A                                                                    |
    | Secret href    | http://controller:9311/v1/secrets/81b762a7-9702-45b9-b673-04da4bd8da2e |
    | Created        | 2023-07-04T07:27:55+00:00                                              |
    | Status         | ACTIVE                                                                 |
    | Error code     | None                                                                   |
    | Error message  | None                                                                   |
    +----------------+------------------------------------------------------------------------+
    ```
9. 显示生成的密钥的元数据`openstack secret get $Secrethref`
    ```bash
    +---------------+------------------------------------------------------------------------+
    | Field         | Value                                                                  |
    +---------------+------------------------------------------------------------------------+
    | Secret href   | http://controller:9311/v1/secrets/81b762a7-9702-45b9-b673-04da4bd8da2e |
    | Name          | secret02                                                               |
    | Created       | 2023-07-04T07:27:55+00:00                                              |
    | Status        | ACTIVE                                                                 |
    | Content types | {u'default': u'application/octet-stream'}                              |
    | Algorithm     | aes                                                                    |
    | Bit length    | 256                                                                    |
    | Secret type   | symmetric                                                              |
    | Mode          | cbc                                                                    |
    | Expiration    | None                                                                   |
    +---------------+------------------------------------------------------------------------+
    ```
## VPNaaS安装使用

*？*

## OpenStack平台内存优化

> 搭建完OpenStack平台后，关闭系统的内存共享，打开透明大页。完成后提交控制节点的用户名、密码和IP地址到答题框。

1. 在控制节点关闭系统的内存共享，打开透明大页`echo 'never' >> /sys/kernel/mm/transparent_hugepage/defrag`
2. 检测`cat /sys/kernel/mm/transparent_hugepage/defrag`

## RabbitMQ的优化

1. 系统级别修改`vi /etc/sysctl.conf`最后一行添加`fs.file-max=10240`
2. 使配置生效`sysctl -p`
3. 用户级别修改`vi /etc/security/limits.conf`最后两行添加
    ```vim
    openstack  soft     nofile  10240
    openstack  hard     nofile  10240
    ```
4. 修改RabbitMQ配置`vi /usr/lib/systemd/system/rabbitmq-server.service`在[Service]下添加一行参数如下：
    ```vim
    LimitNOFILE=10240
    ```
5. 重启RabbitMQ服务`systemctl daemon-reload`、`systemctl restart rabbitmq-server`
6. 查看RabbitMQ的最大连接数`rabbitmqctl status`
    ```bash
    Status of node rabbit@openstack
    ...忽略输出...
    {file_descriptors,
        [{total_limit,10140},
        {total_used,53},
        {sockets_limit,9124},
        {sockets_used,51}]},
    ```

## 镜像多用户共享

1. 查看admin目前镜像`glance image-list`
    ```bash
    +--------------------------------------+--------------+
    | ID                                   | Name         |
    +--------------------------------------+--------------+
    | 73a19ede-d989-4a09-92db-7405aba6f11b | centos7-2009 |
    | 7796dc40-f07f-413f-8c07-2c968072743b | cirros       |
    +--------------------------------------+--------------+
    ```
2. 查看所有项目`openstack project list`、ID就是Member ID
    ```bash
    +----------------------------------+---------+
    | ID                               | Name    |
    +----------------------------------+---------+
    | 02eeea98cfaa4a779c6be9e3b0547a6c | CSCC001 |
    | 2f62b16c5ed74838a94f9b3057829335 | demo    |
    | c58e2e39ee1344c997360cbd42802c7e | admin   |
    | f66d210661234530944806dc33692908 | service |
    +----------------------------------+---------+
    ```
3. 共享目前admin所有的镜像`glance member-create $ImageID $MemberID`
    ```bash

    ```
4. 目前镜像还是pending状态，需要激活账号`glance member-update $ImageID $MemberID accepted`
    ```bash
    +--------------------------------------+----------------------------------+----------+
    | Image ID                             | Member ID                        | Status   |
    +--------------------------------------+----------------------------------+----------+
    | 89301c7e-b0ff-4f22-957c-37c6d8cb8029 | 02eeea98cfaa4a779c6be9e3b0547a6c | accepted |
    +--------------------------------------+----------------------------------+----------+
    ```
5. 然后那个项目里的用户就看得到共享的镜像了

## Linux系统句柄优化

1. 查看当前的句柄数`ulimit -n`->1024
2. 修改配置文件调整句柄限制为65535`echo "* soft nofile 65535"  >> /etc/security/limits.conf`、`echo "* hard nofile 65535"  >> /etc/security/limits.conf`
3. 重新登陆终端就可以查看到效果了

## OpenStack平台调度策略优化

1. 在控制节点，修改/etc/nova/nova.conf配置文件`vi /etc/nova/nova.conf`
2. 找到这一行`#vif_plugging_is_fatal=true`（95行），改为`vif_plugging_is_fatal=false`
3. 保存退出nova.conf，最后重启nova服务，也可以重启所有服务`openstack-service restart`

## OpenStack平台镜像优化

> 在使用打快照方式制作镜像后，镜像的大小会变得非常大，比如一个基础的CentOS镜像大小为400M左右，但是使用打快照方式制作的镜像大小会有1个G左右，具体的大小还要根据安装的东西来实际情况实际分析。

qemu-img命令中提供一个可用于镜像转换与压缩的选项，即qemu-img convert。接下来使用该命令，对已经打快照完成的镜像进行压缩操作。

1. 使用提供的镜像CentOS7.5-compress.qcow2，上传至controller节点的/root目录下，查看镜像的大小，命令如下：
    ```bash
    [root@controller ~]# du -sh CentOS7.5-compress.qcow2
    892M	CentOS7.5-compress.qcow2
    ```
    可以看到当前的镜像大小为892M，接下来使用命令，对镜像进行压缩，命令如下：
    ```bash
    [root@controller ~]# qemu-img convert -c -O qcow2 CentOS7.5-compress.qcow2 CentOS7.5-compress2.qcow2
    ```
> 该命令参数的解释如下：
> -c  压缩
> -O  qcow2 输出格式为 qcow2
> CentOS7.5-compress.qcow2   被压缩的文件
> CentOS7.5-compress2.qcow2  压缩完成后文件

等待一小段时间后，压缩完成，查看当前目录下CentOS7.5-compress2.qcow2镜像文件的大小，命令如下：

```bash
[root@controller ~]# du -sh CentOS7.5-compress2.qcow2
405M	CentOS7.5-compress2.qcow2
```
可以看到镜像大概被压缩到了一半的大小。使用qemu-img convert命令可以压缩qcow2镜像，在日常的工作中，经常会用到此命令进行镜像压缩。

## I/O优化

> IO调度的作用就是为了合并相近的IO请求，减少磁臂的移动损耗。

> I/O调度策略修改

1. 调度策略的修改是比较简单的，首先查看当前使用的调度算法，使用CRT工具连接到controller节点，查看调度算法`cat /sys/block/vda/queue/scheduler`->`[mq-deadline] kyber none`
2. 可以看到当前的I/O调度算法为mq-deadline，如果当前全是用的是SSD硬盘，那么显然none算法更合适，修改算法为none`echo none > /sys/block/vda/queue/scheduler`
3. 修改完之后，查看当前使用的算法`cat /sys/block/vda/queue/scheduler`->`[none] mq-deadline kyber`
4. 可以看到当前的I/O调度算法为none模式。

## 部署JumpServer

> 软件准备

1. `curl -O http://10.3.61.229/openstack/jumpserver.tar.gz`、`tar -zxvf jumpserver.tar.gz -C /opt/`
2. 安装python数据库`yum install python2 -y`
3. 安装配置docker环境
    ```bash
    cp -rf /opt/docker/* /usr/bin/
    chmod 775 /usr/bin/docker*
    cp -rf /opt/docker.service /etc/
    chmod 755 /etc/systemd/system/docker.
    systemctl daemon-reload
    systemctl enable docker --now
    ```
4. 验证服务状态`docker --version`、`docker-compose --version`

> 加载jumpserver服务组件镜像

1. 加载jumpserver服务组件镜像`cd /opt/images/`、`sh load.sh`
2. 创建jumpser服务组件目录`mkdir -p /opt/jumpserver/{core,koko,lion,mysql,nginx,redis}`、`cp -rf /opt/config /opt/jumpserver/`
3. 生效环境变量static.env，使用所提供的脚本up.sh启动jumpserver服务`cd /opt/compose/`、`source /opt/static.env`、`sh up.sh `
4. 浏览器访问`http://$IP`，账号密码admin/admin

## 部署Elasticsearch服务

1. 修改主机名`hostnamectl set-hostname node-1`
2. 将提供的elasticsearch-7.17.0-linux-x86_64.tar.gz软件包上传到此节点并解压到/opt目录，进入解压后的目录并创建data目录`tar -zxvf elasticsearch-7.17.0-linux-x86_64.tar.gz -C /opt`、`cd /opt/elasticsearch-7.17.0/`、`mkdir data`
3. 修改Elasticsearch配置，修改并添加如下几行内容`vi config/elasticsearch.yml`
    ```vim
    省略
    cluster.name: my-application
    node.name: node-1
    path.data: /opt/elasticsearch-7.17.0/data
    path.logs: /opt/elasticsearch-7.17.0/logs
    network.host: 0.0.0.0
    cluster.initial_master_nodes: ["node-1"]
    省略
    http.cors.enabled: true
    http.cors.allow-origin: "*"
    http.cors.allow-headers: Authorization,X-Requested-With,Content-Length,Content-Type
    ```
4. 创建Elasticsearch启动用户，并设置属组及权限`groupadd elsearch`、`useradd elsearch -g elsearch -p elasticsearch`、`chown -R elsearch:elsearch /opt/elasticsearch-7.17.0`
5. 修改资源限制及内核配置，添加如下内容`vi /etc/security/limits.conf`
    ```vim
    *   hard    nofile          65536
    *   soft    nofile          65536
    ```
6. `vi /etc/sysctl.conf`
    ```vim
    vm.max_map_count=262144
    ```
7. `sysctl -p`、`reboot`
8. 启动Elasticsearch服务`cd /opt/elasticsearch-7.17.0/`、`su elsearch`、`./bin/elasticsearch -d`*使用Ctrl+D来退出*
9. 查询端口，存在9200则成功启动`netstat -ntpl`
    ```bash
    Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
    tcp6       0      0 :::9200                 :::*                    LISTEN      1714/java           
    tcp6       0      0 :::9300                 :::*                    LISTEN      1714/java     
    ```
10. 使用浏览器访问IP:9200
```bash
{
  "name" : "node-1",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "xuBesDg2QM-E57SnSCr_rA",
  "version" : {
    "number" : "7.17.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "bee86328705acaa9a6daede7140defd4d9ec56bd",
    "build_date" : "2022-01-28T08:36:04.875279988Z",
    "build_snapshot" : false,
    "lucene_version" : "8.11.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 部署SkyWalking OAP服务

1. 使用提供的jdk-8u144-linux-x64.tar.gz软件包，上传jdk软件包，配置jdk
    ```bash
    [root@node-1 ~]# tar -zxvf jdk-8u144-linux-x64.tar.gz -C /usr/local/
    [root@node-1 ~]# vi /etc/profile
    # /etc/profile
    export JAVA_HOME=/usr/local/jdk1.8.0_144
    export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
    export PATH=$PATH:${JAVA_HOME}/bin
    …
    [root@node-1 ~]# source /etc/profile
    [root@node-1 ~]# java -version
    java version "1.8.0_144"
    Java(TM) SE Runtime Environment (build 1.8.0_144-b01)
    Java HotSpot(TM) 64-Bit Server VM (build 25.144-b01, mixed mode)
    ```
2. 上传apache-skywalking-apm-es7-8.0.0.tar.gz软件包至node-1节点上并加压到/opt目录下`tar -zxvf apache-skywalking-apm-es7-8.0.0.tar.gz -C /opt`
3. 进入解压后目录，修改OAP配置文件`cd /opt/apache-skywalking-apm-bin-es7/`、`vi config/application.yml`
```vim
#集群配置使用单机版
cluster:
  selector: ${SW_CLUSTER:standalone}
  standalone:
#数据库使用elasticsearch7
storage:
  selector: ${SW_STORAGE:elasticsearch7}
  elasticsearch7:
    nameSpace: ${SW_NAMESPACE:""}
    clusterNodes: ${SW_STORAGE_ES_CLUSTER_NODES:172.128.11.32:9200}
```
4. 启动OAP服务，查询端口，存在11800与12800则成功启动`./bin/oapService.sh `->**SkyWalking OAP started successfully!**、`netstat -ntpl`
```bash
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp6       0      0 :::12800                :::*                    LISTEN      1935/java         
tcp6       0      0 :::11800                :::*                    LISTEN      1935/java           
```

### 部署SkyWalking UI服务

1. 由于SkyWalking UI的默认地址是8080，与很多中间件可能存在冲突，修改一下`vi webapp/webapp.yml`
    ```vim
    server:
    port: 8888
    ```
2. 启动SkyWalking UI服务`./bin/webappService.sh `->**SkyWalking Web Application started successfully!**
3. 查看端口，存在8888则成功启动`netstat -ntpl`
    ```bash
    Active Internet connections (only servers)
    Proto Recv-Q Send-Q Local Address        Foreign Address     State       PID/Program name 
    tcp6       0      0 :::9300              :::*                LISTEN      2261/java       
    tcp6       0      0 :::8888              :::*                LISTEN      3133/java       
    tcp6       0      0 :::11800             :::*                LISTEN      2416/java       
    tcp6       0      0 :::12800             :::*                LISTEN      2416/java       
    tcp6       0      0 :::9200              :::*                LISTEN      2261/java
    ```
4. 使用浏览器访问IP:8888，此时访问页面无数据

### 搭建并启动应用商城服务，并配置SkyWalking Agent

> 配置主机名
1. 修改mall节点主机名`hostnamectl set-hostname mall`
2. 修改host文件`vi /etc/hosts`添加`10.3.61.213 mall`

> 配置yum源&基础服务安装

1. 将提供的gpmall包上传到服务器的/root目录下并解压gpmall.tar.gz，配置本地local.repo文件`mv /etc/yum.repos.d/* /media/`、`tar -zxvf gpmall-repo.tar.gz -C  /root/`、`vi /etc/yum.repos.d/local.repo`
    ```vim
    [mall]
    name=mall
    baseurl=file:///root/gpmall-repo
    gpgcheck=0
    enabled=1
    ```
2. 安装Java环境`yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel`
3. 安装Redis缓存服务`yum install redis -y`
4. 安装Nginx服务`yum install nginx -y`
5. 安装MariaDB数据库`yum install mariadb mariadb-server -y`

> ZooKeeper服务

1. 安装ZooKeeper服务，将提供的zookeeper-3.4.14.tar.gz上传至mall节点上`tar -zxvf zookeeper-3.4.14.tar.gz`
2. 进入到zookeeper-3.4.14/conf目录下，将zoo_sample.cfg文件重命名为zoo.cfg`cd zookeeper-3.4.14/conf/`、`mv zoo_sample.cfg zoo.cfg`
3. 进入到zookeeper-3.4.14/bin目录下，启动ZooKeeper服务
    ```bash
    [root@mall conf]# cd ../bin
    [root@mall bin]# ./zkServer.sh start
    ZooKeeper JMX enabled by default
    Using config: /root/zookeeper-3.4.14/bin/../conf/zoo.cfg
    Starting zookeeper ... STARTED
    ```
4.  查看ZooKeeper状态
    ```bash
    [root@mall bin]# ./zkServer.sh status
    ZooKeeper JMX enabled by default
    Using config: /root/zookeeper-3.4.14/bin/../conf/zoo.cfg
    Mode: standalone
    ```

> Kafka服务

1. 安装Kafka服务，将提供的kafka_2.11-1.1.1.tgz包上传到mall节点上，解压该压缩包
```bash
[root@mall bin]# cd
[root@mall ~]# tar -zxvf kafka_2.11-1.1.1.tgz
```
2. 进入到kafka_2.11-1.1.1/bin目录下，启动Kafka服务
```bash
[root@mall ~]# cd kafka_2.11-1.1.1/bin/
[root@mall bin]# ./kafka-server-start.sh -daemon ../config/server.properties
```
3. 使用jps或者netstat -ntpl命令查看Kafka是否成功启动
```bash
[root@mall ~]# netstat -ntpl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:6379            0.0.0.0:*               LISTEN      1291/redis-server * 
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      613/rpcbind         
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2152/nginx: master  
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1296/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1277/master         
tcp6       0      0 :::33760                :::*                    LISTEN      1706/java           
tcp6       0      0 :::9092                 :::*                    LISTEN      2025/java           
tcp6       0      0 :::2181                 :::*                    LISTEN      1706/java           
tcp6       0      0 :::3306                 :::*                    LISTEN      1154/mysqld         
tcp6       0      0 :::6379                 :::*                    LISTEN      1291/redis-server * 
tcp6       0      0 :::36300                :::*                    LISTEN      2025/java           
tcp6       0      0 :::111                  :::*                    LISTEN      613/rpcbind         
tcp6       0      0 :::20880                :::*                    LISTEN      2223/java           
tcp6       0      0 :::80                   :::*                    LISTEN      2152/nginx: master  
tcp6       0      0 :::8081                 :::*                    LISTEN      2257/java           
tcp6       0      0 :::20881                :::*                    LISTEN      2164/java           
tcp6       0      0 :::8082                 :::*                    LISTEN      2290/java           
tcp6       0      0 :::22                   :::*                    LISTEN      1296/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      1277/master         
```
**运行结果查看到Kafka服务和9092端口，说明Kafka服务已启动**

### 启动服务

> 启动数据库并配置
> 修改数据库配置文件并启动MariaDB数据库，设置root用户密码为123456，并创建gpmall数据库，将提供的gpmall.sql导入

1. 修改/etc/my.cnf文件，添加字段如下
```bash
[root@mall bin]# cd
[root@mall ~]# vi /etc/my.cnf
[mysqld]
!includedir /etc/my.cnf.d
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
```
2. 启动数据库`systemctl start mariadb`
3. 设置root用户的密码为123456并登录
```bash
[root@mall ~]# mysqladmin -uroot password 123456
[root@mall ~]# mysql -uroot -p123456
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 5.5.68-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
```bash
4. 设置root用户的权限
```mysql
MariaDB [(none)]> grant all privileges on *.* to root@localhost identified by '123456' with grant option;
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> grant all privileges on *.* to root@"%" identified by '123456' with grant option;
Query OK, 0 rows affected (0.001 sec)
```
5. 将gpmall.sql文件上传至云主机的/root目录下。创建数据库gpmall并导入gpmall.sql文件
```bash
MariaDB [(none)]> create database gpmall;
Query OK, 1 row affected (0.00 sec)
MariaDB [(none)]> use gpmall;
MariaDB [gpmall]> source /root/gpmall/gpmall.sql
```
6. 退出数据库并设置开机自启`Ctrl+c`、`systemctl enable mariadb`

> 启动Redis服务

1. 修改Redis配置文件，编辑/etc/redis.conf文件,将bind 127.0.0.1这一行注释掉；将protected-mode yes 改为 protected-mode no
```bash
[root@mall ~]# vi /etc/redis.conf
#bind 127.0.0.1
protected-mode no

[root@mall ~]# systemctl start redis
[root@mall ~]# systemctl enable redis
Created symlink from /etc/systemd/system/multi-user.target.wants/redis.service to /usr/lib/systemd/system/redis.service.
```

> 启动Nginx服务

启动Nginx服务命令
```bash
[root@mall ~]# systemctl start nginx
[root@mall ~]# systemctl enable nginx
Created symlink from /etc/systemd/system/multi-user.target.wants/nginx.service to /usr/lib/systemd/system/nginx.service.
```

### 应用系统部署

> 使用提供gpmall-shopping-0.0.1-SNAPSHOT.jar、gpmall-user-0.0.1-SNAPSHOT.jar、shopping-provider-0.0.1-SNAPSHOT.jar、user-provider-0.0.1-SNAPSHOT.jar 、dist这5个包部署应用系统，其中4个jar包为后端服务包，dist为前端包。（包在gpmall目录下）

> 全局变量配置

修改/etc/hosts文件，修改项目全局配置文件如下（原有的172.128.11.42 mall映射删除）：
```bash
[root@mall ~]# cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
172.128.11.42 kafka.mall
172.128.11.42 mysql.mall
172.128.11.42 redis.mall
172.128.11.42 zookeeper.mall
```

> 部署前端

1. 清空默认项目路径下的文件，将dist目录下的文件，复制到Nginx默认项目路径（文件在gpmall目录下）
```bash
[root@mall ~]# rm -rf /usr/share/nginx/html/*
[root@mall ~]# cp -rvf gpmall/dist/* /usr/share/nginx/html/
```
2. 修改Nginx配置文件/etc/nginx/nginx.conf，添加映射如下所示：
**加上">"后的字段就可以**
```vim
[root@mall ~]# vi /etc/nginx/nginx.conf
    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;
         
        >location / {
        >root   /usr/share/nginx/html;
        >index  index.html index.htm;
        >}
        >location /user {
        >    proxy_pass http://127.0.0.1:8082;
        >}

        >location /shopping {
        >    proxy_pass http://127.0.0.1:8081;
        >}

        >location /cashier {
        >    proxy_pass http://127.0.0.1:8083;
        >}

        >error_page 404 /404.html;
    }
```
3. 重启Nginx服务`systemctl restart nginx`

> 部署后端

1. 将node-1节点的/opt/apache-skywalking-apm-bin-es7目录下的agent目录复制到mall节点下`scp -r $NODE_1_IP:/opt/apache-skywalking-apm-bin-es7/agent  /root`，$NODE_1_IP修改为node-1节点IP
2. 修改SkyWalking agent配置文件（$MALL_IP替换为mall节点IP）
```bash
[root@mall ~]# vi agent/config/agent.config
…
agent.service_name=${SW_AGENT_NAME:my-application}
agent.sample_n_per_3_secs=${SW_AGENT_SAMPLE:1}
…
collector.backend_service=${SW_AGENT_COLLECTOR_BACKEND_SERVICES:$MALL_IP:11800}
…
```
3. 将提供的4个jar包上传到服务器的/root目录下，放置探针并启动，通过设置启动参数的方式检测系统
```bash
[root@mall ~]# nohup java -javaagent:/root/agent/skywalking-agent.jar  -jar gpmall/shopping-provider-0.0.1-SNAPSHOT.jar &
[1] 20086
[root@mall ~]# nohup: ignoring input and appending output to ‘nohup.out’

[root@mall ~]# nohup java -javaagent:/root/agent/skywalking-agent.jar  -jar gpmall/user-provider-0.0.1-SNAPSHOT.jar &
[2] 20132
[root@mall ~]# nohup: ignoring input and appending output to ‘nohup.out’

[root@mall ~]# nohup java -javaagent:/root/agent/skywalking-agent.jar  -jar gpmall/gpmall-shopping-0.0.1-SNAPSHOT.jar &
[3] 20177
[root@mall ~]# nohup: ignoring input and appending output to ‘nohup.out’

[root@mall ~]# nohup java -javaagent:/root/agent/skywalking-agent.jar  -jar gpmall/gpmall-user-0.0.1-SNAPSHOT.jar &
[4] 20281
[root@mall ~]# nohup: ignoring input and appending output to ‘nohup.out’
# httpd访问网络配置
[root@mall ~]# setsebool -P httpd_can_network_connect 1
```
*按照顺序运行4个jar包后，至此后端服务部署完毕。*

> 网站访问

打开浏览器，在地址栏中输入http://$MALL_IP

## 部署ELK服务

### 基础环境配置

> 三台主机修改主机名

**elk-1节点：**
```bash
[root@lqhelk-1 ~]# hostnamectl set-hostname elk-1
[root@lqhelk-1 ~]# bash 
[root@elk-1 ~]# hostnamectl 
   Static hostname: elk-1
         Icon name: computer-vm
           Chassis: vm
        Machine ID: cc2c86fe566741e6a2ff6d399c5d5daa
           Boot ID: 4786f596058f424db58406c8c1b9c635
    Virtualization: kvm
  Operating System: CentOS Linux 7 (Core)
       CPE OS Name: cpe:/o:centos:centos:7
            Kernel: Linux 3.10.0-1160.el7.x86_64
      Architecture: x86-64
```
**elk-2节点：**
```bash
[root@lqhelk-2 ~]# hostnamectl  set-hostname elk-2
[root@elk-2 ~]# hostnamectl  
   Static hostname: elk-2
         Icon name: computer-vm
           Chassis: vm
        Machine ID: cc2c86fe566741e6a2ff6d399c5d5daa
           Boot ID: 17e276b0811d4a01907ab8424a16a072
    Virtualization: kvm
  Operating System: CentOS Linux 7 (Core)
       CPE OS Name: cpe:/o:centos:centos:7
            Kernel: Linux 3.10.0-1160.el7.x86_64
      Architecture: x86-64
```
**elk-3节点：**
```bash
[root@lqhelk-3 ~]# hostnamectl  set-hostname elk-3
[root@lqhelk-3 ~]# bash 
[root@elk-3 ~]# hostnamectl  
   Static hostname: elk-3
         Icon name: computer-vm
           Chassis: vm
        Machine ID: cc2c86fe566741e6a2ff6d399c5d5daa
           Boot ID: 07d416916e744daa8a96163a93fcf34a
    Virtualization: kvm
  Operating System: CentOS Linux 7 (Core)
       CPE OS Name: cpe:/o:centos:centos:7
            Kernel: Linux 3.10.0-1160.el7.x86_64
      Architecture: x86-64
```

> 三台主机配置主机名映射（以第一台节点为例，三个节点都要配置）

```bash
[root@elk-1 ~]# vi /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
172.128.11.10 elk-1
172.128.11.17 elk-2
172.128.11.11 elk-3
```

> 三台主机安装JDK环境（以第一台节点为例）

```bash
[root@elk-1 ~]# mv /etc/yum.repos.d/* /media/
[root@elk-1 ~]# mkdir  /opt/centos-2009
[root@elk-1 ~]# vi /etc/yum.repos.d/local.repo
[centos]
name=centos
baseurl=file:///opt/centos-2009
gpgcheck=0
enabled=1
[root@elk-1 ~]# mount CentOS-7-x86_64-DVD-2009.iso  /mnt/
mount: /dev/loop0 is write-protected, mounting read-only
[root@elk-1 ~]# cp -rvf /mnt/* /opt/centos-2009
[root@elk-1 ~]# umount /mnt/
[root@elk-1 ~]# yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel
......
Installed:
  java-1.8.0-openjdk.x86_64 1:1.8.0.262.b10-1.el7                 java-1.8.0-openjdk-devel.x86_64 1:1.8.0.262.b10-1.el7                

Dependency Installed:
  alsa-lib.x86_64 0:1.1.8-1.el7                                 atk.x86_64 0:2.28.1-2.el7                                              
  avahi-libs.x86_64 0:0.6.31-20.el7                             cairo.x86_64 0:1.15.12-4.el

Complete!
[root@elk-1 ~]# java -version
openjdk version "1.8.0_262"
OpenJDK Runtime Environment (build 1.8.0_262-b10)
OpenJDK 64-Bit Server VM (build 25.262-b10, mixed mode)
```

### 部署Elasticsearch

> 三台主机安装Elasticserach（以第一台主机为例）

将提供的elasticsearch-6.0.0.rpm包分别上传至三台主机的/root目录下，并使用命令进行安装。
```bash
[root@elk-1 ~]# ll
total 27332
-rw-------. 1 root root     6880 Oct 30  2020 anaconda-ks.cfg
-rw-r--r--. 1 root root 27970243 Nov 27 02:52 elasticsearch-6.
0.0.rpm
-rw-------. 1 root root     6587 Oct 30  2020 original-ks.cfg
[root@elk-1 ~]# rpm -ivh elasticsearch-6.0.0.rpm 
warning: elasticsearch-6.0.0.rpm: Header V4 RSA/SHA512 Signature, key ID d88e42b4: NOKEY
Preparing...                          ################################# [100%]
Creating elasticsearch group... OK
Creating elasticsearch user... OK
Updating / installing...
   1:elasticsearch-0:6.0.0-1          ################################# [100%]
### NOT starting on installation, please execute the following statements to configure elasticsearch service to start automatically using systemd
 sudo systemctl daemon-reload
 sudo systemctl enable elasticsearch.service
### You can start elasticsearch service by executing
 sudo systemctl start elasticsearch.service
```
> 三台主机分别配置Elasticserach
> 配置elasticsearch的配置文件，配置文件在/etc/elasticsearch/elasticsearch.yml。

**elk-1节点：**
```bash
[root@elk-1 ~]# vi /etc/elasticsearch/elasticsearch.yml
# ---------------------------------- Cluster -----------------------------------
#
# Use a descriptive name for your cluster:
#
cluster.name: ELK          //取消注释，配置elasticsearch集群名称
#
# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
node.name: elk-1         //配置节点名，默认随机指定一个name列表中名字，该列表在Elasticserach的jar包中config文件夹里name.txt文件中
node.master: true        //添加指定该节点是否有资格被选举成为node
node.data: false      //指定该节点是否有资格被选举成为node，Elasticserach是默认集群中的第一台机器为master，如果这台机挂了就会重新选举master，其他两节点为false。
# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
path.data: /var/lib/elasticsearch        //配置索引数据存储位置(保持默认,不要开启注释)。
#
# Path to log files:
#
path.logs: /var/log/elasticsearch      //设置日志文件的存储路径，默认是Elasticserach根目录下的logs文件夹。
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
network.host: 172.128.11.10    //设置绑定的ip地址，可以是ipv4或ipv6的，默认为0.0.0.0。
#
# Set a custom port for HTTP:
#
http.port: 9200           //启动的Elasticserach对外访问的http端口，默认9200
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when new node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
#discovery.zen.ping.unicast.hosts: ["host1", "host2"]
discovery.zen.ping.unicast.hosts: ["elk-1","elk-2","elk-3"]   //设置集群中master节点的初始列表，可以通过这些节点来自动发现新加入集群的节点。
```
**elk-2节点（参数说明不再详细写出）：**
```bash
[root@elk-2 ~]# vi /etc/elasticsearch/elasticsearch.yml
# ---------------------------------- Cluster -----------------------------------
#
# Use a descriptive name for your cluster:
#
cluster.name: ELK
#
# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
node.name: elk-2
node.master: false
node.data: true
# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
path.data: /var/lib/elasticsearch
#
# Path to log files:
#
path.logs: /var/log/elasticsearch。
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
network.host: 172.128.11.17
#
# Set a custom port for HTTP:
#
http.port: 9200
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when new node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
#discovery.zen.ping.unicast.hosts: ["host1", "host2"]
discovery.zen.ping.unicast.hosts: ["elk-1","elk-2","elk-3"]
```
**elk-3节点（参数说明不再详细写出）：**
```bash
[root@elk-3 ~]# vi /etc/elasticsearch/elasticsearch.yml
# ---------------------------------- Cluster -----------------------------------
#
# Use a descriptive name for your cluster:
#
cluster.name: ELK
#
# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
node.name: elk-3
node.master: false
node.data: true
# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
path.data: /var/lib/elasticsearch
#
# Path to log files:
#
path.logs: /var/log/elasticsearch。
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
network.host: 172.128.11.11
#
# Set a custom port for HTTP:
#
http.port: 9200
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when new node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
#discovery.zen.ping.unicast.hosts: ["host1", "host2"]
discovery.zen.ping.unicast.hosts: ["elk-1","elk-2","elk-3"]
```
> 三台主机启动服务（以第一台节点为例）
> 使用命令启动服务，并设置开机自启，最后使用命令查看进行及端口号。

```bash
[root@elk-1 ~]# systemctl start elasticsearch
[root@elk-1 ~]# systemctl  enable elasticsearch
Created symlink from /etc/systemd/system/multi-user.target.wants/elasticsearch.service to /usr/lib/systemd/system/elasticsearch.service.
[root@elk-1 ~]# ps -ef |grep elasticsearch
elastic+ 15943     1 90 07:46 ?        00:00:11 /bin/java -Xms1g -Xmx1g -XX:+UseConcMarkSweepGC -XX:CMSInitiatingOccupancyFraction=75 -XX:+UseCMSInitiatingOccupancyOnly -XX:+AlwaysPreTouch -server -Xss1m -Djava.awt.headless=true -Dfile.encoding=UTF-8 -Djna.nosys=true -XX:-OmitStackTraceInFastThrow -Dio.netty.noUnsafe=true -Dio.netty.noKeySetOptimization=true -Dio.netty.recycler.maxCapacityPerThread=0 -Dlog4j.shutdownHookEnabled=false -Dlog4j2.disable.jmx=true -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/lib/elasticsearch -Des.path.home=/usr/share/elasticsearch -Des.path.conf=/etc/elasticsearch -cp /usr/share/elasticsearch/lib/* org.elasticsearch.bootstrap.Elasticsearch -p /var/run/elasticsearch/elasticsearch.pid --quiet
root     16023 15676  0 07:47 pts/0    00:00:00 grep --color=auto elasticsearch
[root@elk-1 ~]# netstat -ntpl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address          Foreign Address     State     PID/Program name 
tcp        0      0 0.0.0.0:22              0.0.0.0:*          LISTEN      1268/sshd     
tcp        0      0 127.0.0.1:25            0.0.0.0:*          LISTEN      1139/master   
tcp        0      0 0.0.0.0:111             0.0.0.0:*          LISTEN      565/rpcbind   
tcp6       0      0 172.128.11.10:9300      :::*               LISTEN      15943/java     
tcp6       0      0 :::22                   :::*               LISTEN      1268/sshd     
tcp6       0      0 ::1:25                  :::*               LISTEN      1139/master   
tcp6       0      0 :::111                  :::*               LISTEN      565/rpcbind   
tcp6       0      0 172.128.11.10:9200      :::*               LISTEN      15943/java
```
**三台主机如果有进程存在或者能够发现9200和9300端口暴露则服务启动成功**

> 检查集群状态

**elk-1节点：**
```bash
[root@elk-1 ~]#  curl '172.128.11.10:9200/_cluster/health?pretty'
{
  "cluster_name" : "ELK",   //集群名称
  "status" : "green",   //集群健康状态，green为健康，yellow或者red则是集群有问题
  "timed_out" : false   //是否超时,
  "number_of_nodes" : 3,   //集群中节点数
  "number_of_data_nodes" : 2,   //集群中data节点数量
  "active_primary_shards" : 0,
  "active_shards" : 0,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 0,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 100.0
}
```

### 部署Kibana

> 第一台主机安装kibana
> 将提供的kibana-6.0.0-x86_64.rpm包上传至第一台主机的/root目录下，其他主机无需上传，并使用命令进行安装。

```bash
[root@elk-1 ~]# rpm -ivh kibana-6.0.0-x86_64.rpm 
warning: kibana-6.0.0-x86_64.rpm: Header V4 RSA/SHA512 Signature, key ID d88e42b4: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:kibana-6.0.0-1                   ################################# [100%]
```

> 配置Kibana
> 配置kibana的配置文件，配置文件在/etc/kibana/kibana.yml，在配置文件增加或修改以下内容：

```bash
[root@elk-1 ~]# cat /etc/kibana/kibana.yml |grep -v ^#
server.port: 5601              
server.host: 172.128.11.10      
elasticsearch.url: "http://172.128.11.10:9200"
```

> 启动Kibana

```bash
[root@elk-1 ~]# systemctl  start kibana
[root@elk-1 ~]# systemctl  enable  kibana
Created symlink from /etc/systemd/system/multi-user.target.wants/kibana.service to /etc/systemd/system/kibana.service.
[root@elk-1 ~]# ps -ef |grep kibana
kibana   16141     1  9 08:26 ?        00:00:03 /usr/share/kibana/bin/../node/bin/node --no-warnings /usr/share/kibana/bin/../src/cli -c /etc/kibana/kibana.yml
root     16192 15676  0 08:27 pts/0    00:00:00 grep --color=auto kibana
[root@elk-1 ~]# netstat  -ntpl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address         Foreign Address     State      PID/Program name 
tcp        0      0 0.0.0.0:22            0.0.0.0:*           LISTEN      1268/sshd       
tcp        0      0 127.0.0.1:25          0.0.0.0:*           LISTEN      1139/master     
tcp        0      0 172.128.11.10:5601    0.0.0.0:*           LISTEN      16141/node     
tcp        0      0 0.0.0.0:111           0.0.0.0:*           LISTEN      565/rpcbind     
tcp6       0      0 172.128.11.10:9300    :::*                LISTEN      15943/java     
tcp6       0      0 :::22                 :::*                LISTEN      1268/sshd       
tcp6       0      0 ::1:25                :::*                LISTEN      1139/master     
tcp6       0      0 :::111                :::*                LISTEN      565/rpcbind     
tcp6       0      0 172.128.11.10:9200    :::*                LISTEN      15943/java 
```
**启动后如果有进程或者能够发现5601端口暴露则服务启动成功，并可以通过浏览器访问地址http://172.128.11.10:5601/，能够看到如图1所示页面。**

### 部署Logstash

> 安装Logstash
> 将提供的logstash-6.0.0.rpm包上传到第二台主机的/root目录下，其他主机无需上传，并使用命令进行安装。

```bash
[root@elk-2 ~]# ll
total 137968
-rw-------. 1 root root      6880 Oct 30  2020 anaconda-ks.cfg
-rw-r--r--. 1 root root  27970243 Feb 10 07:06 elasticsearch-6.0.0.rpm
-rw-r--r--. 1 root root 113288712 Feb 10 08:49 logstash-6.0.0.rpm
-rw-------. 1 root root      6587 Oct 30  2020 original-ks.cfg
[root@elk-2 ~]# rpm -ivh logstash-6.0.0.rpm 
warning: logstash-6.0.0.rpm: Header V4 RSA/SHA512 Signature, key ID d88e42b4: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:logstash-1:6.0.0-1               ################################# [100%]
Using provided startup.options file: /etc/logstash/startup.options
Successfully created system startup script for Logstash
```

> 配置Logstash
> 配置/etc/logstash/logstash.yml，修改增加第190行如下：

```bash
[root@elk-2 ~]# vi /etc/logstash/logstash.yml
http.host: "172.128.11.17"   //第二台主机名称
```

> 配置logstash收集syslog日志：

```bash
[root@elk-2 ~]# vi /etc/logstash/conf.d/syslog.conf
input {
    file {
        path => "/var/log/messages"
        type => "systemlog"
        start_position => "beginning"
        stat_interval => "3"
    }
}
output {
    if [type] == "systemlog" {
        elasticsearch {
            hosts => ["172.128.11.10:9200"]    //这里的地址为第一台主机地址（注释必须删掉）
            index => "system-log-%{+YYYY.MM.dd}"
        }
    }
}
```
> 检测配置文件是否错误：

```bash
[root@elk-2 ~]# chmod  644 /var/log/messages    //给这个文件赋权限，如果不给权限，则无法读取日志
[root@elk-2 ~]# ln -s /usr/share/logstash/bin/logstash /usr/bin
[root@elk-2 ~]# logstash --path.settings /etc/logstash/ -f /etc/logstash/conf.d/syslog.conf --config.test_and_exit
Sending Logstash's logs to /var/log/logstash which is now configured via log4j2.properties
Configuration OK      //结果显示OK则证明没问题
```

> 启动Logstash

```bash
[root@elk-2 ~]# systemctl start logstash
[root@elk-2 ~]# ps -ef |grep logstash
logstash 17891     1 99 09:06 ?        00:00:18 /bin/java -XX:+UseParNewGC -XX:+UseConcMarkSweepGC -XX:CMSInitiatingOccupancyFraction=75 -XX:+UseCMSInitiatingOccupancyOnly -XX:+DisableExplicitGC -Djava.awt.headless=true -Dfile.encoding=UTF-8 -XX:+HeapDumpOnOutOfMemoryError -Xmx1g -Xms256m -Xss2048k -Djffi.boot.library.path=/usr/share/logstash/vendor/jruby/lib/jni -Xbootclasspath/a:/usr/share/logstash/vendor/jruby/lib/jruby.jar -classpath : -Djruby.home=/usr/share/logstash/vendor/jruby -Djruby.lib=/usr/share/logstash/vendor/jruby/lib -Djruby.script=jruby -Djruby.shell=/bin/sh org.jruby.Main /usr/share/logstash/lib/bootstrap/environment.rb logstash/runner.rb --path.settings /etc/logstash
root     17927 15677  0 09:06 pts/0    00:00:00 grep --color=auto logstash
[root@elk-2 ~]# netstat -lnpt
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address         Foreign Address      State     PID/Program name 
tcp        0      0 0.0.0.0:22            0.0.0.0:*            LISTEN      1273/sshd     
tcp        0      0 127.0.0.1:25          0.0.0.0:*            LISTEN      1084/master   
tcp        0      0 0.0.0.0:111           0.0.0.0:*            LISTEN      580/rpcbind   
tcp6       0      0 172.128.11.17:9200    :::*                 LISTEN      15918/java     
tcp6       0      0 172.128.11.17:9300    :::*                 LISTEN      15918/java     
tcp6       0      0 :::22                 :::*                 LISTEN      1273/sshd     
tcp6       0      0 ::1:25                :::*                 LISTEN      1084/master   
tcp6       0      0 :::111                :::*                 LISTEN      580/rpcbind 
```
> 如果启动服务后，有进程但是没有9600端口，是因为权限问题，之前我们以root的身份在终端启动过logstash，所以产生的相关文件的属组属主都是root，解决方法如下：

```bash
[root@elk-2 ~]# ll /var/lib/logstash/
total 0
drwxr-xr-x. 2 root root 6 Feb 10 09:00 dead_letter_queue
drwxr-xr-x. 2 root root 6 Feb 10 09:00 queue
[root@elk-2 ~]# chown -R logstash /var/lib/logstash/
[root@elk-2 ~]# ll /var/lib/logstash/
total 0
drwxr-xr-x. 2 logstash root 6 Feb 10 09:00 dead_letter_queue
drwxr-xr-x. 2 logstash root 6 Feb 10 09:00 queue
[root@elk-2 ~]# systemctl restart logstash
[root@elk-2 ~]# netstat -lnpt
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address          Foreign Address     State     PID/Program name 
tcp        0      0 0.0.0.0:22             0.0.0.0:*           LISTEN     1273/sshd       
tcp        0      0 127.0.0.1:25           0.0.0.0:*           LISTEN     1084/master     
tcp        0      0 0.0.0.0:111            0.0.0.0:*           LISTEN     580/rpcbind     
tcp6       0      0 172.128.11.17:9200     :::*                LISTEN     15918/java     
tcp6       0      0 172.128.11.17:9300     :::*                LISTEN     15918/java     
tcp6       0      0 :::22                  :::*                LISTEN     1273/sshd       
tcp6       0      0 ::1:25                 :::*                LISTEN     1084/master     
tcp6       0      0 172.128.11.17:9600     :::*                LISTEN     18724/java     
tcp6       0      0 :::111                 :::*                LISTEN     580/rpcbind
```
> 启动完毕后，让syslog产生日志，用第三台主机登录elk-2机器，登录后退出。

```bash
[root@elk-3 ~]# ssh elk-2
The authenticity of host 'elk-2 (172.128.11.17)' can't be established.
ECDSA key fingerprint is SHA256:nJT1L6Cz5MvNxC/ib2Rk+WN6Q/a3E3yi/67VwVOjt5k.
ECDSA key fingerprint is MD5:10:0c:b0:88:e6:03:76:cb:53:0b:ea:97:5e:b7:8f:10.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'elk-2,172.128.11.17' (ECDSA) to the list of known hosts.
root@elk-2's password: 
Last login: Thu Feb 10 01:34:28 2022 from 192.168.0.112
[root@elk-2 ~]# 
[root@elk-2 ~]# logout
Connection to elk-2 closed.
```

### Kibana检索日志

> Kibana上查看日志
> 之前部署kibana完成后，还没有检索日志。现在logstash部署完成，我们回到第一台主机上查看日志索引，执行命令如下：

```bash
[root@elk-1 ~]# curl '172.128.11.17:9200/_cat/indices?v'
health status index                 uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   system-log-2022.02.10 E6kpwHcdRmy8iO42S3zlTg   5   1      20933            0      7.9mb          3.9mb
green  open   .kibana               OdfKD6JFTx-pPwfJNZtpLA   1   1          1            0      7.3kb          3.6kb
```

> 获取\删除指定索引详细信息：

```bash
[root@elk-1 ~]# curl -XGET/DELETE '172.128.11.17:9200/system-log-2022.02.10?pretty'    //此处的system-log-2022.02.10是上面步骤查看出的日志索引名称
{
  "system-log-2022.02.10" : {
    "aliases" : { },
    "mappings" : {
      "systemlog" : {
        "properties" : {
          "@timestamp" : {
            "type" : "date"
          },
          "@version" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "host" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "message" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "path" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "type" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          }
        }
      }
    },
    "settings" : {
      "index" : {
        "creation_date" : "1644484128903",
        "number_of_shards" : "5",
        "number_of_replicas" : "1",
        "uuid" : "E6kpwHcdRmy8iO42S3zlTg",
        "version" : {
          "created" : "6000099"
        },
        "provided_name" : "system-log-2022.02.10"
      }
    }
  }
}
```

### Web页面配置

1. 浏览器访问172.128.11.10:5601，到kibana上配置，索引的目录为:system-log-2022.02.10，修改完成后点击“Create”按钮（含有Configure an index pattern的页面，下面填之前出现的log索引）
2. 配置完成后，点击左上角的“Discover”，进入“Discover”页面后如果出现以下提示，则是代表无法查找到日志信息（含有柱状图和列表的样子就是正常的，如果显示“No result found”这种情况一般是时间的问题，可以点击右上角切换成查看当天的日志信息）
3. 更改完成后，可以看到，Kibana服务已经成功检索主机的日志信息，并反馈在页面。

## Python调用OpenStack API

### Python开发环境准备

1. `yum install python3`
2. `python -version`
3. `wget -c -r -np -k -L -p http://10.3.61.229/openstack/Python-api/`

### 通过RESTful编写Python运维

1. 登录OpenStack平台，可以查看APIs的网站与端口`openstack endpoint list -c "Service Name"  -c "Enabled"  -c "URL"`
```bash
+--------------+---------+-----------------------------------------------+
| Service Name | Enabled | URL                                           |
+--------------+---------+-----------------------------------------------+
| cinderv3     | True    | http://controller:8776/v3/%(project_id)s      |
| cinderv2     | True    | http://controller:8776/v2/%(project_id)s      |
| cinderv2     | True    | http://controller:8776/v2/%(project_id)s      |
| barbican     | True    | http://controller:9311                        |
| nova         | True    | http://controller:8774/v2.1                   |
| keystone     | True    | http://controller:5000/v3/                    |
| neutron      | True    | http://controller:9696                        |
| swift        | True    | http://controller:8080/v1/AUTH_%(project_id)s |
| keystone     | True    | http://controller:5000/v3/                    |
| cloudkitty   | True    | http://controller:8889                        |
| swift        | True    | http://controller:8080/v1                     |
| cloudkitty   | True    | http://controller:8889                        |
| barbican     | True    | http://controller:9311                        |
| manilav2     | True    | http://controller:8786/v2/%(tenant_id)s       |
| keystone     | True    | http://controller:5000/v3/                    |
| swift        | True    | http://controller:8080/v1/AUTH_%(project_id)s |
| placement    | True    | http://controller:8778                        |
| cinderv2     | True    | http://controller:8776/v2/%(project_id)s      |
| placement    | True    | http://controller:8778                        |
| manilav2     | True    | http://controller:8786/v2/%(tenant_id)s       |
| manila       | True    | http://controller:8786/v1/%(tenant_id)s       |
| cinderv3     | True    | http://controller:8776/v3/%(project_id)s      |
| cinderv3     | True    | http://controller:8776/v3/%(project_id)s      |
| nova         | True    | http://controller:8774/v2.1                   |
| glance       | True    | http://controller:9292                        |
| glance       | True    | http://controller:9292                        |
| manilav2     | True    | http://controller:8786/v2/%(tenant_id)s       |
| nova         | True    | http://controller:8774/v2.1                   |
| placement    | True    | http://controller:8778                        |
| neutron      | True    | http://controller:9696                        |
| barbican     | True    | http://controller:9311                        |
| manila       | True    | http://controller:8786/v1/%(tenant_id)s       |
| cloudkitty   | True    | http://controller:8889                        |
| glance       | True    | http://controller:9292                        |
| manila       | True    | http://controller:8786/v1/%(tenant_id)s       |
| neutron      | True    | http://controller:9696                        |
+--------------+---------+-----------------------------------------------+
```

#### 认证服务：用户管理

1. 接口说明
   接口官网：https://docs.openstack.org/api-ref/identity/。
当前版本为V3.0.网站为：https://docs.openstack.org/api-ref/identity/v3/index.html
Identity服务生成访问OpenStack服务REST API的认证令牌。客户端通过向身份验证服务提供有效凭据来获取此令牌（Token）和其他服务API的URL端点。
每次向OpenStack服务请求REST API时，都需要在X-Auth-Token请求头中提供自己的认证令牌（Token）。
和大多数OpenStack项目一样，OpenStack Identity通过基于角色访问控制（RBAC）的方法定义策略规则来保护API。
Identity服务配置文件设置存储这些规则的JSON策略文件的名称和位置。
V3 API为所有GET请求实现了HEAD。 每个HEAD请求包含与对应的GET API相同的报头和HTTP状态代码。
以下以用户管理的Python实现案例，展示如何调用认证服务的APIs。具体APIs参考如下地址（如图2所示）：
https://docs.openstack.org/api-ref/identity/v3/index.html#users

> 以下展示User增删查改的管理Python实现代码。
> 创建用户接口：POST /v3/users
> 请求参数见表：

| Name | In      |Type|Description|
|:--------:|:--------:|:--------:|:--------:|
|user|body|object|用户|
|default_project_id(Optional)|body|string|项目ID|
|domain_id(Optional)|body|string|区域ID|
|federated(Optional)|	body|	list|	用户联邦列表|
|enabled(Optional)|	body|	boolean|	是否启用|
|name|	body|	string|	用户名称|
|password(Optional)|	body|	string|	密码|
|extra(Optional)|	body|	string|	额外信息|
|options(Optional)|	body|	object|	选项|

> 创建用户body json案例如下：
```vim
{  
    "user": {  
        "default_project_id": "263fd9",  
        "domain_id": "1789d1",  
        "enabled": true,  
        "federated": [  
            {  
                "idp_id": "efbab5a6acad4d108fec6c63d9609d83",  
                "protocols": [  
                    {  
                        "protocol_id": "mapped",  
                        "unique_id": "test@example.com"  
                    }  
                ]  
            }  
        ],  
        "name": "James Doe",  
        "password": "secretsecret",  
        "description": "James Doe user",  
        "email": "jdoe@example.com",  
        "options": {  
            "ignore_password_expiry": true  
        }  
    }  
}  
```
其他接口参数基本一致，可以查看每个接口的request与response的数据格式。
> 详细代码见网页

## Redis集群部署与优化

1. 哨兵模式概述

在说哨兵之前，先说下主从复制，Redis的主从复制模式，一旦主节点出现故障无法提供服务，需要人工介入手工将从节点调整为主节点，同时应用端还需要修改新的主节点地址。这种故障转移的方式对于很多应用场景是不能容忍的。正式由于这个问题，Redis提供了Sentinel（哨兵）架构来解决这个问题。

Redis Sentinel是一个分布式的架构，它本身也是一个独立的Redis节点，但是它不存储数据，只支持部分命令，它能够自动完成故障发现和故障转移，并通知应用方，从而实现高可用。

Redis Sentinel 包含若干个Sentinel节点和Redis数据节点，每个Sentinel节点会对数据节点和其他Sentinel节点进行监控。当发现节点异常时，会对节点做下线标识，如果被标识的是主节点，此时会与其他Sentinel节点进行协商，当大多数Sentinel节点都认为主节点不可达时候，会发起选举，选出一个 Sentinel 节点来完成自动故障转移的工作，同时会将这个变化通知给Redis的应用方。这个过程是完全自动化的，无需人工干预。

2. 哨兵模式主要功能

Sentinel 主要提供以下几个功能：

- 监控：定期检测Redis数据节点、其他Sentinel节点是否可达。
- 通知：将故障转移的结果通知给应用方。
- 主节点故障转移：实现从节点晋升为主节点，并维护后续正确的主从关系。
- 配置提供者：客户端在初始化的时候连接Sentinel节点集合，从中获取主节点信息。
- 多个Sentinel节点来共同判断故障，可以有效防止误判，同时如果个别Sentinel节点不可用，整个Sentinel节点集合依然是高可用的。

3. 哨兵模式工作流程

Sentinel是Redis的高可用性解决方案：

由一个或多个Sentinel实例组成的Sentinel系统可以监视任意多个主服务器，以及所有从服务器，并在被监视的主服务器进入下线状态时，自动将下线主服务器属下的某个从服务器升级为新的主服务器，然后由新的主服务器代替已下线的主服务器继续处理命令请求。

Sentinel负责监控集群中的所有主、从Redis，当发现主故障时，Sentinel会在所有的从中选一个成为新的主。并且会把其余的从变为新主的从。同时那台有问题的旧主也会变为新主的从，即当旧的主即使恢复时，并不会恢复原来的主身份，而是作为新主的一个从。

在Redis高可用架构中，Sentinel往往不是只有一个，而是有三个或者以上。目的是为了让其更加可靠，毕竟主和从切换角色这个过程还是蛮复杂的。

### Redis哨兵模式服务案例实现

#### 一主二从Redis集群部署

1. 使用SSH工具连接三个虚拟机节点修改主机名。命令如下所示：

redis1主节点：
```bash
[root@localhost ~]# hostnamectl set-hostname redis1
```
redis2从节点：
```bash
[root@localhost ~]# hostnamectl set-hostname redis2
```
redis3从节点：
```bash
[root@localhost ~]# hostnamectl set-hostname redis3
```
修改主机名完成后，需要重新连接主机。

2. 将提供的Redis安装文件下载redis-3.2.12.tar.gz到三台虚拟机中，解压到/opt目录中，并配置yum源使用本地目录，命令如下（三台虚拟机操作一致，以redis1主机为例）：
```bash
[root@redis1 ~]# curl -O http://mirrors.douxuedu.com/competition/redis-3.2.12.tar.gz
[root@redis1 ~]# tar -xf redis-3.2.12.tar.gz -C /opt/
[root@redis1 ~]# mv /etc/yum.repos.d/* /media/
[root@redis1 ~]# cat << EOF >> /etc/yum.repos.d/redis.repo
[redis]
name=redis
baseurl=file:///opt/redis
gpgcheck=0
enabled=1
EOF
[root@redis1 ~]# yum clean all && yum repolist
```

3. 在三个节点使用yum命令安装Redis服务并启动。命令如下（三台虚拟机操作一致，以redis1主机为例）：
```bash
[root@redis1 ~]# yum install -y redis 
… …
Complete!
[root@redis1 ~]# systemctl start redis
[root@redis1 ~]# systemctl enable redis
```
4. 按照主从Redis配置，将redis2节点和redis3节点作为redis1节点的从节点。配置完成后的一主二从Redis集群将作为哨兵模式的基础。命令如下：
> redis1节点：
> 修改redis1节点的配置文件/etc/redis.conf如下：

```bash
[root@redis1 ~]# vi /etc/redis.conf
#第一处修改
# bind 127.0.0.1                     //找到bind 127.0.0.1这行并注释掉
#第二处修改
protected-mode no                //将yes修改为no，外部网络可以访问
#第三处修改
daemonize yes                       //将no修改为yes，开启守护进程
#第四处修改
requirepass "123456"                   //添加设置访问密码
#第五处修改，设定主库密码与当前库密码同步，保证从库能够提升为主库
masterauth "123456"
#第六处修改，将no修改为yes，打开AOF持久化支持
appendonly yes
```
至此，redis1主节点配置完毕，重启服务，命令`systemctl restart redis`
> redis2节点：
> 修改redis2节点的配置文件/etc/redis.conf如下：

```bash
[root@redis2 ~]# vi /etc/redis.conf
#第一处修改
# bind 127.0.0.1                     //找到bind 127.0.0.1这行并注释掉
#第二处修改
protected-mode no                    //将yes修改为no，外部网络可以访问
#第三处修改
daemonize yes                       //将no修改为yes，开启守护进程
#第四处修改
# requirepass foobared                 //找到该行
requirepass "123456"                   //在下方添加设置访问密码
#第五处修改
# slaveof <masterip> <masterport>       //找到该行
slaveof 192.168.200.21 6379          //在下方添加访问的主节点IP与端口
#第六处修改
# masterauth <master-password>        //找到该行
masterauth "123456"                   //在下方添加访问主节点密码
#第七处修改，将no修改为yes，打开AOF持久化支持
appendonly yes
```
至此，redis2主节点配置完毕，重启服务，命令`systemctl restart redis`
> 配置redis3节点：
> 修改redis3节点的配置文件/etc/redis.conf如下：

```bash
[root@redis3 ~]# vi /etc/redis.conf
#第一处修改
# bind 127.0.0.1                     //找到bind 127.0.0.1这行并注释掉
#第二处修改
protected-mode no                    //将yes修改为no，外部网络可以访问
#第三处修改
daemonize yes                       //将no修改为yes，开启守护进程
#第四处修改
# requirepass foobared                 //找到该行
requirepass "123456"                   //在下方添加设置访问密码
#第五处修改
# slaveof <masterip> <masterport>       //找到该行
slaveof 192.168.200.21 6379          //在下方添加访问的主节点IP与端口
#第六处修改
# masterauth <master-password>        //找到该行
masterauth "123456"                   //在下方添加访问主节点密码
#第七处修改，将no修改为yes，打开AOF持久化支持
appendonly yes
```
至此，redis3主节点配置完毕，重启服务，命令`systemctl restart redis`
**这样一主二从Redis集群部署就完成了，一主二从Redis集群部署完成后，现在在每个节点查询节点redis服务信息如下所示：**
> redis1主节点：

```bash
[root@redis1 ~]# redis-cli -h 192.168.200.21 -p 6379 -a 123456 info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.200.22,port=6379,state=online,offset=9383,lag=0
slave1:ip=192.168.200.23,port=6379,state=online,offset=9238,lag=1
master_repl_offset:9383
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:9382
```
redis2从节点：
```bash
[root@redis2 ~]# redis-cli -h 192.168.200.22 -p 6379 -a 123456 info replication
# Replication
role:slave
master_host:192.168.200.21
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:2648
slave_priority:100
slave_read_only:1
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```
redis3从节点：
```bash
[root@redis3 ~]# redis-cli -h 192.168.200.23 -p 6379 -a 123456 info replication
# Replication
role:slave
master_host:192.168.200.21
master_port:6379
master_link_status:up
master_last_io_seconds_ago:0
master_sync_in_progress:0
slave_repl_offset:8658
slave_priority:100
slave_read_only:1
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

#### Redis哨兵模式配置

1. 修改一主二从redis集群各节点的配置文件，完成redis哨兵模式的配置。

> redis1节点：
> 修改redis1节点的/etc/redis-sentinel.conf配置文件，具体内容如下：
```bash
[root@redis1 ~]# vi /etc/redis-sentinel.conf 
# 1. 保护模式修改为否，允许远程连接
protected-mode no
# 2. 修改监控地址，为主redis库的主机ip地址
sentinel monitor mymaster 192.168.200.21 6379 2
# 3. 添加配置5秒内没有响应，就反馈服务器挂了
sentinel down-after-milliseconds mymaster 5000
# 4. 修改配置15秒内master没有活起来，就重新选举主
sentinel failover-timeout mymaster 15000
# 5. 表示如果master重新选出来后，其它slave节点能同时并行从新master同步缓存的台数有多少个，显然该值越大，所有slave节点完成同步切换的整体速度越快，但如果此时正好有人在访问这些slave，可能造成读取失败，影响面会更广。最安全的设置为1，只同一时间，只能有一台干这件事，这样其它slave还能继续服务，但是所有slave全部完成缓存更新同步的进程将变慢。这里设置为2。
sentinel parallel-syncs mymaster 2
# 6. 添加配置主数据库密码为123456
sentinel auth-pass mymaster 123456
```
2. 修改redis2从节点和redis3从节点的/etc/redis-sentinel.conf配置文件，修改内容与redis1主节点的/etc/redis-sentinel.conf配置文件一致。
3. 修改完配置文件后，哨兵模式配置就完毕了，接下来需要重启服务。因为Redis服务已经启动，现在只需要启动Redis哨兵服务。命令如下所示：
4. 所有节点启动哨兵：
```bash
# systemctl restart redis-sentinel
# systemctl enable redis-sentinel
```
#### 哨兵模式信息查看

在redis1节点，查看哨兵模式信息，命令如下：
```bash
[root@redis1 ~]# redis-cli -h 192.168.200.21 -p 26379 INFO Sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=192.168.200.21:6379,slaves=2,sentinels=3
```
在redis2节点，查看哨兵模式信息，命令如下：
```bash
[root@redis2 ~]# redis-cli -h 192.168.200.22 -p 26379 INFO Sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=192.168.200.21:6379,slaves=2,sentinels=3
```
在redis3节点，查看哨兵模式信息，命令如下：
```bash
[root@redis3 ~]# redis-cli -h 192.168.200.23 -p 26379 INFO Sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=192.168.200.21:6379,slaves=2,sentinels=3
```
可以看到目前集群中有一个Redis主节点，两个Redis从节点，三个哨兵节点。

#### 哨兵模式验证

哨兵作为对Redis实例的监控，通过选举算法保证哨兵的鲁棒性和高可用，所以哨兵至少要部署3台，符合半数原则，需要5或者7，超过一半，不包含一半存活的时候，才能够选举出leader，才能进行主从的切换功能。

哨兵高可用测试：分别连接对应的Redis服务端，手动停止主Reids服务，看主从是否切换成功。

> redis1节点，手动停止服务，然后查看主节点是否切换，命令如下：

`[root@redis1 ~]# systemctl stop redis`

> 切换到redis2节点，查看Redis集群的主从信息（访问reids2节点的Redis服务），命令如下（redis主节点随机切换到从节点）：

```bash
[root@redis2 ~]# redis-cli -h 192.168.200.22 -p 6379 -a 123456 info replication
# Replication
role:slave
master_host:192.168.200.23
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:6591
slave_priority:100
slave_read_only:1
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```
可以看到，redis2节点的master_host变成了192.168.200.23，也就是说redis3节点变成了主节点。

> 然后切换到redis3节点，查看Redis集群的主从信息（访问reids3节点的Redis服务），命令如下：

```bash
[root@redis3 ~]# redis-cli -h 192.168.200.23 -p 6379 -a 123456 info replication
# Replication
role:master
connected_slaves:1
slave0:ip=192.168.200.22,port=6379,state=online,offset=7461,lag=0
master_repl_offset:7461
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:7460
```
redis3节点成功切换成了主节点。可以看到，当主节点发生了宕机，其他的从节点可以自动切换成主节点。

> 切换到redis1节点，启动恢复Redis服务，查看redis集群的主从信息（访问reids1节点的Redis服务），命令如下：

```bash
[root@redis1 ~]# systemctl restart redis
[root@redis1 ~]# systemctl restart redis-sentinel
[root@redis1 ~]# redis-cli -h 192.168.200.21 -p 6379 -a 123456 info replication
# Replication
role:slave
master_host:192.168.200.23
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:103524
slave_priority:100
slave_read_only:1
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```
可以看见redis1节点变成了从节点。Redis哨兵模式的验证成功。

## Ansible集群部署

### ELK常见架构
1. lasticsearch+Logstash+Kibana：这种架构是最常见的一种，也是最简单的一种架构，这种架构通过Logstash收集日志，运用Elasticsearch分析日志，最后通过Kibana中展示日志信息。
Elasticsearch：是一个开源分布式搜索引擎，它提供存储、分析、搜索功能。有分布式、基于reasful风格、支持海量高并发的准实时搜索场景、稳定、可靠、快速、使用方便等特点。其作用是接收搜集海量结构化日志数据，并提供给Kibana查询分析。
Logstash：是一个开源日志搜集、分析、过滤框架，支持多种数据输入输出方式。 它用于收集日志，对日志进行过滤形成结构化数据，并转发到Elasticsearch中。
Kibana：是一个开源日志报表系统，对Elasticsearch以及Logstash有良好的Web页面支持。它能对Elasticsearch提供的数据进行分析展示。
2. Elasticsearch+Logstash+Filebeat+Kibana：在这种架构中增加了一个Filebeat模块。这个模块在上面的内容中没有对它详细介绍，它是一款轻量的日志收集代理，用来部署在客户端中。这个服务较Logstash来说能够节省资源，一般在生产环境中大多采用这种架构，但是这种架构有一个弊端，那就是当Logstash出现故障后，会造成日志的丢失。
3. Elasticsearch+Logstash+lebeat+Redis（及其他中间件）+Kibana：这种架构等于是上面第二种的完善，通过增加中间件避免数据丢失，当Logstash出现故障后，日志依旧留存在中间件内，当Logstash再次启动，则会读取中间件中积压的日志。在出现“too many open files”报错的时候，大多数情况是由于程序没有正常关闭一些资源引起的，所以出现这种情况时需要检查I/O读写、socket通讯等是否正常关闭等。当然也可以通过修改参数，将系统的文件句柄限制提高，来缓解这一压力。

### ELK部署

（1）配置主机映射：

修改当前节点主机名为ansible，并修改ansible节点主机映射，命令如下：
```bash
[root@localhost ~]# hostnamectl set-hostname ansible
[root@localhost ~]# bash
[root@ansible ~]# cat /etc/hosts
127.0.0.1  localhost localhost.localdomain localhost4 localhost4.localdomain4
::1     localhost localhost.localdomain localhost6 localhost6.localdomain6
172.128.11.162 ansible
172.128.11.217 node1
172.128.11.170 node2
172.128.11.248 node3
```
配置免密访问，虚拟机root用户密码为000000，命令如下：
```bash
[root@ansible ~]# ssh-keygen
[root@ansible ~]# ssh-copy-id node1
[root@ansible ~]# ssh-copy-id node2
[root@ansible ~]# ssh-copy-id node3
```
将ansible节点的域名解析文件复制给安装Elasticsearch集群服务的三个节点，命令如下：
```bash
[root@ansible ~]# scp /etc/hosts node1:/etc/
[root@ansible ~]# scp /etc/hosts node2:/etc/
[root@ansible ~]# scp /etc/hosts node3:/etc/
```
关闭ansible节点的防火墙和Selinux配置（如已关闭，则不需要操作），命令如下：
`[root@ansible ~]# setenforce 0`
（2）软件包下载及uum源配置

修将提供的Elasticsearch、Kibana以及Logstash软件包下载至ansible节点/root目录下，并将相应服务的软件包拷贝至不同节点。
```bash
[root@ansible ~]# curl -O http://mirrors.douxuedu.com/competition/Ansible.tar.gz
[root@ansible ~]# tar -zxvf Ansible.tar.gz
```
将Elasticsearch软件包拷贝至三个节点，将Kibana软件包拷贝至node1节点，将Logstash软件包拷贝至node2节点，命令如下：
```bash
[root@ansible ~]# scp elasticsearch-6.0.0.rpm node1:/root/
[root@ansible ~]# scp elasticsearch-6.0.0.rpm node2:/root/
[root@ansible ~]# scp elasticsearch-6.0.0.rpm node3:/root/
[root@ansible ~]# scp kibana-6.0.0-x86_64.rpm node1:/root/
[root@ansible ~]# scp kibana-6.0.0-x86_64.rpm node2:/root/
[root@ansible ~]# scp kibana-6.0.0-x86_64.rpm node3:/root/
[root@ansible ~]# scp logstash-6.0.0.rpm node1:/root/
[root@ansible ~]# scp logstash-6.0.0.rpm node2:/root/
[root@ansible ~]# scp logstash-6.0.0.rpm node3:/root/
```
将软件包ansible.tar.gz上传至ansible节点配置本地yum源，并安装Ansible：
```bash
[root@ansible ~]# tar -zxvf ansible.tar.gz -C /opt/
[root@ansible ~]# mv /etc/yum.repos.d/* /media/
[root@ansible ~]# vi /etc/yum.repos.d/local.repo
[ansible]
name=ansible 
baseurl=file:///opt/ansible
gpgcheck=0
enabled=1

[root@ansible ~]# yum -y install ansible
```
（3）配置Ansible主机映射

创建示例目录，并配置Ansible主机映射。
```
[root@ansible ~]# mkdir example
[root@ansible ~]# cd example
[root@ansible example]# vi /etc/ansible/hosts 
[node1]
172.128.11.217
[node2]
172.128.11.170
[node3]
172.128.11.248
```
使用CentOS-7-x86_64-DVD-2009.iso镜像文件作为安装库，将镜像挂载至/opt/centos，编写yum源文件，安装vsftpd服务，用于给远程主机安装Java。命令如下：
```bash
[root@ansible example]# curl -O http://mirrors.douxuedu.com/competition/CentOS-7-x86_64-DVD-2009.iso
[root@ansible example]# mkdir /opt/centos
[root@ansible example]# mount CentOS-7-x86_64-DVD-2009.iso /opt/centos/
[root@ansible example]# vi /etc/yum.repos.d/local.repo 
[ansible]
name=ansible
baseurl=file:///opt/ansible
gpgcheck=0
enabled=1
[centos]
name=centos
baseurl=file:///opt/centos
gpgcheck=0
enabled=1
[root@ansible example]# yum install -y vsftpd
[root@ansible example]# vi /etc/vsftpd/vsftpd.conf
anon_root=/opt
[root@ansible example]# systemctl restart vsftpd
[root@ansible example]# vi ftp.repo
[centos]
name=centos
baseurl=ftp://172.128.11.162/centos/
gpgcheck=0
enabled=1
```
（4）安装Elasticsearch获取配置文件

安装Elasticsearch服务并编写node1节点配置文件，命令如下：
```bash
[root@ansible example]# rpm -ivh /root/elasticsearch-6.0.0.rpm
[root@ansible example]# cp -rf /etc/elasticsearch/elasticsearch.yml elk1.yml
[root@ansible example]# cat elk1.yml | grep -Ev "^$|^#"
cluster.name: ELK
node.name: node1
node.master: true
node.data: false
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 172.128.11.217
http.port: 9200
discovery.zen.ping.unicast.hosts: ["node1","node2","node3"]
```
编写node2节点配置文件，命令如下：
```bash
[root@ansible example]# cp elk1.yml elk2.yml
[root@ansible example]# cat elk2.yml | grep -Ev "^$|^#"
cluster.name: ELK
node.name: node2
node.master: false
node.data: true
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 172.128.11.170
http.port: 9200
discovery.zen.ping.unicast.hosts: ["node1","node2","node3"]
```
编写node3节点配置文件，命令如下：
```bash
[root@ansible example]# cp elk1.yml elk3.yml
[root@ansible example]# cat elk3.yml | grep -Ev "^$|^#"
cluster.name: ELK
node.name: node3
node.master: false
node.data: true
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 172.128.11.248
http.port: 9200
discovery.zen.ping.unicast.hosts: ["node1","node2","node3"]
```
（5）安装Kibana获取配置文件

安装Kibana服务并编写配置文件，命令如下：
```bash
[root@ansible example]# rpm -ivh /root/kibana-6.0.0-x86_64.rpm 
[root@ansible example]# cp -rf /etc/kibana/kibana.yml .
[root@ansible example]# cat kibana.yml |grep -v ^#
server.port: 5601
server.host: "172.128.11.217" <-node1节点IP
elasticsearch.url: "http://172.128.11.217:9200"
```
（6）安装Logstash获取配置文件

安装Logstash服务并获取配置文件，命令如下：
```bash
[root@ansible example]# rpm -ivh /root/logstash-6.0.0.rpm
[root@ansible example]# cp -rf /etc/logstash/logstash.yml .
[root@ansible example]# vi logstash.yml
http.host: "172.128.11.170"
```
新建日志输出文件，内容如下（⚠删除注释）：
```bash
[root@ansible example]# vi syslog.conf
input {
    file {
        path => "/var/log/messages" #指定文件的路径
        type => "systemlog" #定义日志类型，可自定义
        start_position => "beginning" #指定何时开始收集
        stat_interval => "3"
    }
}
output {
    if [type] == "systemlog" {
        elasticsearch {
            hosts => ["172.128.11.217:9200"]   #这里的地址为node1主机地址
            index => "system-log-%{+YYYY.MM.dd}"
        }
    }
}
```
（7）编写剧本文件

安编写Playbook剧本文件，命令如下：
```bash
[root@ansible example]# vi cscc_install.yaml
- hosts: all
  remote_user: root
  tasks:
    - name: rm repo
      shell: rm -rf /etc/yum.repos.d/*
    - name: copy repo
      copy: src=ftp.repo dest=/etc/yum.repos.d/
    - name: install java
      shell: yum -y install java-1.8.0-*
    - name: install elk
      shell: rpm -ivh elasticsearch-6.0.0.rpm
- hosts: node1
  remote_user: root
  tasks:
    - name: copy config
      copy: src=elk1.yml dest=/etc/elasticsearch/elasticsearch.yml
    - name: daemon-reload
      shell: systemctl daemon-reload
    - name: start elk
      shell: systemctl start elasticsearch && systemctl enable elasticsearch
    - name: install kibana
      shell: rpm -ivh kibana-6.0.0-x86_64.rpm
    - name: copy config
      template: src=kibana.yml dest=/etc/kibana/kibana.yml
    - name: start kibana
      shell: systemctl start kibana && systemctl enable kibana
- hosts: node2
  remote_user: root
  tasks:
    - name: copy config
      copy: src=elk2.yml dest=/etc/elasticsearch/elasticsearch.yml
    - name: daemon-reload
      shell: systemctl daemon-reload
    - name: start elk
      shell: systemctl start elasticsearch && systemctl enable elasticsearch
    - name: install logstash
      shell: rpm -ivh logstash-6.0.0.rpm
    - name: copy config
      copy: src=logstash.yml dest=/etc/logstash/logstash.yml
    - name: copy config
      copy: src=syslog.conf dest=/etc/logstash/conf.d/syslog.conf
- hosts: node3
  remote_user: root
  tasks:
    - name: copy config
      copy: src=elk3.yml dest=/etc/elasticsearch/elasticsearch.yml
    - name: daemon-reload
      shell: systemctl daemon-reload
    - name: start elk
      shell: systemctl start elasticsearch && systemctl enable elasticsearch
```
执行Playbook完成ELK集群的部署，命令如下：
`[root@ansible example]# ansible-playbook cscc_install.yaml`
> 如下信息就是正常的 

```bash
PLAY RECAP ********************************************************************************************************
10.3.61.205                : ok=12   changed=10   unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
10.3.61.219                : ok=12   changed=10   unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
10.3.61.242                : ok=9    changed=7    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
``` 

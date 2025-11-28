---
title: CentOS搭建OpenStack-Queen手记
businesscard: true
date: 2022-12-06 20:41:18
tags:
  - CentOS
  - Linux
  - OpenStack
categories:
  - 服务器运维
  - 云计算
  - OpenStack
cover: https://tse1-mm.cn.bing.net/th/id/OIP-C.CZwj5SbW0RXNrztZceTZtwHaEK?pid=ImgDet&rs=1
---
# OpenStack-Queen版本搭建
- 系统：CentOS7.5-1804
- 硬件环境：
  - i7-12700H & 16G-RAM
- 软件环境：
  - VT-d开启 & VT-x未开启（主板BIOS设置问题）
  - VMware Workstation16.2.4 build-20089737
  - Xshell Build0090
- 虚拟机设置：
  - Controller节点：
    - 4CPU & 6G-RAM & 60G-储存
    - 三张网卡：
      - 公网网卡：ens33-DHCP（用于下载文件）
      - 管理网卡：ens34-192.168.100.10
      - 外网网卡：ens35-192.168.200.10
  - Compute节点：
    - 4CPU & 4G-RAM & 60G-储存
    - 三张网卡
      - 公网网卡：ens33-DHCP（用于下载文件）
      - 管理网卡：ens34-192.168.100.20
      - 外网网卡：ens35-192.168.200.20
# 网络配置
- 三张网卡，一张NAT-DHCP两张桥接（上述说明）
   - controller：ens34-192.168.100.10 & ens35-192.1689.200.10
   - compute：ens34-192.168.100.20 & ens35-192.168.200.20
- PROVIDER_INTERFACE_NAME：外网卡名-200.*
- OVERLAY_INTERFACE_IP_ADDRESS：管理网口IP-100.*
### 配置名称解析（controller+compute）
将节点的主机名设置为：controller
编辑文件以包含（添加）以下内容：/etc/hosts
```vim
# controller
192.168.100.10       controller

# compute
192.168.100.20       compute
```
## controller网络配置
### 配置网络接口
将第一个接口配置为管理接口：
IP地址1： 192.168.100.10
IP地址2：192.168.200.10
网络掩码：255.255.255.0（或/24）
默认网关：192.168.100.1
编辑文件以包含（添加）以下内容：/etc/sysconfig/network-scripts/ifcfg-$网卡名
```vim
DEVICE=ens34  #这里是网卡名，还有一张网卡是ens35
TYPE=Ethernet
ONBOOT="yes"
BOOTPROTO=static
IPADDR=192.168.100.10 #这里是网卡ip，还有一张网卡是200.10
NETMASK=255.255.255.0
```
## compute网络配置
### 配置网络接口
将第一个接口配置为管理接口：
管理IP地址1： 192.168.100.20
外网IP地址2： 192.168.200.20
网络掩码：255.255.255.0（或/24）
默认网关：192.168.100.1
编辑文件 以包含以下内容：/etc/sysconfig/network-scripts/ifcfg-$网卡名
```vim
DEVICE=ens34  #这里是网卡名，还有一张网卡是ens35
TYPE=Ethernet
ONBOOT="yes"
BOOTPROTO=static
IPADDR=192.168.100.20 #这里是管理网卡ip，还有一张外网网卡是200.20
NETMASK=255.255.255.0
```
# Controller节点配置
> 暂时省略一些操作步骤
Security
Host networking
Network Time Protocol (NTP)
OpenStack packages
## 安装配置mariadb：
1. 配置文件/etc/my.cnf.d/ariadb-server.cnf
2. 添加： 
    ```vim
    bind-address = 192.168.100.10
		default-storage-engine = innodb
		innodb_file_per_table = on
		max_connections = 4096
		collation-server = utf8_general_ci
		character-set-server = utf8
		```
3. 初始化数据库：
- 设置密码：`mysqladmin -uroot password 000000`
- 测试登录：`mysql -uroot -p000000`
  - `systemctl enable mariadb.service`
  - `systemctl start mariadb.service`
## 消息队列
1. 设置密码：`rabbitmqctl add_user openstack 000000`
2. 给予用户各种权限：`rabbitmqctl set_permissions openstack ".*" ".*" ".*"`
## 安装配置Memcached：
1. 安装`yum install memcached python-memcached`
2. 配置文件：/etc/sysconfig/memcached
- OPTIONS="-l 127.0.0.1,::1,controller"
  - `systemctl enable memcached.service`
  - `systemctl start memcached.service`
## 安装配置Etcd
1. 安装：`yum install etcd`
2. 配置文件：/etc/etcd/etcd.conf
```vim
#[Member]
#ETCD_CORS=""
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
#ETCD_WAL_DIR=""
#ETCD_LISTEN_PEER_URLS="http://192.168.100.10:2380"
ETCD_LISTEN_CLIENT_URLS="http://192.168.100.10:2379"
#ETCD_MAX_SNAPSHOTS="5"
#ETCD_MAX_WALS="5"
ETCD_NAME="default"
#ETCD_SNAPSHOT_COUNT="100000"
#ETCD_HEARTBEAT_INTERVAL="100"
#ETCD_ELECTION_TIMEOUT="1000"
#ETCD_QUOTA_BACKEND_BYTES="0"
#ETCD_MAX_REQUEST_BYTES="1572864"
#ETCD_GRPC_KEEPALIVE_MIN_TIME="5s"
#ETCD_GRPC_KEEPALIVE_INTERVAL="2h0m0s"
#ETCD_GRPC_KEEPALIVE_TIMEOUT="20s"
#
#[Clustering]
#ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.100.10:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.100.10:2379"
#ETCD_DISCOVERY=""
#ETCD_DISCOVERY_FALLBACK="proxy"
#ETCD_DISCOVERY_PROXY=""
#ETCD_DISCOVERY_SRV=""
#ETCD_INITIAL_CLUSTER="default=http://192.168.100.10:2380"
#ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster-01"
#ETCD_INITIAL_CLUSTER_STATE="new"
#ETCD_STRICT_RECONFIG_CHECK="true"
#ETCD_ENABLE_V2="true"
```
- `systemctl enable etcd`
- `systemctl start etcd`
## 安装配置Keystone
1. 创建keystone的数据库并且授权
  - `mysql -u root -p`
    - `password：000000`
  - > create database keystone;
  - 查看一下是否生成了keystone数据库：
    - > show databases;
  - 给予localhost权限：
  	- > GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'localhost'  IDENTIFIED BY '000000';
  - 给予controller权限：
    - > GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'controller'  IDENTIFIED BY '000000';
  - 允许远程登录（%为远程权限）：
    - > GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%'  IDENTIFIED BY '000000';
  - 刷新权限：
    - > flush privileges;
  - 退出语句执行ctrl+c
2. 安装和配置组件
  - 安装：`yum install openstack-keystone httpd mod_wsgi`
3. 配置文件：/etc/keystone/keystone.conf
  - 编辑第719行：connection = mysql+pymysql://keystone:000000@controller/keystone
  - 编辑第2922行：provider = fernet
4. 导入数据库文件
  - `su -s /bin/sh -c "keystone-manage db_sync" keystone`
5. 初始化数据库密钥储存库：
  - `keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone`
  - `keystone-manage credential_setup --keystone-user keystone --keystone-group keystone`
6. 引导keystone服务：
```bash
keystone-manage bootstrap --bootstrap-password 000000 \
--bootstrap-admin-url http://controller:5000/v3/ \
--bootstrap-internal-url http://controller:5000/v3/ \
--bootstrap-public-url http://controller:5000/v3/ \
--bootstrap-region-id RegionOne
```
7. 配置Http文件：/etc/httpd/conf/httpd.conf
  - 第95行：ServerName controller
8. 创建一个 指向该文件的软连接：/usr/share/keystone/wsgi-keystone.conf
  - `ln -s /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/`
9. 设置httpd为开机自启：
  - `systemctl enable httpd`
  - `systemctl start httpd`
10. 配置管理账户：
```bash
export OS_USERNAME=admin
export OS_PASSWORD=000000
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3
```
11. 创建域，项目，用户和角色
```bash
openstack project create --domain default \
--description "Service Project" service
```
  - 创建项目：service
    ```bash
    openstack project create --domain default \
    --description "Service Project" servic
    ```
        ```bash
        +-------------+----------------------------------+
        | Field       | Value                            |
        +-------------+----------------------------------+
        | description | Service Project                  |
        | domain_id   | default                          |
        | enabled     | True                             |
        | id          | 555e7eae44a34d959b2505c5e0c90367 |
        | is_domain   | False                            |
        | name        | service                          |
        | parent_id   | default                          |
        | tags        | []                               |
        +-------------+----------------------------------+
        ```
  - 创建项目：demo
    ```bash
    openstack project create --domain default \
    --description "Demo Project" demo
    ```
	    ```bash
        +-------------+----------------------------------+
        | Field       | Value                            |
        +-------------+----------------------------------+
        | description | Demo Project                     |
        | domain_id   | default                          |
        | enabled     | True                             |
        | id          | ef655f97c90940678dc6637e4a843f50 |
        | is_domain   | False                            |
        | name        | demo                             |
        | parent_id   | default                          |
        | tags        | []                               |
        +-------------+----------------------------------+
        ```
  - 创建用户：demo
    ```bash
    openstack user create --domain default \
    --password-prompt demo
    ```
    ```bash
    User Password:
    Repeat User Password:
    +---------------------+----------------------------------+
    | Field               | Value                            |
    +---------------------+----------------------------------+
    | domain_id           | default                          |
    | enabled             | True                             |
    | id                  | b6459c600cae448793322191a6af600e |
    | name                | demo                             |
    | options             | {}                               |
    | password_expires_at | None                             |
    +---------------------+----------------------------------+
    ```
  - 创建角色：user
    - `openstack role create user`
        ```bash
        +-----------+----------------------------------+
        | Field     | Value                            |
        +-----------+----------------------------------+
        | domain_id | None                             |
        | id        | 094012b7c36d490ea5e37020190ed4f4 |
        | name      | user                             |
        +-----------+----------------------------------+
        ```
  - 将角色添加到项目和用户：user和demo
  	- `openstack role add --project demo --user demo user`**此命令没有回显**
  - 取消设置临时和环境变量：OS_AUTH_URL和OS_PASSWORD
  	- `unset OS_AUTH_URL OS_PASSWORD`
  - 以用户身份请求身份验证令牌：admin
	```bash
	openstack --os-auth-url http://controller:5000/v3 \
	--os-project-domain-name Default --os-user-domain-name Default \
	--os-project-name admin --os-username admin token issue
	```
    - [具体验证步骤](https://docs.openstack.org/keystone/queens/install/keystone-verify-rdo.html)
- 创建OpenStack客户端环境脚本（每一次执行sopenstack的命令时，都要source一下这个sh文件）：admin-openrc
    ```bash
    export OS_PROJECT_DOMAIN_NAME=Default
    export OS_USER_DOMAIN_NAME=Default
    export OS_PROJECT_NAME=admin
    export OS_USERNAME=admin
    export OS_PASSWORD=000000
    export OS_AUTH_URL=http://controller:5000/v3
    export OS_IDENTITY_API_VERSION=3
    export OS_IMAGE_API_VERSION=2
    ```
  - 创建普通用户的脚本：demo-openrc
    ```bash
    export OS_PROJECT_DOMAIN_NAME=Default
    export OS_USER_DOMAIN_NAME=Default
    export OS_PROJECT_NAME=demo
    export OS_USERNAME=demo
    export OS_PASSWORD=000000
    export OS_AUTH_URL=http://controller:5000/v3
    export OS_IDENTITY_API_VERSION=3
    export OS_IMAGE_API_VERSION=2
    ```
## 安装配置Glance服务
1. 创建数据库等服务：
  - 登录用户`mysql -uroot -p000000`**000000是之前设置的密码**
  	- 登录不上就执行一下之前创建的：`source admin-openrc`
	- 创建数据库：glance
    	- > CREATE DATABASE glance;
	- 授予对数据库的适当访问权限：glance
      - > GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'localhost' \
		IDENTIFIED BY '000000';
      - > GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'%' \
		IDENTIFIED BY '000000';
      - > GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'controller' \
		IDENTIFIED BY '000000';
2. 获取凭据以获取访问权限 仅限管理员的 CLI 命令：admin
  - `. admin-openrc`
  - . admin-openrc文件的内容为：
    ```shell
    export OS_PROJECT_DOMAIN_NAME=Default
    export OS_USER_DOMAIN_NAME=Default
    export OS_PROJECT_NAME=admin
    export OS_USERNAME=admin
    export OS_PASSWORD=000000
    export OS_AUTH_URL=http://controller:5000/v3
    export OS_IDENTITY_API_VERSION=3
    export OS_IMAGE_API_VERSION=2
    ```
1. 创建服务凭据：
  - 创建用户：glance
    - `openstack user create --domain default --password-prompt glance`
        ```bash
        User Password:
        Repeat User Password:
        +---------------------+----------------------------------+
        | Field               | Value                            |
        +---------------------+----------------------------------+
        | domain_id           | default                          |
        | enabled             | True                             |
        | id                  | 19e51cbccd8b46b3ab6074ad682b9014 |
        | name                | glance                           |
        | options             | {}                               |
        | password_expires_at | None                             |
        +---------------------+----------------------------------+
        ```
1. 将创建的角色添加到用户和项目：
  - `openstack role add --project service --user glance admin`
  - 没有回显！
1. 创建服务实体：glance
```bash
openstack service create --name glance \
--description "OpenStack Image" image
```
```bash
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Image                  |
| enabled     | True                             |
| id          | ed1dda5c842e4b50af831a5458b7cdee |
| name        | glance                           |
| type        | image                            |
+-------------+----------------------------------+
```
1. 创建Glance服务的API端点：
```bash
openstack endpoint create --region RegionOne \
image public http://controller:9292
```
```bash
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 52196bf7961d4826a5b4b3ca2aa0cf03 |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | ed1dda5c842e4b50af831a5458b7cdee |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
```
```bash
openstack endpoint create --region RegionOne \
image internal http://controller:9292
```
```bash
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | bb90fd3d3b18450bafecc86afc261727 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | ed1dda5c842e4b50af831a5458b7cdee |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
```
```bash
openstack endpoint create --region RegionOne \
image admin http://controller:9292
```
```bash
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | bb7450b740ac447fbfac334205d3a31e |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | ed1dda5c842e4b50af831a5458b7cdee |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
```
### 安装和配置组件
1. yum install openstack-glance
2. 编辑配置文件：/etc/glance/glance-api.conf
  - 在配置数据库访问部分中：[database]添加或更改原注释为
	```bash
	[database]
	# ...
	connection = mysql+pymysql://glance:000000@controller/glance
	```
  - 配置身份服务访问：[keystone_authtoken][paste_deploy]添加或更改原注释为
	```vim
	[keystone_authtoken]
	# ...
	auth_uri = http://controller:5000
	auth_url = http://controller:5000
	memcached_servers = controller:11211
	auth_type = password
	project_domain_name = Default
	user_domain_name = Default
	project_name = service
	username = glance
	password = 000000

	[paste_deploy]
	# ...
	flavor = keystone
	```
  - 配置本地文件系统存储和映像文件的位置：[glance_store]添加或更改原注释为
	```vim
	stores = file,http
	default_store = file
	filesystem_store_datadir = /var/lib/glance/images/
	```
1. 编辑文件并完成，以下操作：/etc/glance/glance-registry.conf
  - 在配置文件中中：[database]添加或更改原注释为
	```vim
	[database]
	# ...
	connection = mysql+pymysql://glance:000000@controller/glance
	```
	- 配置身份服务访问：[keystone_authtoken][paste_deploy]添加或更改原注释为
	```vim
	[keystone_authtoken]
	# ...
	auth_uri = http://controller:5000
	auth_url = http://controller:5000
	memcached_servers = controller:11211
	auth_type = password
	project_domain_name = Default
	user_domain_name = Default
	project_name = service
	username = glance
	password = 000000

	[paste_deploy]
	# ...
	flavor = keystone
	```
1. 注入Glance服务的数据库：
  - `su -s /bin/sh -c "glance-manage db_sync" glance`
  - 忽略回显的任何东西！
### 完成Glance安装
1. 启动Glance服务并将其设置为自动启动
	```bash
  	systemctl enable openstack-glance-api.service \
	openstack-glance-registry.service
	```
	```bash
	systemctl start openstack-glance-api.service \
	openstack-glance-registry.service
	```
2. 测试镜像列表：`openstack image list`
  - 没有报错就可以！
### 测试Glannce镜像服务
1. 获取凭据以获取访问权限 仅限管理员的 CLI 命令：admin
  - `. admin-openrc`
1. 下载一个镜像：`wget http://download.cirros-cloud.net/0.4.0/cirros-0.4.0-x86_64-disk.img`
2. 上传镜像到glance库
	```bash
	openstack image create "cirros" \
	--file cirros-0.4.0-x86_64-disk.img \
	--disk-format qcow2 --container-format bare \
	--public
	```
	```bash
	+------------------+------------------------------------------------------+
	| Field            | Value                                                |
	+------------------+------------------------------------------------------+
	| checksum         | 443b7623e27ecf03dc9e01ee93f67afe                     |
	| container_format | bare                                                 |
	| created_at       | 2022-12-04T13:31:27Z                                 |
	| disk_format      | qcow2                                                |
	| file             | /v2/images/bc7255cc-ce0e-4d5a-815d-a43f8d155476/file |
	| id               | bc7255cc-ce0e-4d5a-815d-a43f8d155476                 |
	| min_disk         | 0                                                    |
	| min_ram          | 0                                                    |
	| name             | cirros                                               |
	| owner            | 9f2cd3bd0bc2465abf66dc251cd16aed                     |
	| protected        | False                                                |
	| schema           | /v2/schemas/image                                    |
	| size             | 12716032                                             |
	| status           | active                                               |
	| tags             |                                                      |
	| updated_at       | 2022-12-04T13:31:28Z                                 |
	| virtual_size     | None                                                 |
	| visibility       | public                                               |
	+------------------+------------------------------------------------------+
	```
3. 确认上传镜像并且验证属性：`openstack image list`
	```bash
	+--------------------------------------+--------+--------+
	| ID                                   | Name   | Status |
	+--------------------------------------+--------+--------+
	| bc7255cc-ce0e-4d5a-815d-a43f8d155476 | cirros | active |
	+--------------------------------------+--------+--------+
	```
4. 使用show再次确认镜像是否存在：`openstackimage show bc7255cc-ce0e-4d5a-815d-a43f8d155476`
  - 返回出之前显示过的镜像信息。
## 安装配置Nova计算服务
### 配置nova的数据库：
1. 获得权限`. admin-openrc`
  - 连接到数据库`mysql -u root -p`
  - 创建三个数据库：
    - `CREATE DATABASE nova_api;`
    - `CREATE DATABASE nova;`
    - `CREATE DATABASE nova_cell0;`
  - 授予localhost，%，controller和compute三个节点的nova_api,nova,nova_cell0的数据库权限
    ```sql
    GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'localhost' \
    IDENTIFIED BY '000000';

    GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'%' \
    IDENTIFIED BY '000000';

    GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'controller' \
    IDENTIFIED BY 'NOVA_DBPASS';
    
    
    GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'compute' \
    IDENTIFIED BY '000000';
    ```
    - 以上4个指令中的nova_api替换为nova和nova_cell0再各自执行一遍即可完成所有授权
  - 创建计算节点服务凭据：
    - 创建用户：nova`openstack user create --domain default --password-prompt nova`
      ```bash
      User Password:
      Repeat User Password:
      +---------------------+----------------------------------+
      | Field               | Value                            |
      +---------------------+----------------------------------+
      | domain_id           | default                          |
      | enabled             | True                             |
      | id                  | d1bc9ec5e40e41e8a4e2f39efd9ffd14 |
      | name                | nova                             |
      | options             | {}                               |
      | password_expires_at | None                             |
      +---------------------+----------------------------------+
      ```
    - 将觉得添加到用户：adminnova`openstack role add --project service --user nova admin`
    - **此命令不提供输出**
  - 创建服务实体：
  ```bash
  openstack service create --name nova \
  --description "OpenStack Compute" compute
  ```
    ```bash
    +-------------+----------------------------------+
    | Field       | Value                            |
    +-------------+----------------------------------+
    | description | OpenStack Compute                |
    | enabled     | True                             |
    | id          | f46463ba53ba4bddb2331f8a0f6adfd8 |
    | name        | nova                             |
    | type        | compute                          |
    +-------------+----------------------------------+
    ```
  - 创建计算API服务终端节点：
  ```bash
  openstack endpoint create --region RegionOne \
  compute public http://controller:8774/v2.1
  ```
    ```bash
    +--------------+----------------------------------+
    | Field        | Value                            |
    +--------------+----------------------------------+
    | enabled      | True                             |
    | id           | 94601acaffdc4efba49e67e6c6dc891a |
    | interface    | public                           |
    | region       | RegionOne                        |
    | region_id    | RegionOne                        |
    | service_id   | f46463ba53ba4bddb2331f8a0f6adfd8 |
    | service_name | nova                             |
    | service_type | compute                          |
    | url          | http://controller:8774/v2.1      |
    +--------------+----------------------------------+
    ```
  ```bash
  openstack endpoint create --region RegionOne \
  compute internal http://controller:8774/v2.1
  ```
    ```bash
    +--------------+----------------------------------+
    | Field        | Value                            |
    +--------------+----------------------------------+
    | enabled      | True                             |
    | id           | 2e820ed02a304d83a857be2a9f64fd19 |
    | interface    | internal                         |
    | region       | RegionOne                        |
    | region_id    | RegionOne                        |
    | service_id   | f46463ba53ba4bddb2331f8a0f6adfd8 |
    | service_name | nova                             |
    | service_type | compute                          |
    | url          | http://controller:8774/v2.1      |
    +--------------+----------------------------------+
    ```
  ```bash
  openstack endpoint create --region RegionOne \
  compute admin http://controller:8774/v2.1
  ```
    ```bash
    +--------------+----------------------------------+
    | Field        | Value                            |
    +--------------+----------------------------------+
    | enabled      | True                             |
    | id           | 8090b972c7bf40d6bb371ef648be61ae |
    | interface    | admin                            |
    | region       | RegionOne                        |
    | region_id    | RegionOne                        |
    | service_id   | f46463ba53ba4bddb2331f8a0f6adfd8 |
    | service_name | nova                             |
    | service_type | compute                          |
    | url          | http://controller:8774/v2.1      |
    +--------------+----------------------------------+
    ```
  - 创建一个placement服务的用户：`openstack user create --domain default --password-prompt placement`
  ```bash
  User Password:
  Repeat User Password:
  +---------------------+----------------------------------+
  | Field               | Value                            |
  +---------------------+----------------------------------+
  | domain_id           | default                          |
  | enabled             | True                             |
  | id                  | a2182cc096a442e89e2d8a04ce4ff3f3 |
  | name                | placement                        |
  | options             | {}                               |
  | password_expires_at | None                             |
  +---------------------+----------------------------------+
  ```
  - 将placement添加管理员到具有管理员权限的服务项目中：`openstack role add --project service --user placement admin`**没有回显**
  - 在服务器条目中创建placementAPI：`openstack service create --name placement --description "Placement API" placement`
  ```bash
  +-------------+----------------------------------+
  | Field       | Value                            |
  +-------------+----------------------------------+
  | description | Placement API                    |
  | enabled     | True                             |
  | id          | 06b8555234df430aa3300ce5f4c019c9 |
  | name        | placement                        |
  | type        | placement                        |
  +-------------+----------------------------------+
  ```
  - 创建PlacementAPI的服务终端点：`openstack endpoint create --region RegionOne placement public http://controller:8778`
  ```bash
  +--------------+----------------------------------+
  | Field        | Value                            |
  +--------------+----------------------------------+
  | enabled      | True                             |
  | id           | 31ab7d0ecfac4971ba8241d542342839 |
  | interface    | public                           |
  | region       | RegionOne                        |
  | region_id    | RegionOne                        |
  | service_id   | 06b8555234df430aa3300ce5f4c019c9 |
  | service_name | placement                        |
  | service_type | placement                        |
  | url          | http://controller:8778           |
  +--------------+----------------------------------+
  ```
  - `openstack endpoint create --region RegionOne placement internal http://controller:8778`
  ```bash
  +--------------+----------------------------------+
  | Field        | Value                            |
  +--------------+----------------------------------+
  | enabled      | True                             |
  | id           | afbbf36659054272bd4ecee8798a14f0 |
  | interface    | internal                         |
  | region       | RegionOne                        |
  | region_id    | RegionOne                        |
  | service_id   | 06b8555234df430aa3300ce5f4c019c9 |
  | service_name | placement                        |
  | service_type | placement                        |
  | url          | http://controller:8778           |
  +--------------+----------------------------------+
  ```
  - `openstack endpoint create --region RegionOne placement admin http://controller:8778`
  ```bash
  +--------------+----------------------------------+
  | Field        | Value                            |
  +--------------+----------------------------------+
  | enabled      | True                             |
  | id           | 95be629610e346ea831888917a8b8e74 |
  | interface    | admin                            |
  | region       | RegionOne                        |
  | region_id    | RegionOne                        |
  | service_id   | 06b8555234df430aa3300ce5f4c019c9 |
  | service_name | placement                        |
  | service_type | placement                        |
  | url          | http://controller:8778           |
  +--------------+----------------------------------+
  ```
## 安装和配置nova的组件
1. 安装软件包：
```bash
yum install openstack-nova-api openstack-nova-conductor \
openstack-nova-console openstack-nova-novncproxy \
openstack-nova-scheduler openstack-nova-placement-api
```
1. 编辑文件并完成以下操作：/etc/nova/nova.conf
  - 在[DEFAULT]小节中启用计算元数据API
  ```vim
  [DEFAULT]
  # ...
  enabled_apis = osapi_compute,metadata
  ``` 
  - 接下来的配置项就统一写一起了，和之前controller的配置一样的！
  ```vim
  [api_database]
  # ...
  connection = mysql+pymysql://nova:000000@controller/nova_api

  [database]
  # ...
  connection = mysql+pymysql://nova:000000@controller/nova

  [DEFAULT]
  # ...
  transport_url = rabbit://openstack:RABBIT_PASS@controller

  [api]
  # ...
  auth_strategy = keystone

  [keystone_authtoken]
  # ...
  auth_url = http://controller:5000/v3
  memcached_servers = controller:11211
  auth_type = password
  project_domain_name = default
  user_domain_name = default
  project_name = service
  username = nova
  password = 000000

  [DEFAULT]
  # ...
  my_ip = 192.168.100.10

  [DEFAULT]
  # ...
  use_neutron = True
  firewall_driver = nova.virt.firewall.NoopFirewallDriver

  [vnc]
  enabled = true
  # ...
  server_listen = 192.169.100.10
  server_proxyclient_address = 192.168.100.10

  [glance]
  # ...
  api_servers = http://controller:9292
  
  [oslo_concurrency]
  # ...
  lock_path = /var/lib/nova/tmp

  [placement]
  # ...
  os_region_name = RegionOne
  project_domain_name = Default
  project_name = service
  auth_type = password
  user_domain_name = Default
  auth_url = http://controller:5000/v3
  username = placement
  password = 000000
  ```
3. 由于打包错误，您必须启用 通过将以下配置添加到以下内容来访问放置 API：`vi /etc/httpd/conf.d/00-nova-placement-api.conf`
  - 向配置文件中写入以下内容：
  ```vim
  <Directory /usr/bin>
    <IfVersion >= 2.4>
        Require all granted
    </IfVersion>
    <IfVersion < 2.4>
        Order allow,deny
        Allow from all
    </IfVersion>
  </Directory>
  ```
4. 重启httpd服务：`systemctl restart httpd`
5. 填充数据库：nova-api：`su -s /bin/sh -c "nova-manage api_db sync" nova`（忽略任何输出）
6. 注册数据库：cell0：`su -s /bin/sh -c "nova-manage cell_v2 map_cell0" nova`
7. 创建单元格：cell1：`su -s /bin/sh -c "nova-manage cell_v2 create_cell --name=cell1 --verbose" nova`
  ```bash
  109e1d4b-536a-40d0-83c6-5f121b82b650
  ```
8. 填充 nova 数据库：`su -s /bin/sh -c "nova-manage db sync" nova`
9. 验证nova cell0 和 cell1 是否已正确注册：`nova-manage cell_v2 list_cells`
```bash
+-------+--------------------------------------+------------------------------------+-------------------------------------------------+
|  Name |                 UUID                 |           Transport URL            |               Database Connection               |
+-------+--------------------------------------+------------------------------------+-------------------------------------------------+
| cell0 | 00000000-0000-0000-0000-000000000000 |               none:/               | mysql+pymysql://nova:****@controller/nova_cell0 |
| cell1 | 19dc68a7-77d3-472f-9aee-db3664a9ec60 | rabbit://openstack:****@controller |    mysql+pymysql://nova:****@controller/nova    |
+-------+--------------------------------------+------------------------------------+-------------------------------------------------+
```
### 完成nova服务的安装：
> 两条systemctl指令
```bash
systemctl enable openstack-nova-api.service \
  openstack-nova-consoleauth.service openstack-nova-scheduler.service \
  openstack-nova-conductor.service openstack-nova-novncproxy.service
```
```bash
systemctl start openstack-nova-api.service \
  openstack-nova-consoleauth.service openstack-nova-scheduler.service \
  openstack-nova-conductor.service openstack-nova-novncproxy.service
```
### 因为本人电脑无法开启VT-x虚拟化，所以这个nova服务是启动不了的，日后再测试，现在不影响接下来的搭建
## 将compute节点添加到cell数据库
1. 获取管理员凭据以启用仅限管理员的 CLI 命令，然后确认 数据库中有计算主机：
  - . admin-openrc
  - `openstack compute service list --service nova-compute`↓为官方结果，本人测试无计算节点，理由如上↑
  ```bash
  +----+-------+--------------+------+-------+---------+----------------------------+
  | ID | Host  | Binary       | Zone | State | Status  | Updated At                 |
  +----+-------+--------------+------+-------+---------+----------------------------+
  | 1  | node1 | nova-compute | nova | up    | enabled | 2017-04-14T15:30:44.000000 |
  +----+-------+--------------+------+-------+---------+----------------------------+
  ```
2. 发现compute节点主机
  - `su -s /bin/sh -c "nova-manage cell_v2 discover_hosts --verbose" nova`
3. 添加新compute节点时，必须在controller节点上运行以注册这些新compute节点。或者，您可以在以下位置设置适当的间隔：`vi /etc/nova/nova.conf`
  ```vim
  [scheduler]
  discover_hosts_in_cells_interval = 300
  ```
## 验证compute
1. 获取凭据以获取对仅限管理员的 CLI 命令的访问权限：admin
  - `. admin-openrc`
  ```bash
  +----+------------------+------------+----------+---------+-------+----------------------------+
  | ID | Binary           | Host       | Zone     | Status  | State | Updated At                 |
  +----+------------------+------------+----------+---------+-------+----------------------------+
  |  1 | nova-conductor   | controller | internal | enabled | up    | 2022-12-05T08:26:30.000000 |
  |  2 | nova-scheduler   | controller | internal | enabled | up    | 2022-12-05T08:26:32.000000 |
  |  3 | nova-consoleauth | controller | internal | enabled | up    | 2022-12-05T08:26:32.000000 |   这一条是官网的日志添加的
  |  4 | nova-compute     | compute1   | nova     | enabled | up    | 2016-02-09T23:11:20.000000 |  ←我因为没有开启虚拟化所以
  +----+------------------+------------+----------+---------+-------+----------------------------+   我检测不到nova-compute
  ```
2. 列出标识服务中的API终端点，以验证身份服务：
  - `openstack catalog list`
  ```bash
  +-----------+-----------+-----------------------------------------+
  | Name      | Type      | Endpoints                               |
  +-----------+-----------+-----------------------------------------+
  | placement | placement | RegionOne                               |
  |           |           |   public: http://controller:8778        |
  |           |           | RegionOne                               |
  |           |           |   admin: http://controller:8778         |
  |           |           | RegionOne                               |
  |           |           |   internal: http://controller:8778      |
  |           |           |                                         |
  | keystone  | identity  | RegionOne                               |
  |           |           |   internal: http://controller:5000/v3/  |
  |           |           | RegionOne                               |
  |           |           |   public: http://controller:5000/v3/    |
  |           |           | RegionOne                               |
  |           |           |   admin: http://controller:5000/v3/     |
  |           |           |                                         |
  | glance    | image     | RegionOne                               |
  |           |           |   public: http://controller:9292        |
  |           |           | RegionOne                               |
  |           |           |   admin: http://controller:9292         |
  |           |           | RegionOne                               |
  |           |           |   internal: http://controller:9292      |
  |           |           |                                         |
  | nova      | compute   | RegionOne                               |
  |           |           |   internal: http://controller:8774/v2.1 |
  |           |           | RegionOne                               |
  |           |           |   admin: http://controller:8774/v2.1    |
  |           |           | RegionOne                               |
  |           |           |   public: http://controller:8774/v2.1   |
  |           |           |                                         |
  +-----------+-----------+-----------------------------------------+
  ```
3. 在image服务中列出镜像以验证与image服务的的连接：
  - `openstack image list`
  ```bash
  +--------------------------------------+--------+--------+
  | ID                                   | Name   | Status |
  +--------------------------------------+--------+--------+
  | bc7255cc-ce0e-4d5a-815d-a43f8d155476 | cirros | active |
  +--------------------------------------+--------+--------+
  ```
4. 检查cell和PlacementAPI 是否正常工作：
  - `nova-status upgrade check`
  ```bash
  Option "os_region_name" from group "placement" is deprecated. Use option "region-name" from group "placement".  
  # ↑本条回显未检查原因，官网没有此条回显
  # 本人怀疑是nova.conf中的placement配置有问题
  +--------------------------------------------------------------------+
  | Upgrade Check Results                                              |
  +--------------------------------------------------------------------+
  | Check: Cells v2                                                    |
  | Result: Success                                                    |
  | Details: No host mappings or compute nodes were found. Remember to |
  |   run command 'nova-manage cell_v2 discover_hosts' when new        |
  |   compute hosts are deployed.                                      |
  +--------------------------------------------------------------------+
  | Check: Placement API                                               |
  | Result: Success                                                    |
  | Details: None                                                      |
  +--------------------------------------------------------------------+
  | Check: Resource Providers                                          |
  | Result: Success                                                    |
  | Details: There are no compute resource providers in the Placement  |
  |   service nor are there compute nodes in the database.             |
  |   Remember to configure new compute nodes to report into the       |
  |   Placement service. See                                           |
  |   https://docs.openstack.org/nova/latest/user/placement.html       |
  |   for more details.                                                |
  +--------------------------------------------------------------------+
  | Check: Ironic Flavor Migration                                     |
  | Result: Success                                                    |
  | Details: None                                                      |
  +--------------------------------------------------------------------+
  | Check: API Service Version                                         |
  | Result: Success                                                    |
  | Details: None                                                      |
  +--------------------------------------------------------------------+
  ```
## 安装配置neutron服务
### 配置neutron数据库
1. 获得权限`. admin-openrc`，然后访问数据库：`mysql -u root -p`
   - 创建数据库neutron：`CREATE DATABASE neutron;`
   - 授予对数据库的适当访问权限，并替换为合适的密码：neutron,NEUTRON_DBPASS
    ```sql
    GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'localhost' \
    IDENTIFIED BY '000000';
    GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'%' \
    IDENTIFIED BY '000000';
    GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'controller' \
    IDENTIFIED BY '000000';
    GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'compute' \
    IDENTIFIED BY '000000';
    ```
  - ctrl+c退出
1. 创建服务凭据；
  - 创建neutron用户：`openstack user create --domain default --password-prompt neutron`
  ```bash
  User Password:
  Repeat User Password:
  +---------------------+----------------------------------+
  | Field               | Value                            |
  +---------------------+----------------------------------+
  | domain_id           | default                          |
  | enabled             | True                             |
  | id                  | ab80f80298e64cbaa44a7e48b1d42603 |
  | name                | neutron                          |
  | options             | {}                               |
  | password_expires_at | None                             |
  +---------------------+----------------------------------+
  ```
  - 将角色添加给用户adminneutron：`openstack role add --project service --user neutron admin`，没有回显！
  - 创建neutron服务实体：
  ```bash
  openstack service create --name neutron \
  --description "OpenStack Networking" network
  ```
  ```bash
  +-------------+----------------------------------+
  | Field       | Value                            |
  +-------------+----------------------------------+
  | description | OpenStack Networking             |
  | enabled     | True                             |
  | id          | aa00d631c46b4f8386dc548b907fa053 |
  | name        | neutron                          |
  | type        | network                          |
  +-------------+----------------------------------+
  ```
2. 创建网络服务API终端节点：
  ```bash
  openstack endpoint create --region RegionOne \
  network public http://controller:9696
  ```
  ```bash
  +--------------+----------------------------------+
  | Field        | Value                            |
  +--------------+----------------------------------+
  | enabled      | True                             |
  | id           | 0c857e4423974525b7952397ad5a5995 |
  | interface    | public                           |
  | region       | RegionOne                        |
  | region_id    | RegionOne                        |
  | service_id   | aa00d631c46b4f8386dc548b907fa053 |
  | service_name | neutron                          |
  | service_type | network                          |
  | url          | http://controller:9696           |
  +--------------+----------------------------------+
  ```
  ```bash
  openstack endpoint create --region RegionOne \
  network internal http://controller:9696
  ```
  ```bash
  +--------------+----------------------------------+
  | Field        | Value                            |
  +--------------+----------------------------------+
  | enabled      | True                             |
  | id           | b82a99dc46324cebb7985e9998bc37b3 |
  | interface    | internal                         |
  | region       | RegionOne                        |
  | region_id    | RegionOne                        |
  | service_id   | aa00d631c46b4f8386dc548b907fa053 |
  | service_name | neutron                          |
  | service_type | network                          |
  | url          | http://controller:9696           |
  +--------------+----------------------------------+
  ```
  ```bash
  openstack endpoint create --region RegionOne \
  network admin http://controller:9696
  ```
  ```bash
  +--------------+----------------------------------+
  | Field        | Value                            |
  +--------------+----------------------------------+
  | enabled      | True                             |
  | id           | ea1f590556354dc8995b25bb907dbe2f |
  | interface    | admin                            |
  | region       | RegionOne                        |
  | region_id    | RegionOne                        |
  | service_id   | aa00d631c46b4f8386dc548b907fa053 |
  | service_name | neutron                          |
  | service_type | network                          |
  | url          | http://controller:9696           |
  +--------------+----------------------------------+
  ```
### 配置neutron-Self-service模式
1. 安装neutron组件
  ```bash
  yum install openstack-neutron openstack-neutron-ml2 \
  openstack-neutron-linuxbridge ebtables
  ```
- 编辑文件并完成以下编辑：`vi /etc/neutron/neutron.conf`
  - 在配置文件的[database]组中
  ```vim
  [database]
  # ...
  connection = mysql+pymysql://neutron:000000@controller/neutron
  ```
  - 在[DEFAULT]组中：
  ```vim
  [DEFAULT]
  # ...
  core_plugin = ml2 #启用模块化第 2 层 （ML2） 插件、路由器服务和重叠的 IP 地址
  service_plugins = router
  allow_overlapping_ips = true
  transport_url = rabbit://openstack:000000@controller #配置消息队列访问
  auth_strategy = keystone  #配置keystone身份认证
  notify_nova_on_port_status_changes = true #网络配置为通知计算网络拓扑更改
  notify_nova_on_port_data_changes = true
  ```
  - 在[keystone_authtoken]组中：
  ```vim
  auth_uri = http://controller:5000
  auth_url = http://controller:5000
  memcached_servers = controller:11211
  auth_type = password
  project_domain_name = default
  user_domain_name = default
  project_name = service
  username = neutron
  password = 000000
  ```
  - 在[nova]组中：
  ```vim
  auth_url = http://controller:5000
  auth_type = password
  project_domain_name = default
  user_domain_name = default
  region_name = RegionOne
  project_name = service
  username = nova
  password = 000000
  ```
  - 在[oslo_concurrency]组中：
  ```vim
  [oslo_concurrency]
  # ...
  lock_path = /var/lib/neutron/tmp
  ```
### 配置模块化第 2 层 （ML2） 插件
ML2 插件使用 Linux 桥接机制构建第 2 层（桥接 和交换）实例的虚拟网络基础结构。
1. 编辑文件并完成 以下操作：`vi /etc/neutron/plugins/ml2/ml2_conf.ini`
- 在[ml2]组中：
```vim
[ml2]
# ...
type_drivers = flat,vlan,vxlan
tenant_network_types = vxlan
mechanism_drivers = linuxbridge,l2population
extension_drivers = port_security
```
- 在[ml2_type_flat]组中：
```vim
[ml2_type_flat]
# ...
flat_networks = provider
```
- 在[ml2_type_vxlan]组中：
```vim
[ml2_type_vxlan]
# ...
vni_ranges = 1:1000
```
- 在[securitygroup]组中：
```vim
[securitygroup]
# ...
enable_ipset = true
```
### 配置 Linux 网桥代理
1. Linux 网桥代理构建第 2 层（桥接和交换）虚拟 实例的网络基础设施和处理安全组。
- 编辑文件并 完成以下操作：`vi /etc/neutron/plugins/ml2/linuxbridge_agent.ini`
  - 在[linux_bridge]小节中：ens35是我192.168.200.10的网卡
  ```vim
  [linux_bridge]
  physical_interface_mappings = provider:ens35
  ```
  - 在[vxlan]组中，配置处理覆盖的物理网络接口的IP地址：192.168.100.10是我ens34用来管理的网卡IP
  ```vim
  [vxlan]
  enable_vxlan = true
  local_ip = 192.168.100.10
  l2_population = true
  ```
  - 在[securitygroup]组中：启用安全组和 配置 Linux 网桥 iptables 防火墙驱动程序：
  ```vim
  [securitygroup]
  # ...
  enable_security_group = true
  firewall_driver = neutron.agent.linux.iptables_firewall.IptablesFirewallDriver
  ```
### 配置第三层代理
1. DHCP 代理为虚拟网络提供 DHCP 服务。
   - 编辑文件并完成以下操作：`vi /etc/neutron/dhcp_agent.ini`
     - 在[DEFAULT]组中：Dnsmasq DHCP 驱动程序，并启用隔离的元数据，以便提供程序上的实例 网络可以通过网络访问元数据
  ```vim
  interface_driver = linuxbridge
  dhcp_driver = neutron.agent.linux.dhcp.Dnsmasq
  enable_isolated_metadata = true
  ```
### 配置 DHCP 代理
DHCP 代理为虚拟网络提供 DHCP 服务。
1. 编辑文件并完成以下操作：`vi /etc/neutron/dhcp_agent.ini`
- 在配置网桥接口驱动程序的部分中， Dnsmasq DHCP 驱动程序，并启用隔离的元数据，以便提供程序上的实例 网络可以通过网络访问元数据：[DEFAULT]
```vim
[DEFAULT]
# ...
interface_driver = linuxbridge
dhcp_driver = neutron.agent.linux.dhcp.Dnsmasq
enable_isolated_metadata = true
```
### 配置元数据代理
元数据代理提供配置信息 例如实例的凭证。
1. 编辑文件并完成以下操作：`vi /etc/neutron/metadata_agent.ini`
- 在[DEFAULT]组中：
```vim
[DEFAULT]
# ...
nova_metadata_host = controller
metadata_proxy_shared_secret = 000000
```
### 将compute服务配置为使用网络服务
1. 编辑文件并执行以下操作：`vi /etc/nova/nova.conf`
- 在配置访问参数的章节中，启用 元数据代理，并配置密钥：[neutron]
```vim
[neutron]
# ...
url = http://controller:9696
auth_url = http://controller:5000
auth_type = password
project_domain_name = default
user_domain_name = default
region_name = RegionOne
project_name = service
username = neutron
password = 000000
service_metadata_proxy = true
metadata_proxy_shared_secret = 000000
```
### 完成controller节点的neutron安装
1. 网络服务初始化脚本需要指向 ML2 插件配置的符号链接 文件。如果这个象征性 链接不存在，请使用以下命令创建它：`ln -s /etc/neutron/plugins/ml2/ml2_conf.ini /etc/neutron/plugin.ini`
2. 填充数据库
```bash
su -s /bin/sh -c "neutron-db-manage --config-file /etc/neutron/neutron.conf \
--config-file /etc/neutron/plugins/ml2/ml2_conf.ini upgrade head" neutron
```
3. 重新启动computeAPI服务：`systemctl restart openstack-nova-api.service`
4. 启动网络服务并将其配置为在系统启动时启动:
```bash
systemctl enable neutron-server.service \
  neutron-linuxbridge-agent.service neutron-dhcp-agent.service \
  neutron-metadata-agent.service

systemctl start neutron-server.service \
  neutron-linuxbridge-agent.service neutron-dhcp-agent.service \
  neutron-metadata-agent.service
```
5. 对于网络选项 2，还要启用并启动第 3 层服务：
`systemctl enable neutron-l3-agent.service`
`systemctl start neutron-l3-agent.service`
## 安装配置DashBoard服务
### 安装和配置DashBoard组件
1. 安装dashboard软件包：`yum install openstack-dashboard`
2. 编辑文件并完成以下操作：`vi /etc/openstack-dashboard/local_settings`
- 配置仪表板以在节点上使用 OpenStack 服务：controller
- 配置会话存储服务memcached，第188和第38行：
```vim
OPENSTACK_HOST = "controller"
ALLOWED_HOSTS = ['*']
```
- 第158行添加，且注释掉159行开始的其他的CACHES配置文件
```vim
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
CACHES = {
    'default': {
         'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
         'LOCATION': 'controller:11211',
    }
}
```
- 取消注释并且给更改为启用对域的支持，第73行：
```vim
OPENSTACK_KEYSTONE_MULTIDOMAIN_SUPPORT = True
```
- 启用keystoneAPI版本3，第189行：
```vim
OPENSTACK_KEYSTONE_URL = "http://%s:5000/v3" % OPENSTACK_HOST
```
- 配置API版本，第640行，取消注释并且更改为：
```vim
OPENSTACK_API_VERSIONS = {
    "identity": 3,
    "image": 2,
    "volume": 2,
}
```
- 配置为您创建的用户的默认域 通过仪表板，第95行：
```vim
OPENSTACK_KEYSTONE_DEFAULT_DOMAIN = "Default"
```
- 配置为默认角色 通过仪表板创建的用户，第190行，
```vim
OPENSTACK_KEYSTONE_DEFAULT_ROLE = "user"
```
- **如果选择网络选项 1**，请禁用对第 3 层的支持 网络服务（本人选择的是网络选项2），所以**没执行以下步骤**：
```vim
OPENSTACK_NEUTRON_NETWORK = {
    ...
    'enable_router': False,
    'enable_quotas': False,
    'enable_distributed_router': False,
    'enable_ha_router': False,
    'enable_lb': False,
    'enable_firewall': False,
    'enable_vpn': False,
    'enable_fip_topology_check': False,
}
```
- *（可选项）*第463行配置时区[参考时区表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)，CST是亚洲上海时区：
```vim
TIME_ZONE = "CST"
```
- 如果没有以下内容，请手动添加进去：`vi /etc/httpd/conf.d/openstack-dashboard.conf`
```vim
WSGIApplicationGroup %{GLOBAL}
```

# Compute节点配置
## 安装配置Nova计算服务
1. 安装nova软件包：
  - `yum install openstack-nova-compute`
    - 若有类似以下的报错：
      ```bash
      Error: Package: 1:openstack-nova-compute-17.0.13-1.el7.noarch (centos-openstack-queens)
             Requires: qemu-kvm-rhev >= 2.10.0
      ```
    - 新建一个repo库文件：`vi /etc/yum.repos.d/名字任意.repo`
    - 在里面写入配置文件：
      ```vim
      [Virt]
      #也是任意名字
      name=CentOS-$releasever - Base
      #随便编一个名字
      release=$releasever&arch=$basearch&repo=os&infra=$infra
      baseurl=http://mirrors.sohu.com/centos/7/virt/x86_64/kvm-common/
      enable=1
      gpgcheck=0
      gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
      ```
    - 再执行yum安装程序即可正常安装
  - 修改nova的配置文件：`vi /etc/nova/nova.conf`
    - 在[DEFAULT]小节中启用only the compute and metadata APIs：
      ```vim
      [DEFAULT]
      # ...
      enabled_apis = osapi_compute,metadata
      ```
      - 在[DEFAULT]小节中配置消息队列设置
        ```vim
        [DEFAULT]
        # ...
        transport_url = rabbit://openstack:000000@controller
        ```
      - 在[api]小节和[keystone_authtoken]小节中配置keystone设置：
        ```vim
          [api]
          # ...
          auth_strategy = keystone

          [keystone_authtoken]
          # ...
          auth_url = http://controller:5000/v3
          memcached_servers = controller:11211
          auth_type = password
          project_domain_name = default
          user_domain_name = default
          project_name = service
          username = nova
          password = 000000
          ```
      - 在[DEFAULT]小节中配置my_ip并且启用对网络服务的支持：
        ```vim
        [DEFAULT]
        # ...
        my_ip = 192.168.100.20
      
        [DEFAULT]
        # ...
        use_neutron = True
        firewall_driver = nova.virt.firewall.NoopFirewallDriver
        ```
        > 记得禁用服务器的防火墙
      - 在[vnc]小节中启用和配置远程控制台访问：
        ```vim
        [vnc]
        # ...
        enabled = True
        server_listen = 0.0.0.0
        server_proxyclient_address = 192.168.100.20
        novncproxy_base_url = http://controller:6080/vnc_auto.html
        ```
      - 在[glance]小节中配置glance服务的接口：
        ```vim
        [glance]
        # ...
        api_servers = http://controller:9292
        ```
      - 在[oslo_concurrency]小节中配置绝对路径：
        ```vim 
        [oslo_concurrency]
        # ...
        lock_path = /var/lib/nova/tmp
        ```
      - 在[placement]小节中配置API：
        ```vim
        [placement]
        # ...
        os_region_name = RegionOne
        project_domain_name = Default
        project_name = service
        auth_type = password
        user_domain_name = Default
        auth_url = http://controller:5000/v3
        username = placement
        password = 000000
        ```
1. 完成nova的安装
  - 确定compute节点是否支持硬件加速虚拟机：
    - `egrep -c '(vmx|svm)' /proc/cpuinfo`
      - 若返回1，则支持
      - 若返回0，则不支持，需要修改配置文件为使用QEMU：
      - 在[libvirt]小节中：
        ```vim
        [libvirt]
        # ...
        virt_type = qemu
        ```
1.  启动计算服务（包括其依赖项）并将其配置为自动启动：
  - `systemctl enable libvirtd.service openstack-nova-compute.service`
  - `systemctl start libvirtd.service openstack-nova-compute.service`
## 安装配置neutron服务
### 安装nertron组件：`yum install openstack-neutron-linuxbridge ebtables ipset`
### 配置通用组件
1. 编辑文件并完成以下操作：`vi /etc/neutron/neutron.conf`
- 在[DEFAULT]组中：
```vim
[DEFAULT]
# ...
transport_url = rabbit://openstack:0000000@controller
auth_strategy = keystone
```
- 在[keystone_authtoken]组中：
```vim
[keystone_authtoken]
# ...
auth_uri = http://controller:5000
auth_url = http://controller:5000
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = neutron
password = 000000
```
- 在[oslo_concurrency]中：
```vim
[oslo_concurrency]
# ...
lock_path = /var/lib/neutron/tmp
```
### 配置 Linux 网桥代理
Linux 网桥代理构建第 2 层（桥接和交换）虚拟 实例的网络基础设施和处理安全组。
1. 编辑文件并 完成以下操作：`vi /etc/neutron/plugins/ml2/linuxbridge_agent.ini`
- 将提供程序虚拟网络映射到 提供程序物理网络接口：[linux_bridge]
ens35：外网网卡名
```vim
[linux_bridge]
physical_interface_mappings = provider:ens35
```
- 在启用 VXLAN 覆盖网络部分中，配置 处理覆盖的物理网络接口的 IP 地址 网络，并启用第 2 层填充：[vxlan]
192.168.100.10为计算节点管理IP
```vim
[vxlan]
enable_vxlan = true
local_ip = 192.168.100.20
l2_population = true
```
- 在部分中，启用安全组和 配置 Linux 网桥 iptables 防火墙驱动程序：[securitygroup]
```vim
[securitygroup]
# ...
enable_security_group = true
firewall_driver = neutron.agent.linux.iptables_firewall.IptablesFirewallDriver
```
### 将compute服务配置为使用网络服务
1. 编辑文件并完成以下操作：`vi /etc/nova/nova.conf`
- 在[neutron]组中
```vim
[neutron]
# ...
url = http://controller:9696
auth_url = http://controller:5000
auth_type = password
project_domain_name = default
user_domain_name = default
region_name = RegionOne
project_name = service
username = neutron
password = 000000
```
### 完成compute节点的neutron安装
1. 重新启动计算服务：`systemctl restart openstack-nova-compute.service`
2. 启动 Linux 网桥代理并将其配置为在 系统引导：
- `systemctl enable neutron-linuxbridge-agent.service`
- `systemctl start neutron-linuxbridge-agent.service`
## 验证nertorn搭建情况
1. 先执行之前做好的`. admin-openrc`脚本
2. 执行`openstack network agent list`
3. 得到以下回显，即为输出应指示controller节点上的四个代理和一个 每个计算节点上的代理。
```bash
+--------------------------------------+--------------------+------------+-------------------+-------+-------+---------------------------+
| ID                                   | Agent Type         | Host       | Availability Zone | Alive | State | Binary                    |
+--------------------------------------+--------------------+------------+-------------------+-------+-------+---------------------------+
| 135f877c-4249-44f1-8c43-9b37b92f8e35 | DHCP agent         | controller | nova              | :-)   | UP    | neutron-dhcp-agent        |
| a0f7b032-8f05-4fed-9a26-4c52773ed48a | L3 agent           | controller | nova              | :-)   | UP    | neutron-l3-agent          |
| ad2fd49e-7c44-43b1-a10c-cad6de3b513b | Metadata agent     | controller | None              | :-)   | UP    | neutron-metadata-agent    |
| cd7199d3-a64a-430b-b0e6-96a41417c361 | Linux bridge agent | controller | None              | :-)   | UP    | neutron-linuxbridge-agent |
+--------------------------------------+--------------------+------------+-------------------+-------+-------+---------------------------+
```
# 完成！
> 历时三天半，写了1476行笔记，终于完成了OpenStack的平台搭建
> 虽然还没办法启用compute计算节点服务，但是我只要去开启了虚拟化的平台启用nova服务即可
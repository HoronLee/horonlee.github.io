---
title: 脚本练习1
businesscard: true
date: 2023-10-09 11:35:31
updated:
tags:
    - Linux
    - 运维
categories:
    - 服务器运维
excerpt: 我觉得我写这个也太无聊了
---

> 为了练习shell脚本编写能力，我以比赛文档中部署java商城的流程来编写一键脚本，目前写了一半
<!-- more -->
```shell
#!/bin/bash

echo "======开始执行脚本======"

# 使用本脚本之前请保证CentOS的DVD源已正常挂载，且gpmall的资源文件也放在同级目录！

# # 检测yum源状态
# yum clean all > /dev/null
# repolist=$(yum repolist)
# # 检查结果中是否包含"repolist"关键字，表示yum源可用
# if [ $repolist == *"repolist: 0"* ](%20%24repolist%20%3D%3D%20*%22repolist%3A%200%22*%20); then
#     echo "Yum源不可用"
# else
#     # 检查是否有status的值为4070的仓库
#     if [ $repolist == *"4,070"* ](%20%24repolist%20%3D%3D%20*%224%2C070%22*%20); then
#         echo "Yum源可用且软件包正常!"
#     else
#         echo "Yum源可用但软件包数量异常!"
#     fi
# fi

# # 使用SSH连接到远程主机并执行命令
# ssh $username@$remote_host $command

# 关闭selinux
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux


# 检查sshpass软件包是否存在
if [ -f "sshpass-1.06-2.el7.x86_64.rpm" ]; then
    # 安装当前目录下的sshpass软件包
    rpm -ivh sshpass-1.06-2.el7.x86_64.rpm
else
    # 进入gpmall-cluster文件夹
    cd gpmall-cluster
    
    # 检查sshpass软件包是否存在
    if [ -f "sshpass-1.06-2.el7.x86_64.rpm" ]; then
        # 安装gpmall-cluster文件夹中的sshpass软件包
        rpm -ivh sshpass-1.06-2.el7.x86_64.rpm
    else
        echo "未找到sshpass-1.06-2.el7.x86_64.rpm软件包文件，脚本终止!"
        exit 1
    fi
    
    # 返回上级目录
    cd ..
fi

# 更改主机名变量准备
# 设置免密登录用户名和密码
echo "接下来请输入更改主机名相关的脚本变量"
echo "直接回车则采用[用户名: root]"
read -p "->请输入免密登录的用户名: " USERNAME
# 如果用户名为空，则将其设置为默认值root
if [ -z $USERNAME ](%20-z%20%24USERNAME%20); then
  USERNAME="root"
fi
echo "直接回车则采用[密码: 000000]"
read -s -p "->请输入免密登录的密码: " PASSWORD
echo
# 如果密码为空，则将其设置为默认值000000
if [ -z $PASSWORD ](%20-z%20%24PASSWORD%20); then
  PASSWORD="000000"
fi
# 网络IP配置
read -p "->请输入集群的内网网卡名(直接回车默认eth0): " IntranetNIC
if [ -z $IntranetNIC ](%20-z%20%24IntranetNIC%20); then
  IntranetNIC="eth0"
fi
# 执行脚本的节点IP和主机名
read -p "->请输入执行脚本的节点IP(直接回车默认eth0的IP): " EXECUTOR_IP
if [ -z $EXECUTOR_IP ](%20-z%20%24EXECUTOR_IP%20); then
  EXECUTOR_IP=$(ip addr show $IntranetNIC | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

fi
read -p "->请输入执行脚本的节点主机名(直接回车默认mycat): " EXECUTOR_HOSTNAME
if [ -z $EXECUTOR_HOSTNAME ](%20-z%20%24EXECUTOR_HOSTNAME%20); then
  EXECUTOR_HOSTNAME="mycat"
fi
# 子节点1的IP和主机名
read -p "->请输入子节点1的IP: " NODE1_IP
read -p "->请输入子节点1的主机名(直接回车默认db1): " NODE1_HOSTNAME
if [ -z $NODE1_HOSTNAME ](%20-z%20%24NODE1_HOSTNAME%20); then
  NODE1_HOSTNAME="db1"
fi
# 子节点2的IP和主机名
read -p "->请输入子节点2的IP: " NODE2_IP
read -p "->请输入子节点2的主机名(直接回车默认db2): " NODE2_HOSTNAME
if [ -z $NODE2_HOSTNAME ](%20-z%20%24NODE2_HOSTNAME%20); then
  NODE2_HOSTNAME="db2"
fi

# 执行更改主机名的命令
echo "<-开始更改各节点的主机名"
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EXECUTOR_IP "hostnamectl set-hostname $EXECUTOR_HOSTNAME"
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$NODE1_IP "hostnamectl set-hostname $NODE1_HOSTNAME"
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$NODE2_IP "hostnamectl set-hostname $NODE2_HOSTNAME"
# host批量更改
# 写入本机host规则到hosts文件
echo "$EXECUTOR_IP $EXECUTOR_HOSTNAME" >> /etc/hosts
echo "$NODE1_IP $NODE1_HOSTNAME" >> /etc/hosts
echo "$NODE2_IP $NODE2_HOSTNAME" >> /etc/hosts
# 免密登陆
echo "配置免密登陆"
# 删除已存在的密钥指纹
rm -rf /root/.ssh/id_rsa*
echo "生成新密钥"
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ''
sshpass -p "$PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no root@"$NODE1_HOSTNAME"
sshpass -p "$PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no root@"$NODE2_HOSTNAME"
sed -i '3,$d' "/etc/hosts"
# 拷贝hosts文件到子节点
scp /etc/hosts root@$NODE1_IP:/etc/hosts
scp /etc/hosts root@$NODE2_IP:/etc/hosts
# 测试host连通性
ping -c 1 $NODE1_HOSTNAME > /dev/null
if [ $? -eq 0 ]; then
    echo "节点 ($NODE1_HOSTNAME) 可达."
else
    echo "节点 ($NODE1_HOSTNAME) 不可达."
    exit 1
fi

ping -c 1 $NODE2_HOSTNAME > /dev/null
if [ $? -eq 0 ]; then
    echo "节点 ($NODE2_HOSTNAME) 可达."
else
    echo "节点 ($NODE2_HOSTNAME) 不可达."
    exit 1
fi

# 导出变量文件并分发给两个子节点
echo "分发变量文件"
cat << EOF > variables.sh
USERNAME=$USERNAME
PASSWORD=$PASSWORD
EXECUTOR_HOSTNAME=$EXECUTOR_HOSTNAME
NODE1_HOSTNAME=$NODE1_HOSTNAME
NODE2_HOSTNAME=$NODE2_HOSTNAME
EXECUTOR_IP=$EXECUTOR_IP
NODE1_IP=$NODE1_IP
NODE2_IP=$NODE2_IP
EOF
scp variables.sh root@$NODE1_IP:/root/
scp variables.sh root@$NODE2_IP:/root/

# 检测是否存在gpmall-cluster文件夹
if [ -d "gpmall-cluster" ]; then
    echo "当前目录下已存在gpmall-cluster文件夹，无需解压。"
    echo "将gpmall仓库转移到/opt"
    cp -rf /root/gpmall-cluster/gpmall-repo /opt/
else
    # 检测是否存在gpmall-cluster.tar.gz压缩包
    if [ -e "gpmall-cluster.tar.gz" ]; then
        # 解压gpmall-cluster.tar.gz压缩包
        echo "正在解压gpmall-cluster.tar.gz压缩包..."
        tar -zxf gpmall-cluster.tar.gz -C /opt/
        echo "将gpmall仓库转移到/opt"
        # cp -rf /root/gpmall-cluster/gpmall-repo /opt/
    else
        echo "gpmall-cluster.tar.gz压缩包不存在于本目录，脚本终止。"
        exit 1
    fi
fi


# 清空所有主机原有yum源
mv -f /etc/yum.repos.d/* /media/
ssh $USERNAME@$NODE1_HOSTNAME mv -f /etc/yum.repos.d/* /media/
ssh $USERNAME@$NODE2_HOSTNAME mv -f /etc/yum.repos.d/* /media/

# 配置所有yum源
# 配置主节点yum源
cat << EOF > /etc/yum.repos.d/local.repo
[centos]
name=centos
baseurl=http://172.30.26.22/centos/
gpgcheck=0
enabled=1

[mariadb]
name=mariadb
baseurl=file:///opt/gpmall-repo
gpgcheck=0
enabled=1
EOF

# 安装vsftpd
yum install -y vsftpd
# 修改vsftpd的配置文件
echo "anon_root=/opt/" >> /etc/vsftpd/vsftpd.conf
# 启动vsftpd并设置开机自启
systemctl start vsftpd
systemctl restart vsftpd
systemctl enable vsftpd


# 配置子节点yum源
touch node.repo
cat << EOF > node.repo
[centos]
name=centos
baseurl=http://172.30.26.22/centos/
gpgcheck=0
enabled=1

[mariadb]
name=mariadb
baseurl=ftp://$EXECUTOR_HOSTNAME/gpmall-repo
gpgcheck=0
enabled=1
EOF
scp node.repo root@$NODE1_IP:/etc/yum.repos.d/node.repo
scp node.repo root@$NODE2_IP:/etc/yum.repos.d/node.repo
rm -rf node.repo

echo "======脚本执行完毕======"
```

其中sshpass软件包在CentOS基础repo中没有包含，需要update或者从rpm进行安装，在此我推荐一个linux软件包下载网站[Packages for Linux and Unix (pkgs.org)](https://pkgs.org/)

里面提供了绝大多数可以直接下载的软件包，并且会列出其依赖包方便安装，十分方便！

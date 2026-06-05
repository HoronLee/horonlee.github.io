---
title: 配置NoVNC连接Kvm虚拟机
date: 2025-09-19 14:31:04
tags:
  - NoVNC
categories:
  - Linux
  - KVM
cover: /attachment/配置NoVNC连接Kvm虚拟机/2230097ef916372114bf21e33063a3e2.png
dg-publish: true
---
## 虚拟机显示器输出设置
通过virsh或者virt-manager查看虚拟机的显示定义，其中类型需要是vnc；端口最好是autoport，这样会自动生成可用的端口，一般从5900自增；监听IP最好为0.0.0.0也就是监听所有接口，下面会说明如何设置默认监听IP
```
<graphics type="vnc" port="5900" autoport="yes" listen="0.0.0.0">
  <listen type="address" address="0.0.0.0"/>
</graphics>
```
## 需要用的软件

> [novnc/noVNC: VNC client web application](https://github.com/novnc/noVNC)
>
> [novnc/websockify: Websockify is a WebSocket to TCP proxy/bridge. This allows a browser to connect to any application/server/service.](https://github.com/novnc/websockify)
## 更改vnc监听默认设置

打开配置文件`sudo vim /etc/libvirt/qemu.conf`，取消注释`#vnc_listen = "0.0.0.0"`
## 获得客户机的显示器编号

由此可见默认是显示器0，不过这和下文没有任何关系，仅作演示
```
➜  ~ sudo virsh vncdisplay rocky9
:0
```
## 启动NoVNC

`➜  noVNC git:(master) sudo ./utils/novnc_proxy --vnc 127.0.0.1:5900`
## 单端口多代理

novnc实际上会自动启动一个websockify实例，novnc只是一个前端，实现vnc信号从tcp转化为websocket协议的是websockify这个软件，我们现在只需要一个websockify实例就可以单端口多代理。需要使用独立的websockify，官方wiki：[novnc/websockify 维基](https://github.com/novnc/websockify/wiki/Token-based-target-selection)

设置token文件，格式为`[token名]: [vnc的IP]:[vnc的端口]`，一行一个虚拟机
```
➜  websockify git:(master) ✗ cat token/kvm.conf
rocky9: 127.0.0.1:5900
rocky9-clone: 127.0.0.1:5901
```
启动websockify的时候带上token文件位置参数`sudo ./run --token-plugin TokenFile --token-source ./token/kvm.conf 6080`

此时6080被占用，所以我们需要再为novnc的网页前端配置http服务，此步骤略

原本的NoVNC网址是`http://192.168.6.166:6081/?host=192.168.6.166&port=6080&path=websockify`

为了按照token选择不同的vncserver，我们需要在后方加上路由参数`/?token=rocky9`
所以最终是
`http://192.168.6.166:6081/?host=192.168.6.166&port=6080&path=websockify/?token=rocky9`
## 最终效果
![](/attachment/配置NoVNC连接Kvm虚拟机/d7d4cce1369f648caab5106cc1e9a7b9.png)
![](/attachment/配置NoVNC连接Kvm虚拟机/0ee3ea21dfd6d72ca524b15ebe53e84a.png)

很好，我们已经实现了通过不同的路由参数，通过NoVNC访问不同的虚拟机！

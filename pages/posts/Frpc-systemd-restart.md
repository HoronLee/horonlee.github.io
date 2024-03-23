---
layout: post
title: 为Systemd服务设置自动重启
date: 2024-01-21 18:08:10
tags: 
    - Linux
categories: 
    - Linux
cover: 
hide: 
password: 
---

## 事情起因

最近给自己的双路E5搞一个Frpc，但是因为有Clash这个开机自启程序，并且我设置了系统代理，在Clash完全启动之前系统是处于断网状态的。断网状态下，Frpc会默认启动失败并且变为Inactive状态，这并不是我想看到的。

<!-- more -->

于是我上网查询了一下，于是乎找到了以下三个Systemd-[Service]参数

```ini
[Unit]
Description=frpc service
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
ExecStart=/Apps/frp_0.52.3_linux_amd64/frpc -c /Apps/frp_0.52.3_linux_amd64/frpc.toml
Restart=always // [!code ++]
RestartSec=5 // [!code ++]
StartLimitInterval=0 // [!code ++]

[Install]
WantedBy=multi-user.target
```

三个参数的作用分别是：

1. **Restart=always：** 指定服务在退出时总是重新启动。
2. **RestartSec=5：** 如果服务启动失败，指定在尝试重新启动之前等待的时间间隔，这里是 5 秒。
3. **StartLimitInterval=0：** 指定尝试启动服务的最小时间间隔。在这里设置为 0 表示没有最小间隔，可以立即尝试重新启动服务。

随后只要执行`systemctl daemon-reload`就可以放心重启机器，让Frpc自由启动了！
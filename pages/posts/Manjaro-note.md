---
title: Manjaro简易使用笔记
businesscard: true
date: 2023-03-06 15:27:43
tags:
  - Manjaro
  - Linux
categories:
  - Linux
  - Manjaro
cover: https://tse2-mm.cn.bing.net/th/id/OIP-C.jRjmiRGm54Nmhiggtb2pxQHaEK?pid=ImgDet&rs=1
---
> 安装过程很简单，很人性化，就不多说了

# 换软件源
> 因为在大陆，所以换一个快速的软件园非常重要
1. 打开firefox浏览器
2. 搜索ustc mirror
3. 进入网站首页，下拉找到Manjaro
4. 点击Manjaro那一行右边的help
5. 然后你就知道该怎么做了

# 安装中文输入法
> Linux KDE环境推荐fcitx5输入法，相较fcitx输入法有很好的体验升级
1. `sudo pacman -S fcitx5-im`

# 密码突然不对了
```bash
(base) [horonlee@horonlee-precisiontower7810 kubernetes]$ sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
[sudo] horonlee 的密码：
对不起，请重试。
[sudo] horonlee 的密码：
对不起，请重试。
[sudo] horonlee 的密码：
sudo: 3 次错误密码尝试
```
解决方法：`faillock --reset`
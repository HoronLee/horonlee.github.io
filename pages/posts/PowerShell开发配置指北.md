---
layout: post
title: PowerShell开发配置指北
date: 2024-10-10 14:47:39
tags: 
    - windows
    - powershell
categories: 
    - 开发
    - 环境配置
cover: https://bu.dusays.com/2024/10/10/67077952b2f10.png
password: 
hide: 
---

## 确保安装了“终端”应用

![image-20241010151031530](https://bu.dusays.com/2024/10/10/67077de8bc9fa.png)

这是必须的，windows11之前的“命令行”应用并不好用，色彩支持少、不支持多标签、自定义程度也非常低，所以我们需要使用微软最新推出的终端应用

## 安装Scoop

> [Scoop](https://scoop.sh/#/) 是 Windows 下的一款十分强大的包管理器，可以用来下载和管理各种软件包

打开 PowerShell 终端（版本 5.1 或更高版本），然后在 PS C：\> 提示符下运行：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

## 安装Oh My Posh

> [官网 | Oh My Posh](https://ohmyposh.dev/)是一个shell提示主题引擎，可以让你的终端使用体验和外观都得到很好的改善

![image-20241010151715719](https://bu.dusays.com/2024/10/10/67077f7ca41cb.png)

官方文档中有很多安装方式，我们这里选择scoop安装，并且后续的所有软件几乎都是通过scoop来安装的，这样做到了软件包管理的统一性。

⚠️：在安装之前，确保关闭了火绒、360等杀毒软件，否则OhMyPosh会被报毒，我的windows defender没有报毒，似乎没事（笑

先使用一下命令来安装

```powershell
scoop install https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/oh-my-posh.json
```

当终端末行出现绿色的“oh-my-posh (x.xx.x) was installed successfully!”的时候，这意味着OhMyPosh已经安装完成

这将安装以下几项内容：

- `oh-my-posh.exe`- Windows 可执行文件
- `themes`- 最新的 Oh My Posh [主题](https://ohmyposh.dev/docs/themes)

需要重新加载环境变量，建议重新启动你的终端（可以新开一个powershell标签页）

Oh My Posh还需要进行一些细化的配置才能到达最佳使用状态

### 安装Nerd Font

> [Nerd Fonts](https://www.nerdfonts.com/)是一种包含了很多额外的字符集的字体，用于显示各种小图标和特殊字体，这是后续很多软件所必需的

- 手动安装方式：进入官网https://www.nerdfonts.com/，点击Downloads，进入字体下载页面，选择一个自己喜欢的，下载下来并且解压、安装到windows中，我选择的是第一个“0xProto Nerd Font”，大家可以根据自己喜好选择！
- Scoop安装方式

```
scoop bucket add nerd-fonts
```

#### 设置终端默认字体

![image-20241010153505860](https://bu.dusays.com/2024/10/10/670783aaf322b.png)

从下拉框中进入默认值设置的外观选项

![image-20241010153549937](https://bu.dusays.com/2024/10/10/670783d6d7c3a.png)

将字体设定成自己下载安装的Nerd类型字体，在下方配置中，还有其他关于透明度等等的设置，可以自己按照喜好调试，记得点击右下角保存生效。

### 设置前置组件

#### posh-git

[posh-git](https://github.com/dahlbyk/posh-git) 可以在 `PowerShell` 中显示 `Git` 状态的摘要信息并自动补全 `Git` 命令。

通过 `scoop` 来安装，依次执行命令：

```
scoop bucket add extras
```

[![img](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628231945.png)](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628231945.png)

```
scoop install posh-git
```

[![img](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232008.png)](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232008.png)

#### Terminal-Icons

[![img](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232029.png)](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232029.png)

[Terminal-Icons](https://github.com/devblackops/Terminal-Icons) 可以在 `PowerShell` 中显示项目图标并以颜色区分。让你的 `Powershell` 变得更加的花哨。

通过 `scoop` 来安装，依次执行命令：

```
scoop bucket add extras
```

> 前文中已执行过该命令，此次可不在执行。

```
scoop install terminal-icons
```

[![img](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232046.png)](https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232046.png)

安装完成后，还贴心的提示了如何使用，执行`Import-Module Terminal-Icons`即可设置好小图标

## 配置Oh My Posh

> 完成上述的安装后，启动 `PowerShell` 时并不会默认加载个性化后的配置，因此需要修改 `PowerShell` 配置文件来让每次启动都加载。

执行命令打开配置文件：

```
notepad $PROFILE
```

若提示不存在文件，且提示是否创建文件，则直接创建，否则需要手动在 `PowerShell` 目录下创建一个配置文件再进行编辑。

手动新增配置文件：

```powershell
New-Item -Path $PROFILE -Type File -Force
```

在配置文件中添加一行配置文件

```json
# 使用 oh my posh
oh-my-posh init pwsh | Invoke-Expression
# 使用 Terminal-Icons
Import-Module Terminal-Icons
# 使用 posh-git
Import-Module posh-git
```

更改后，重新加载配置文件以使更改生效。（这条命令类似linux中的source /etc/profile）

```powershell
. $PROFILE
```

### 配置主题

首先使用以下命令获取可用主题（会弹出很多主题，可以自己一个一个看过去）

```powershell
Get-PoshThemes
```

![image-20241010154834079](https://bu.dusays.com/2024/10/10/670786d36e5b6.png)

其中终端样式上方就有主题文件目录，可以复制下来，注意不要复制到前后多余的字符，我们只需要`C:\Users\HoronLee\AppData\Local\Programs\oh-my-posh\themes\1_shell.omp.json`，`json`不要复制成`jsone`！

然后我们继续编辑之前编辑过的配置文件

```
notepad $PROFILE
```

更改第一个配置，新增`--config C:\Users\HoronLee\AppData\Local\Programs\oh-my-posh\themes\catppuccin.omp.json`，请将主题文件改为自己之前复制的！

```powershell
# 使用 oh my posh
oh-my-posh init pwsh --config C:\Users\HoronLee\AppData\Local\Programs\oh-my-posh\themes\catppuccin.omp.json | Invoke-Expression
```

最后重启PowerShell，就可以看到主题已经变更，是不是更好看了！

##  配置 VS code

在 `VS code` 中也能打开 `PowerShell` 终端，但是由于没有配置终端字体，因为 icon 们还是没有正常显示，而是显示的方框。因此需要设置 `VSCode` 的终端字体为在PowerShell配置中设置的Nerd字体才能正常显示。

首先打开**设置**，搜索 `Font Family`，找到`Terminal › Integrated: Font Family`这个配置项目，现在下方的配置框中是空白的，需要填上Nerd字体的全民，并且加上单引号

![image-20241010155558887](https://bu.dusays.com/2024/10/10/6707888fcb25f.png)

最后重新打开终端，或是执行 `powershell`，即可查看美化界面。

![image-20241010155624591](https://bu.dusays.com/2024/10/10/670788a9a3718.png)

## 安装NeoVim

[Neovim](https://neovim.io/)是vim的插件增强版，可以自定义更强大的插件来辅助开发，本文使用其发行版LazyVim来进行开发配置。

使用scoop来安装Neovim

```powershell
scoop bucket add main
scoop install neovim
```

安装完成后可以通过`nvim`来开启Neovim，此时没有任何插件，和vim看起来并无差异

### 安装LazyVim

[🚀 Getting Started | LazyVim](https://www.lazyvim.org/)是由 [lazy.nvim 提供支持💤](https://github.com/folke/lazy.nvim)的 Neovim 设置，可以轻松自定义和扩展您的配置。

使用 [PowerShell](https://github.com/PowerShell/PowerShell) 安装 [LazyVim Starter](https://github.com/LazyVim/starter)

- 备份您当前的 Neovim 文件，第一次安装可以执行，因为你根本没东西需要备份（笑

  ```powershell
  # required
  Move-Item $env:LOCALAPPDATA\nvim $env:LOCALAPPDATA\nvim.bak
  
  # optional but recommended
  Move-Item $env:LOCALAPPDATA\nvim-data $env:LOCALAPPDATA\nvim-data.bak
  ```

- 克隆Lazyvim

  ```powershell
  git clone https://github.com/LazyVim/starter $env:LOCALAPPDATA\nvim
  ```

- 删除自带的`.git`文件夹，以便稍后可以将其添加到您自己的存储库

  ```powershell
  Remove-Item $env:LOCALAPPDATA\nvim\.git -Recurse -Force
  ```

- 启动 Neovim！

  ```powershell
  nvim
  ```

接下来就能看到neovim启动了，他变了，变得看起来更高级了（插件起作用了，在加载了），当然这个过程会从GitHub下载很多Lua语言的脚本，或许你需要为自己准备一个梯子来更快的访问以防止报错

这是安装完成的状态，你可以通过`Shift+U`等组合切换选项卡

![image-20241010160340343](https://bu.dusays.com/2024/10/10/67078a5d7bc4b.png)

如果出现了红色报错，内容含有make、gcc等词汇，说明缺少了一下依赖，你需要手动安装，这很简单，还需使用伟大的scoop即可完成（我碰到的就是gcc不存在，所以我就自己安装完成了）

```powershell
scoop install gcc
```

以上步骤完成你可以开始使用lazyvim了，使用`nvim 某文件`即可开始对其进行编辑，关于vim和lazyvim的各种快捷键可以在[vim键位指南](https://vim.rtorr.com/lang/zh_cn)和[⌨️ Keymaps | LazyVim](https://www.lazyvim.org/keymaps)中找到，请尽情探索，相信你可以只用键盘实现高于键鼠的代码效率！

## 给LazyVim添加编程语言插件

> 未完待续......
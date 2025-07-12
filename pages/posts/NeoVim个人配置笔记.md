---
layout: post
title: NeoVim个人配置笔记
date: 2024-10-18 09:53:35
tags:
  - neovim
  - lazyvim
categories:
  - 开发
  - 环境配置
cover: https://mattermost.com/wp-content/uploads/2022/02/02_Neovim@2x-2048x1072.png
password:
hide:
---

## LazyVim 配置目录

```shell
.
├── LICENSE
├── README.md
├── init.lua #配置入口文件
├── lazy-lock.json
├── lazyvim.json
├── lua
│   ├── config #默认生成的配置目录
│   │   ├── autocmds.lua
│   │   ├── keymaps.lua
│   │   ├── lazy.lua
│   │   └── options.lua #自定义配置可以写在这里
│   └── plugins
│       ├── colorscheme.lua #自己添加的主题插件配置
│       └── example.lua
└── stylua.toml

```

## 主题配置

新建 `lua/plugins/colorscheme.lua`

写入以下配置

```lua
return {
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = function()
        require("catppuccin").load()
      end,
    },
  },
  {
    "catppuccin/nvim",
    lazy = true,
    name = "catppuccin",
    opts = {
      color_overrides = {
        mocha = {
          base = "#060b16",
          mantle = "#090f1d",
          crust = "#0b1625",
        },
      },
      integrations = {
        aerial = true,
        alpha = true,
        cmp = true,
        dashboard = true,
        flash = true,
        grug_far = true,
        gitsigns = true,
        headlines = true,
        illuminate = true,
        indent_blankline = { enabled = true },
        leap = true,
        lsp_trouble = true,
        mason = true,
        markdown = true,
        mini = true,
        native_lsp = {
          enabled = true,
          underlines = {
            errors = { "undercurl" },
            hints = { "undercurl" },
            warnings = { "undercurl" },
            information = { "undercurl" },
          },
        },
        navic = { enabled = true, custom_bg = "lualine" },
        neotest = true,
        neotree = true,
        noice = true,
        notify = true,
        semantic_tokens = true,
        telescope = true,
        treesitter = true,
        treesitter_context = true,
        which_key = true,
      },
    },
  },
}

```

其中`color_overrides`的配色可以自由配置代码编辑页，侧栏和分割线的背景色和颜色，其他配置请参考`catppuccin`主题的配置<https://github.com/catppuccin/nvim>

## 终端自动配置

解决在 windows 下，neovim 终端为 cmd 而不是 powershell 的问题

```lua
-- 通过系统类型来选择nvim的终端，在linux优先选择zsh，如果没有则使用bash
if vim.fn.has("win32") == 1 then
  LazyVim.terminal.setup("pwsh")
elseif vim.fn.has("linux") then
  if vim.fn.executable("zsh") == 1 then
    LazyVim.terminal.setup("zsh")
  else
    LazyVim.terminal.setup("bash")
  end
end
```

## Codeium AI插件(已换用LazyExtra的插件)

比较好用的支持行内补全的AI代码插件，新建`lua/plugins/codeium`文件，写入以下lua代码

其中包含了自定义热键的代码，因为tab默认是缩进会造成冲突，所以我改成了ctrl+g，当然可以改为其他热键，具体可以参考[Exafunction/codeium.nvim: A native neovim extension for Codeium](https://github.com/Exafunction/codeium.nvim)Codeium官方nvim插件仓库的教程

```lua
return {
  "Exafunction/codeium.vim",
  event = "BufEnter",
  config = function()
    -- 自定义codeium快捷键，不使用tab接受建议而是用Ctrl+g
    vim.g.codeium_no_map_tab = 1
    vim.keymap.set("i", "<C-g>", function()
      return vim.fn["codeium#Accept"]()
    end, { expr = true, silent = true })
  end,
}
```

然后重启nvim会自动安装codeium插件，随后使用命令`:Codeium Auth`来登录，会自动弹出浏览器，然后在浏览器复制token后粘贴到nvim的框中，回车进行登陆

## 自定义插件仓库源

在文件`lua/config/lazy.lua`的`require("lazy").setup`方法体中加入以下内容

```lua
-- 自定义插件仓库加速源
git = {
  log = { "-10" }, -- 只显示最新10条commit
  timeout = 120, -- 当超过2分钟后杀死进程
  -- 地址模板定义
  -- url_format = "git@github.com:%s",
  url_format = "https://www.ghproxy.cn/https://github.com/%s",
},
```

`url_format`就是加速地址，可以自己寻找可用源进行替换

## 行内提示优化

lazyvim默认的行内提示（Linter）会显示每一行的错误和警告，并且你会发现无论如何调整窗口，这个提示总是不能自动换行，并且烦人的是，你想忽略掉他却不知道该如何关闭提示。

根据群友的意见，我采用了 `tiny-inline-diagnostic`这个Linter插件[rachartier/tiny-inline-diagnostic.nvim：一个 Neovim 插件，可显示更漂亮的诊断信息。在光标所在的位置显示诊断消息，并带有图标和颜色。](https://github.com/rachartier/tiny-inline-diagnostic.nvim)它可以做到提示自动换行，光标聚焦行内才会显示提示。这刚好满足需求。并且提示字也会更好看。

新建文件`lua/plugins/tiDiagonstic.lua`，写入以下lua代码

```lua
-- 行内提示优化插件，只有当聚焦到当前行才会显示全部提示且支持换行显示
return {
  {
    "rachartier/tiny-inline-diagnostic.nvim",
    event = "VeryLazy", -- Or `LspAttach`
    priority = 1000, -- needs to be loaded in first
    config = function()
      require("tiny-inline-diagnostic").setup()
    end,
  },
}

```

你需要设置 ，以便不显示缓冲区中的所有诊断信息，在`lua/config/autocmds.lua`中添加以下代码

```lua
-- 确保在LSP 配置完成之前关闭virtual_text
vim.api.nvim_create_autocmd("LspAttach", {
  callback = function()
    vim.diagnostic.config({
      virtual_text = false, -- Disable virtual text
    })
  end,
})
```

重启NeoVim

## ArchLinux WSL剪切板互通

如果你使用WSL并且很不巧（笑）是ArchLinux，那么单单安装xclip或许没办法实现和windows的剪切板互通，那么现在就需要使用wsl的秘籍：互通命令 来做到共享剪切板，这里使用的软件是`win32yank`，在windows中通过`scoop install win32yank`即可安装此软件（关于scoop用法可以参照[PowerShell开发配置指北 - 皓然小站](https://blog.horonlee.com/posts/PowerShell开发配置指北#安装scoop)）

然后在`lua/config/autocmds.lua`中添加以下代码

```lua
-- 解决ArchLinux WSL环境下无法和windows互通剪切板的问题
if vim.fn.executable("win32yank.exe") == 1 then
  vim.opt.clipboard:append({ "unnamedplus" })
  vim.g.clipboard = {
    name = "win32yank",
    copy = {
      ["+"] = "win32yank.exe -i --crlf",
      ["*"] = "win32yank.exe -i --crlf",
    },
    paste = {
      ["+"] = "win32yank.exe -o --lf",
      ["*"] = "win32yank.exe -o --lf",
    },
    cache_enabled = 0,
  }
end
```

重启NeoVim，你就会发现用`yy`等指令可以复制vim的内容到windows剪切板了！（反之也可以）

---

未完待续，如果有任何疑问可以在评论区提问，我会尽力回答(≧ω≦)



## 常见问题解法

### 报错rust-analyzer not found in PATH, please install it

直接前往[rust-analyzer用户使用手册](https://rust-analyzer.github.io/manual.html#installation)，根据提示安装rust-analyzer即可，我在wsl中采用本地编译进行安装

---


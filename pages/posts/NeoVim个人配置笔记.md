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
├── init.lua	#配置入口文件
├── lazy-lock.json
├── lazyvim.json
├── lua
│   ├── config	#默认生成的配置目录
│   │   ├── autocmds.lua
│   │   ├── keymaps.lua
│   │   ├── lazy.lua
│   │   └── options.lua	#自定义配置可以写在这里
│   └── plugins
│       ├── colorscheme.lua	#自己添加的主题插件配置
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

其中`color_overrides`的配色可以自由配置代码编辑页，侧栏和分割线的背景色和颜色，其他配置请参考`catppuccin`主题的配置https://github.com/catppuccin/nvim

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

## Codeium AI插件

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
  url_format = "git@github.com:%s",
  -- url_format = "https://www.ghproxy.cn/https://github.com/%s",
},
```

`url_format`就是加速地址，可以自己寻找可用源进行替换

---

未完待续，如果有任何疑问可以在评论区提问，我会尽力回答(≧ω≦)

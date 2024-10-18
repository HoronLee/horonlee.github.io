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


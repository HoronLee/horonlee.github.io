---
title: OpenCode对接CodeSome API
date: 2026-01-06 17:05:50
tags:
  - AI
  - VibeCoding
categories:
  - AI
cover:
dg-publish: false
---
> 如何在OpenCode中使用CodeSome的Claude订阅？一文快速搞定你的OpenCode配置！

## 前置要求：
1. 通过[https://v2.codesome.cn/](https://v2.codesome.cn/) 注册你的codesome账号，联系主理人[https://x.com/oops073111](https://x.com/oops073111) 有机会获得10美元体验券！
2. 在CodeSome平台中获取API KEY，如下图所示
![](/attachment/OpenCode-CodeSome-API/cf5721d295258b5ea4226d487d991ff6.png)![](/attachment/OpenCode-CodeSome-API/e04832390d6cb2e419bd2e2d67c9b638.png)
## 一、新建OpenCode配置文件
配置文件位置：
- Linux/Mac: `~/.config/opencode/opencode.jsonc`
- Windows: `%APPDATA%\opencode\opencode.jsonc`
⚠️：jsonc文件是可带有注释的json格式，这样方便后续配置文件的维护与AI的操作，所以这里默认用opencode.jsonc 作为配置文件
## 二、 修改配置文件
这里我们以官方的自定义Provider为例来配置CodeSome为供应商，你可以直接将以下配置拷贝到你的配置文件中，其中"apiKey": 一行内的{env:CODESOME_CLAUDE_API_KEY}你可以通过环境变量设置到当前终端，或者直接写死在配置文件中～

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "codesome": {
      "npm": "@ai-sdk/anthropic",
      "name": "codesome",
      "options": {
        "baseURL": "https://v2.codesome.cn/v1",
        "apiKey": "{env:CODESOME_CLAUDE_API_KEY}"
      },
      "models": {
        "claude-sonnet-4-5-20250929": {
          "name": "Claude Sonnet 4.5"
        },
        "claude-opus-4-5-20251101": {
          "name": "Claude Opus 4.5"
        },
        "claude-haiku-4-5-20251001": {
          "name": "Claude Haiku 4.5"
        }
      }
    }
  }
}
```
## 三、 重启OpenCode
⚠️：最好先新建一个终端，保证环境变量刷新
随后进入最后的步骤
1. 在输入框输入/models，进入模型选择界面
2. 在Search框输入codesome快速筛查模型
![](/attachment/OpenCode-CodeSome-API/cba4c8e68c1b8082d6c625e917222a1e.png)
3. 如图即可选择之前的三个模型其中的一个

然后就可以愉快使用 Claude 的模型进行Vibe Coding咯！！！
![](/attachment/OpenCode-CodeSome-API/deccf6259e9a9e8cfcb98e2f4f798921.png)
可能大家注意到了“Sisyphus”、“OhMyOpenCode”等词汇，这是因为我为OpenCode安装了Oh-My-OpenCode插件导致的，以后我会继续以CodeSome为例来介绍如何在OpenCode中使用Oh-My-OpenCode插件搭配第三方API来高效编码～

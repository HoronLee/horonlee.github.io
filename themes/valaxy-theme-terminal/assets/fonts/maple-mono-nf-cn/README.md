# Maple Mono NF CN 自托管网页字体

本目录包含 [Maple Mono v7.9](https://github.com/subframe7536/maple-font/releases/tag/v7.9)
的 NF CN Regular（400）和 Bold（700）WOFF2 分片。字体来源为本机安装的官方
`MapleMono-NF-CN-Regular.ttf` 和 `MapleMono-NF-CN-Bold.ttf`，字体内部版本均为
`Version 7.900`，family 为 `Maple Mono NF CN`。

## 覆盖与加载

- 每个字重完整保留原字体 cmap 的 **33,091 个 Unicode 字符**，包括 20,976 个 CJK
  字符、10,379 个私用区字符（含 Nerd Fonts 图标），以及英文、标点、符号等。
  覆盖简繁中文；未来文章可使用原字体支持的任意字符。原字体没有的字符仍使用 CSS 后备字体。
- 400、700 各 129 个分片，共 258 个 WOFF2；总计 **15,468,392 字节（14.75 MiB）**。
  400 合计 7,646,372 字节，700 合计 7,822,020 字节。
- 拉丁字母、组合音标和通用标点放在同一分片，避免普通代码连字跨字体分片。
  此分片为 450 个字符：400 为 43,044 字节，700 为 45,008 字节。
- 其余字符按 Unicode 排序，每片最多 256 个字符。单片最大 112,188 字节。
  CSS `unicode-range` 精确描述每片字符；只加载页面实际使用的字符对应分片和字重。
  中文较多的页面会加载多个分片，上述总量不是每次访问的下载量。
- 保留原字体 hinting 和适用的全部 OpenType 特性，包括 `calt` 代码连字与样式集。
  仅提供正体 400/700；其他字重由浏览器匹配，斜体由浏览器合成。
- `styles/fonts.css` 使用相对 URL、统一 family `'Maple Mono NF CN'` 和
  `font-display: swap`。字体随网站部署，不依赖访客本机安装或第三方字体服务。

## 重建

在仓库根目录执行：

```sh
rtk proxy uv run themes/valaxy-theme-terminal/scripts/build_fonts.py
```

脚本使用 PEP 723 锁定 `fonttools[woff]==4.61.1`、`brotli==1.2.0`，Python 3.11 及以上。
它先检查 `~/Library/Fonts` 和 `/Library/Fonts` 的指定 v7.9 TTF；未找到匹配文件时，
自动从上述官方版本下载 `MapleMono-NF-CN.zip` 到临时目录。输入字体须通过内置 SHA-256
校验，版本不同会被拒绝。无需提交原始 TTF，也无需下载整个字体家族到仓库。

也可指定已有源文件目录和并发数：

```sh
rtk proxy uv run themes/valaxy-theme-terminal/scripts/build_fonts.py --source-dir /path/to/v7.9-fonts --jobs 4
```

重建会替换此目录的 WOFF2、`manifest.json` 和主题的 `styles/fonts.css`。
分片、文件名和时间戳处理均固定；脚本逐片重新读取 WOFF2，验证其字符映射和字重。
`manifest.json` 保存输入/输出 SHA-256、来源、版本、每片字符范围与大小。

## 许可与修改说明

Copyright 2022 The Maple Mono Project Authors
(https://github.com/subframe7536/maple-font)

这些字体遵循 **SIL Open Font License 1.1**，完整原文见同目录 [OFL.txt](./OFL.txt)，
原文取自 [v7.9 的 OFL.txt](https://github.com/subframe7536/maple-font/blob/v7.9/OFL.txt)。
本次修改只涉及以 FontTools 拆分 Unicode 子集、转换 WOFF2、清除无关元数据，
没有重新设计字形。版权声明和许可链接也保留在每个字体文件的 name 表中。
这些衍生字体继续使用 OFL 1.1；网站代码或文章的许可不改变字体的许可。
重新分发本目录时须同时保留版权声明和 OFL 文本。

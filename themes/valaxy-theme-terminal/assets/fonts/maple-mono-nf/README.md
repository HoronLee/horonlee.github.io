# Maple Mono NF 自托管网页字体

本目录来自 [Maple Mono v7.9 官方发布](https://github.com/subframe7536/maple-font/releases/tag/v7.9)
的 `MapleMono-NF.zip`（hinted，带代码连字），使用真实的
`MapleMono-NF-Regular.ttf`（400）和 `MapleMono-NF-Bold.ttf`（700）。
字体内部 family 为 `Maple Mono NF`，版本为 `Version 7.900`。

## 覆盖与加载

- 英文、代码、终端符号和 Nerd Fonts 图标使用 Maple Mono NF。中文使用系统字体，
  不随网页字体加载切换字宽。系统回退先使用 `ui-monospace`、`SFMono-Regular`、
  Menlo、Monaco、Consolas，再使用 PingFang SC、Microsoft YaHei、Noto Sans CJK SC。
- 每个字重的官方源文件有 **11,795 个 Unicode 字符**，本目录保留 **11,794 个**。
  唯一删去的源字符为 `U+FE62 SMALL PLUS SIGN`。构建脚本还明确排除 CJK 汉字及
  扩展、兼容汉字、CJK 全角/半角/竖排/小型标点、假名与注音等范围；所有排除范围
  记录在 `manifest.json` 的 `systemFallbackRanges` 中。源字体本身不包含中文汉字。
- ASCII、box drawing 等终端符号和全部 Nerd Fonts 私用区字符保留。
  拉丁字母、组合音标和通用标点放在同一分片，避免普通代码连字跨分片。
  拉丁分片包含 450 个字符：400 为 59,796 字节，700 为 62,624 字节。
- 400、700 各 46 个分片，共 **92 个 WOFF2、2,336,592 字节（2.23 MiB）**。
  400 合计 1,166,232 字节，700 合计 1,170,360 字节；单片最大 75,704 字节。
  除拉丁分片外，每片最多 256 个字符。`unicode-range` 精确描述实际字符映射，
  浏览器只请求当前页面使用的分片与字重，上述总量并非每次访问的下载量。
- 保留源字体 hinting 和适用的全部 OpenType 特性，包括 `calt` 代码连字与样式集。
  仅提供正体 400/700；其他字重由浏览器匹配，斜体由浏览器合成。
- `styles/fonts.css` 使用相对 URL、统一 family `'Maple Mono NF'` 与
  `font-display: swap`，不依赖访客本机安装字体或第三方字体服务。
  Nerd 图标固定使用此字体；下载失败时显示 ASCII 回退。

## 重建

在仓库根目录执行：

```sh
rtk proxy uv run themes/valaxy-theme-terminal/scripts/build_fonts.py
```

脚本使用 PEP 723 锁定 `fonttools[woff]==4.61.1`、`brotli==1.2.0`，要求 Python 3.11 及以上。
先查找 `~/Library/Fonts` 与 `/Library/Fonts` 中 SHA-256 匹配的 v7.9 NF TTF；未找到时，
从官方发布下载 `MapleMono-NF.zip` 到临时目录。ZIP 摘要通过官方
[`MapleMono-NF.sha256`](https://github.com/subframe7536/maple-font/releases/download/v7.9/MapleMono-NF.sha256)
核对并锁定；脚本验证 ZIP 和每个输入 TTF 的 SHA-256，同时检查内部字体族名。
原始 TTF 不进入仓库。

也可指定已有源文件目录和并发数：

```sh
rtk proxy uv run themes/valaxy-theme-terminal/scripts/build_fonts.py --source-dir /path/to/v7.9-fonts --jobs 4
```

重建替换上次 manifest 登记的 WOFF2、`manifest.json` 和主题 `styles/fonts.css`，
不会清理未登记的其他文件。分片、文件名和时间戳处理固定；脚本逐片重新读取 WOFF2，
验证实际字符映射、系统回退排除范围与字重。manifest 记录来源、版本、输入/输出摘要、
每片字符范围和大小，便于复核。

## 许可与修改说明

Copyright 2022 The Maple Mono Project Authors
(https://github.com/subframe7536/maple-font)

字体遵循 **SIL Open Font License 1.1**，完整原文见 [OFL.txt](./OFL.txt)，
来源为 [v7.9 的 OFL.txt](https://github.com/subframe7536/maple-font/blob/v7.9/OFL.txt)。
修改仅涉及以 FontTools 拆分 Unicode 子集、排除系统回退范围、转换 WOFF2、清除无关元数据，
没有重新设计字形。版权声明和许可链接保留在每个字体文件的 name 表中。
衍生字体继续使用 OFL 1.1；网站代码或文章的许可不改变字体许可。
重新分发本目录须同时保留版权声明和 OFL 文本。

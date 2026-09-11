# Terminal / Valaxy 终端主题

博客仓库内的本地主题，通过 pnpm workspace 接入 Valaxy。主题文件位于 `themes/valaxy-theme-terminal`，无需先发布到 npm。

## 日常配置

| 文件 | 用途 |
| --- | --- |
| 根目录 `site.config.ts` | 站点名称、作者、社交链接、搜索、评论开关、阅读统计、赞赏 |
| 根目录 `theme.config.ts` | 终端外观、导航、个人资料、设备、页脚 |
| 根目录 `valaxy.config.ts` | 选择 `terminal` 主题，配置 Waline 等插件 |
| 本主题的 `theme.config.ts` | 默认值，一般不用改 |

Valaxy 原生加载根目录 `theme.config.ts`，与主题注册的默认值合并。主题的 `valaxy.config.ts` 显式导入自己的默认配置，确保当前 Valaxy 版本在首次构建时也能正确补全字段。对象逐项合并，数组整体替换。主题导出的 `defineThemeConfig` 提供 TypeScript 补全，用户配置只填写需要覆盖的字段即可。

```ts
import { defineThemeConfig } from 'valaxy-theme-terminal'

export default defineThemeConfig({
  terminal: { user: 'horonlee', host: 'blog' },
  accent: 'mauve', // mauve | blue | teal
  icons: 'nerd', // nerd | ascii；字体失败时自动显示 ASCII
  keyboard: true,
  font: { family: 'Maple Mono NF CN', ligatures: true },
  profile: {
    name: '皓然 / HoronLee',
    // age: 21, // 可选；手动填写当前愿意公开的年龄
    hobbies: ['开源', '游戏'],
    bio: '分享生活和技术的点滴',
    shell: 'fish',
    terminal: 'kitty',
    // ascii: '自定义等宽字符画',
  },
  devices: [
    {
      name: 'iPhone 14 Pro Max',
      kind: 'phone', // laptop | phone | handheld | other
      details: [{ label: '颜色', value: '紫色' }],
    },
  ],
})
```

实际根配置已填入 MacBook Pro、iPhone 和 ROG Ally。年龄未启用、爱好留空；关于页的文字介绍仍在 `pages/about/index.md` 中。设备信息是手动维护的公开资料，页面不会读取访客或作者的设备状态。

导航在 `navigation` 数组中定义：`{ text, link, icon }`。内置图标名称有 `home`、`folder`、`tag`、`link`、`user`。社交账号直接复用 `site.config.ts` 的 `social`；有效链接正常跳转，不完整链接显示名称/号码。友链继续维护在 `pages/links/index.md` 的 frontmatter `links` 中，展示组件为 `TerminalFriendLinks`，顺序与配置一致。

`footer` 支持 `since`、`icp`、`moe`、`visitors` 与 `links`。`visitors: true` 使用原站点的不蒜子服务；Waline 服务地址仍由 `valaxy.config.ts` 的 `addonWaline` 设置。

## 页面与交互

- 首页：`cat README.md`、文章列表 `ls -lt ~/posts`，分页复用 `siteConfig.pageSize`。
- 文章：`less`、Markdown 正文、目录、前后篇、赞赏、Waline 评论。支持 `aside: false`、`toc: false`、`outline: false`、`nav: false`、`comment: false`。
- 归档：`history`；标签/分类通过 URL 查询参数筛选。
- 关于：Markdown frontmatter `layout: profile`，`whoami` / `fastfetch`、设备和全部社交链接。
- `/` 打开搜索，`Esc` 关闭，搜索输入中 `Enter` 打开第一条；文章页 `q` 返回首页。输入框、编辑器和输入法组合输入不触发全局快捷键。
- 切换按钮显示 `light` / `dark`；状态栏保留 Catppuccin Latte / Mocha。首次跟随系统，随后记住浏览器中的选择。

这些命令是可点击、可键盘操作的界面文案，不执行 Shell 命令。搜索查找公开文章的标题、摘要、标签和分类；不下载正文建立全站全文索引。

## 字体与样式

Maple Mono NF CN v7.9 的 400/700 字重以 WOFF2 Unicode 分片自托管，覆盖原字体全部简繁中文和 Nerd Fonts 字符。浏览器只请求页面所需分片，不会一次下载全部 14.75 MiB。CSS 使用 `font-display: swap`。

详见 `assets/fonts/maple-mono-nf-cn/README.md` 的版本、许可、体积与重建方法。更换 `font.family` 后，需自行用 `@font-face` 或 Valaxy 自定义样式提供对应字体；内置字体仍作为回退。

全局色板和布局在 `styles/terminal.css`；文章排版在 `styles/markdown.css`。用户也能在根 `styles/` 写覆盖样式，无需修改主题组件。

## 开发与验证

日常调整配置和样式使用 `pnpm dev`，保存 `theme.config.ts` 后页面会热更新。`pnpm serve` 只预览上一次构建的 `dist`，修改源码后需要先重新运行 `pnpm build` 才能在这种预览中看到变化。

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm serve --host 127.0.0.1 --port 4173
```

`pnpm build` 同时检查静态页面、分页链接和字体资源，遇到空白 SSR、缺失页面或字体会失败。根 `valaxy.config.ts` 开启 `build.ssgForPagination`，使分页在静态托管上也能直接访问。主题的 SSG 钩子移除框架自动添加的整套字体预加载，保留 Unicode 按需请求。

参考：[Valaxy 主题开发](https://valaxy.site/zh/themes/write)、[Valaxy 配置](https://valaxy.site/guide/config/)、[自定义字体](https://valaxy.site/guide/custom/styles#custom-font)。

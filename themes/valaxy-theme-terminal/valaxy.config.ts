import { defineTheme } from 'valaxy'
import themeConfig from './theme.config'

export default defineTheme({
  themeConfig,
  vite: {
    ssgOptions: {
      // Valaxy beta 的 SSG 会预加载 CSS 中的每个字体分片。
      // 交还浏览器按 unicode-range 加载，避免首屏下载整套中文字体。
      onPageRendered: (_route, html) => html.replace(/<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="font")[^>]*>/g, ''),
    },
  },
  markdown: {
    // 与界面的 light / dark 配色同步。
    theme: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' },
  },
})

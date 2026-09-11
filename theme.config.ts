import { defineThemeConfig } from 'valaxy-theme-terminal'

// 本站的主题配置。未填写的选项采用主题默认值。
export default defineThemeConfig({
  accent: 'mauve',
  terminal: { user: 'horonlee', host: 'blog' },
  icons: 'nerd',
  keyboard: true,
  font: { family: 'Maple Mono NF CN', ligatures: true },
  home: { intro: '在这里，记录折腾的过程，\n也给日常留一个可以回来的地方。' },
  profile: {
    name: '皓然 / HoronLee',
    // age: 21, // 填写当前希望公开的年龄；省略时不显示。
    hobbies: ['编程', '钢琴', '音乐'], // 例如 ['开源', '技术', '游戏']，按自己的意愿公开。
    bio: '分享生活和技术的点滴',
    shell: 'fish',
    terminal: 'kitty',
  },
  devices: [
    { name: 'MacBook Pro 14 英寸 / 2023', kind: 'laptop', details: [
      { label: '芯片', value: 'Apple M2 Pro' },
      { label: '内存', value: '16 GiB' },
      { label: '系统', value: 'macOS' },
    ] },
    { name: 'iPhone 14 Pro Max', kind: 'phone', details: [{ label: '颜色', value: '紫色' }] },
    { name: 'ROG Ally Z1E', kind: 'handheld', details: [{ label: '类型', value: '游戏掌机' }] },
  ],
  footer: {
    since: 2023,
    icp: '浙ICP备2023037163号',
    moe: '20241146',
    visitors: true,
    links: [
      { text: 'Vercel', link: 'https://vercel.com/' },
      { text: 'Source', link: 'https://github.com/HoronLee/horonlee.github.io' },
      { text: '开往', link: 'https://www.travellings.cn/go.html' },
    ],
  },
})

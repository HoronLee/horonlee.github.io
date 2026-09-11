import type { TerminalThemeConfig } from './types'

export default {
  accent: 'mauve',
  terminal: { user: 'guest', host: 'blog' },
  font: { family: 'Maple Mono NF', ligatures: true },
  icons: 'nerd',
  keyboard: true,
  navigation: [
    { text: '首页', link: '/', icon: 'home' },
    { text: '归档/', link: '/archives/', icon: 'folder' },
    { text: '标签/', link: '/tags/', icon: 'tag' },
    { text: '分类/', link: '/categories/', icon: 'folder' },
    { text: '友链/', link: '/links/', icon: 'link' },
    { text: '关于我.md', link: '/about/', icon: 'user' },
  ],
  home: { intro: '在这里，记录折腾的过程，\n也给日常留一个可以回来的地方。' },
  profile: {
    name: '',
    hobbies: [],
    bio: '',
    shell: '',
    terminal: '',
    ascii: 'HHH         HHH\nHHH         HHH\nHHH         HHH\nHHH         HHH\nHHHHHHHHHHHHHHH\nHHHHHHHHHHHHHHH\nHHH         HHH\nHHH         HHH\nHHH         HHH\nHHH         HHH\nHHH         HHH',
  },
  devices: [],
  footer: { since: 2023, icp: '', moe: '', visitors: false, links: [] },
} satisfies TerminalThemeConfig

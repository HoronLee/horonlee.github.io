import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.horonlee.com/',
  lang: 'zh-CN',
  title: '皓然小站',
  subtitle: '就算生活枯燥，也要勇往直前',
  author: {
    name: '皓然',
    avatar: 'https://bu.dusays.com/2023/02/02/63db3598928c2.jpg',
  },
  description: '分享生活和技术的点滴',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'QQ 群 1269024821',
      link: 'https://',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/horonlee',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=545332010',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: '知乎',
      link: 'https://www.zhihu.com/people/tie-tie-huohuo',
      icon: 'i-ri-zhihu-line',
      color: '#0084FF',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/172335226',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/HuoTie',
      icon: 'i-ri-twitter-line',
      color: '#1da1f2',
    },
    {
      name: 'E-Mail',
      link: 'mailto:1269024821@qq.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'Travelling',
      link: 'https://www.travellings.cn/go.html',
      icon: 'i-ri-train-line',
      color: 'var(--va-c-text)',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: true,
    title: '饿饿，饭饭！',
    methods: [
      {
        name: '支付宝',
        url: 'https://bu.dusays.com/2023/11/02/65432694e4eb5.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: '微信支付',
        url: 'https://bu.dusays.com/2023/11/02/6543269436758.jpg',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
  encrypt: {
    // 开启加密，默认关闭
    enable: true
  },
  // 开启阅读统计
  statistics: {
    enable: true,
    readTime: {
      // 阅读速度
      speed: {
        cn: 300,
        en: 200,
      },
    },
  },
  mediumZoom: {
    // 图片预览
    enable: true 
  }
})

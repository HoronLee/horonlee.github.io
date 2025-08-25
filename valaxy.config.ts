import { defineValaxyConfig } from "valaxy";
import type { UserThemeConfig } from "valaxy-theme-yun";
import { addonWaline } from "valaxy-addon-waline";
import { addonComponents } from "valaxy-addon-components";

// add icons what you will need
const safelist = ["i-ri-home-line"];

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: "yun",

  themeConfig: {
    banner: {
      enable: true,
      title: "皓然小站",
      cloud: {
        enable: true,
      },
    },

    pages: [
      {
        name: "我的小伙伴们",
        url: "/links/",
        icon: "i-ri-genderless-line",
        color: "dodgerblue",
      },
      {
        name: "喜欢的女孩子",
        url: "/girls/",
        icon: "i-ri-women-line",
        color: "hotpink",
      },
    ],

    footer: {
      since: 2023,
      beian: {
        enable: true,
        icp: "浙ICP备2023037163号",
      },
    },
    bg_image: {
      enable: true,
      url: "https://minio-api.horonlee.com/blogpic/img/20250312120726614.png",
      dark: "https://bu.dusays.com/2023/01/30/63d7d94e432cf.png",
    },
  },
  unocss: { safelist },

  // or write it in site.config.ts
  siteConfig: {
    // 启用评论
    comment: {
      enable: true,
    },
  },
  // 设置 valaxy-addon-waline 配置项
  addons: [
    addonWaline({
      // Waline 配置项，参考 https://waline.js.org/reference/client/props.html
      // serverURL: 'https://waline.horonlee.com',
      serverURL: "https://waline.horon.top",
    }),
    addonComponents(),
  ],
});

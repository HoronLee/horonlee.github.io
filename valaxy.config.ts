import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'
import { addonComponents } from 'valaxy-addon-components'

export default defineValaxyConfig({
  theme: 'terminal',
  build: { ssgForPagination: true },
  // 站点资料在 site.config.ts；主题外观与个人资料在 theme.config.ts。
  unocss: { safelist: ['i-ri-home-line'] },
  addons: [
    addonWaline({ serverURL: 'https://waline.horon.top' }),
    addonComponents(),
  ],
})

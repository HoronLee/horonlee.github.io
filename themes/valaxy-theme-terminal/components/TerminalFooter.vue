<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'
import { useSiteConfig } from 'valaxy'
import { useTerminalConfig } from '../composables/config'

const config = useTerminalConfig()
const site = useSiteConfig()
const year = new Date().getFullYear()
if (config.value.footer.visitors)
  useScriptTag('https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js')
</script>

<template>
  <footer class="terminal-footer">
    <p>© {{ config.footer.since }}<template v-if="year > config.footer.since">–{{ year }}</template> {{ site.author.name }} <span aria-hidden="true">/</span> Powered by <a href="https://valaxy.site/" target="_blank" rel="noopener noreferrer">Valaxy</a></p>
    <p class="terminal-footer-links">
      <a v-for="link in config.footer.links" :key="link.link" :href="link.link" target="_blank" rel="noopener noreferrer">{{ link.text }}</a>
      <a v-if="config.footer.icp" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">{{ config.footer.icp }}</a>
      <a v-if="config.footer.moe" :href="`https://icp.gov.moe/?keyword=${config.footer.moe}`" target="_blank" rel="noopener noreferrer">萌 ICP 备 {{ config.footer.moe }} 号</a>
    </p>
    <p v-if="config.footer.visitors" class="terminal-visitors"><span id="busuanzi_container_site_pv">访问 <span id="busuanzi_value_site_pv">—</span> 次</span><span id="busuanzi_container_site_uv">访客 <span id="busuanzi_value_site_uv">—</span> 人</span></p>
  </footer>
</template>

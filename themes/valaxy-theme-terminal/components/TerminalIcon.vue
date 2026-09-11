<script setup lang="ts">
import { computed } from 'vue'
import { useTerminalConfig } from '../composables/config'

const props = defineProps<{ name?: string }>()
const config = useTerminalConfig()
// 未覆盖的图标仍显示文本标记，操作的可见名称由调用者提供。
const icons: Record<string, [string, string]> = {
  home: ['~', '\uf015'], folder: ['+', '\uf07b'], tag: ['#', '\uf02b'],
  link: ['@', '\uf0c1'], user: ['i', '\uf007'], laptop: ['[>]', '\uf109'],
  phone: ['[|]', '\uf10b'], handheld: ['[+]', '\uf11b'], other: ['*', '\uf108'],
  'i-ri-github-line': ['gh', '\uf09b'], 'i-ri-mail-line': ['@', '\uf0e0'],
  'i-ri-rss-line': ['rss', '\uf09e'], 'i-ri-bilibili-line': ['B', '\uf144'],
  'i-ri-twitter-line': ['tw', '\uf099'], 'i-ri-zhihu-line': ['知', '\uf02d'],
  'i-ri-netease-cloud-music-line': ['♪', '\uf001'], 'i-ri-qq-line': ['qq', '\uf1d6'],
  'i-ri-train-line': ['tr', '\uf238'], 'i-ri-alipay-line': ['支', '\uf157'],
  'i-ri-wechat-pay-line': ['微', '\uf1d7'],
}
const glyph = computed(() => icons[props.name || ''] || ['*', '*'])
</script>

<template>
  <span class="terminal-icon" aria-hidden="true">
    <span v-if="config.icons === 'nerd'" class="terminal-nerd">{{ glyph[1] }}</span>
    <span :class="{ 'terminal-icon-fallback': config.icons === 'nerd' }">{{ glyph[0] }}</span>
  </span>
</template>

<script setup lang="ts">
import { useAppStore, useFrontmatter, useSiteConfig } from 'valaxy'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTerminalConfig } from '../composables/config'
import TerminalSearch from './TerminalSearch.vue'

const config = useTerminalConfig()
const site = useSiteConfig()
const app = useAppStore()
const frontmatter = useFrontmatter()
const route = useRoute()
const router = useRouter()
const search = ref<InstanceType<typeof TerminalSearch>>()
const mounted = ref(false)
const isPost = computed(() => route.path.startsWith('/posts/') && !!frontmatter.value.date)
const directory = computed(() => route.path === '/' ? '~' : `~${decodeURI(route.path).replace(/\/$/, '')}`)
const themeStyle = computed(() => ({
  '--terminal-accent': `var(--terminal-${config.value.accent})`,
  '--terminal-font': `"${config.value.font.family.replace(/["\\]/g, '')}", "Maple Mono NF CN", monospace`,
  fontVariantLigatures: config.value.font.ligatures ? 'normal' : 'none',
}))
function active(link: string) {
  return link === '/' ? route.path === '/' || route.path.startsWith('/page/') : route.path.startsWith(link)
}
function handleKey(event: KeyboardEvent) {
  if (!config.value.keyboard || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
    return
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select, button, [contenteditable=""], [contenteditable="true"], [role="textbox"], dialog[open]'))
    return
  if (event.key === '/' && site.value.search.enable) {
    event.preventDefault()
    search.value?.open()
  }
  if (event.key === 'q' && isPost.value) {
    event.preventDefault()
    router.push('/')
  }
}
onMounted(() => {
  // 先用与 SSG 一致的按钮属性，再更新浏览器配色，避免 hydration 遗留属性。
  mounted.value = true
  document.addEventListener('keydown', handleKey)
  // 图标字体失败时仍保留可辨认的 ASCII 和文字。
  document.fonts.load('16px "Maple Mono NF CN"', '\uf09b\uf015\uf07b\uf0c1\uf007\uf02b\uf0e0\uf09e\uf1d6\uf099\uf144\uf001\uf238\uf109\uf10b\uf11b\uf108')
    .then(fonts => { if (fonts.length) document.documentElement.classList.add('terminal-font-ready') })
    .catch(() => {})
})
onUnmounted(() => document.removeEventListener('keydown', handleKey))
</script>

<template>
  <div class="terminal-site" :style="themeStyle">
    <a class="skip-link" href="#terminal-main">跳到正文</a>
    <header class="terminal-topbar">
      <RouterLink to="/" class="terminal-brand" aria-label="博客首页"><span class="terminal-prompt">❯</span> {{ config.terminal.user }}<span class="terminal-muted">@{{ config.terminal.host }}:~</span></RouterLink>
      <div class="terminal-tools">
        <button v-if="site.search.enable" type="button" class="terminal-search-trigger" @click="search?.open()">搜索 <kbd>/</kbd></button>
        <div class="terminal-appearance" role="group" aria-label="配色模式">
          <button type="button" :aria-pressed="mounted ? !app.isDark : true" @click="app.isDark = false">light</button>
          <span aria-hidden="true">/</span>
          <button type="button" :aria-pressed="mounted ? app.isDark : false" @click="app.isDark = true">dark</button>
        </div>
      </div>
    </header>

    <div class="terminal-workspace">
      <aside class="terminal-sidebar">
        <div class="terminal-sidebar-inner">
          <p class="terminal-command terminal-tree-command"><span>❯</span> tree ~/blog</p>
          <nav class="terminal-tree" aria-label="博客导航">
            <RouterLink v-for="(item, index) in config.navigation" :key="item.link" :to="item.link" :class="{ 'is-active': active(item.link) }" :aria-current="active(item.link) ? 'page' : undefined">
              <span class="tree-branch" aria-hidden="true">{{ index === config.navigation.length - 1 ? '└──' : '├──' }}</span><TerminalIcon :name="item.icon" /><span>{{ item.text }}</span>
            </RouterLink>
          </nav>
          <div class="terminal-sidebar-socials">
            <p class="terminal-command"><span>❯</span> cat ~/.socials</p>
            <TerminalSocialLinks compact />
          </div>
          <TerminalOutline v-if="isPost && frontmatter.aside !== false && frontmatter.toc !== false && frontmatter.outline !== false" :key="route.path" />
          <p class="terminal-sidebar-note">{{ site.description }}</p>
        </div>
      </aside>
      <main id="terminal-main" class="terminal-main" tabindex="-1">
        <div class="terminal-breadcrumb"><span class="terminal-prompt">❯</span> pwd <span>{{ directory }}</span></div>
        <slot />
      </main>
    </div>

    <TerminalFooter />
    <div class="terminal-statusbar">
      <span><span class="terminal-status-dot" aria-hidden="true">●</span> {{ isPost ? 'READ' : 'NORMAL' }} <span class="terminal-status-path">{{ directory }}</span></span>
      <span class="terminal-palette"><span class="palette-dots" aria-hidden="true"><i /><i /><i /><i /></span>Catppuccin <span class="palette-light">Latte</span><span class="palette-dark">Mocha</span></span>
    </div>
    <TerminalSearch v-if="site.search.enable" ref="search" />
  </div>
</template>

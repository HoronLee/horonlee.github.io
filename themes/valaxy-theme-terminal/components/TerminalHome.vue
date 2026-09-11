<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { useTerminalConfig } from '../composables/config'
withDefaults(defineProps<{ page?: number }>(), { page: 1 })
const config = useTerminalConfig()
const site = useSiteConfig()
</script>
<template>
  <section v-if="page === 1" class="terminal-home-intro">
    <p class="terminal-command"><span>❯</span> cat README.md</p>
    <h1>{{ site.title }}<span class="terminal-cursor" aria-hidden="true">_</span></h1>
    <p class="terminal-home-description">{{ config.home.intro }}</p>
    <RouterLink to="/about/" class="terminal-about-link">[ whoami ] <span>关于我与我的设备</span></RouterLink>
    <div class="terminal-mobile-socials"><TerminalSocialLinks compact /></div>
  </section>
  <TerminalPostList :page="page" />
</template>

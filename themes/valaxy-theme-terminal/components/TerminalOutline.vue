<script setup lang="ts">
import { useOutline } from 'valaxy'
const { headers, handleClick } = useOutline()
</script>
<template>
  <nav v-if="headers.length" class="terminal-outline" aria-label="文章目录">
    <p class="terminal-command"><span>❯</span> grep '^#' <span class="terminal-muted">目录</span></p>
    <TerminalOutlineItems :headers="headers" :on-click="handleClick" />
  </nav>
</template>

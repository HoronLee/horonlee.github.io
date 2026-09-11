<script setup lang="ts">
defineProps<{ links?: { name: string, url: string, desc?: string, avatar?: string }[], random?: boolean }>()
// SSG 与 hydration 使用稳定顺序，避免随机排序造成内容错位。
</script>
<template>
  <div class="terminal-friend-links">
    <a v-for="friend in links" :key="friend.url" :href="friend.url" target="_blank" rel="noopener noreferrer">
      <img v-if="friend.avatar" :src="friend.avatar" alt="" loading="lazy" width="40" height="40">
      <div><strong>{{ friend.name }}</strong><p>{{ friend.desc }}</p></div><span aria-hidden="true">↗</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from 'valaxy'
defineProps<{ headers: MenuItem[], onClick: (event: MouseEvent) => void }>()
</script>
<template>
  <ul>
    <li v-for="header in headers" :key="header.link">
      <a :href="header.link" @click="onClick">{{ header.title }}</a>
      <TerminalOutlineItems v-if="header.children?.length" :headers="header.children" :on-click="onClick" />
    </li>
  </ul>
</template>

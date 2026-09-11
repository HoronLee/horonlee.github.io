<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const page = computed(() => Math.max(1, Number(route.params.page) || 1))
</script>
<template><TerminalHome :page="page" /></template>
<route lang="yaml">
meta:
  layout: home
</route>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  compact?: boolean
}>(), { compact: false })
const source = computed(() => props.src.trim())
const failed = ref(false)
const coverImage = ref<HTMLImageElement | null>(null)
function checkImage() {
  // SSG 图片可能在 Vue 接管之前加载失败，补接已错过的 error 事件。
  if (coverImage.value?.complete && coverImage.value.naturalWidth === 0)
    failed.value = true
}
onMounted(checkImage)
watch(source, async () => {
  failed.value = false
  await nextTick()
  checkImage()
})
</script>

<template>
  <figure v-if="source" class="terminal-cover" :class="{ 'terminal-cover-compact': compact }">
    <figcaption class="cover-command">
      <span><span class="cover-prompt" aria-hidden="true">❯</span> {{ compact ? 'cover' : 'chafa cover' }}</span>
      <a v-if="!compact && !failed" :href="source" target="_blank" rel="noopener noreferrer" aria-label="查看封面原图">[查看原图]</a>
    </figcaption>
    <div class="cover-viewport">
      <img v-if="!failed" ref="coverImage" :src="source" :alt="alt" :loading="compact ? 'lazy' : 'eager'" :fetchpriority="compact ? 'auto' : 'high'" decoding="async" @error="failed = true">
      <p v-else class="cover-fallback"><span aria-hidden="true">[ ! ]</span> 封面暂时无法加载</p>
    </div>
  </figure>
</template>

<style scoped>
.terminal-cover { min-width: 0; margin: 26px 0 0; overflow: hidden; border: 1px solid var(--terminal-line); background: var(--terminal-mantle); }
.cover-command { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 36px; padding: 6px 12px; border-bottom: 1px solid var(--terminal-line); color: var(--terminal-muted); font-size: 11px; line-height: 1.6; }
.cover-prompt { margin-right: 7px; color: var(--terminal-green); }
.cover-command a { color: var(--terminal-accent); white-space: nowrap; }
.cover-command a:hover { text-decoration: underline; text-underline-offset: 4px; }
.cover-viewport { display: grid; place-items: center; aspect-ratio: 16 / 7; }
.cover-viewport img { display: block; width: 100%; height: 100%; min-height: 0; max-height: 340px; aspect-ratio: 16 / 7; object-fit: contain; }
.cover-fallback { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 16px; margin: 0; color: var(--terminal-muted); font-size: 11px; text-align: center; }
.cover-fallback > span { color: var(--terminal-peach); }
.terminal-cover-compact { margin: 0; }
.terminal-cover-compact .cover-command { min-height: 26px; padding: 3px 8px; font-size: 10px; }
.terminal-cover-compact .cover-viewport, .terminal-cover-compact img { aspect-ratio: 16 / 10; }
@media (max-width: 680px) {
  .cover-command { min-height: 44px; }
  .cover-command a { display: inline-flex; align-items: center; min-height: 32px; }
  .cover-viewport, .cover-viewport img { aspect-ratio: 16 / 10; }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, useDisplayText, useTerminalPosts } from '../composables/posts'

withDefaults(defineProps<{ title?: string | Record<string, string> }>(), { title: '归档' })
const posts = useTerminalPosts()
const display = useDisplayText()
const years = computed(() => {
  const groups = new Map<string, typeof posts.value>()
  // 归档按日期排列，不沿用首页的置顶顺序。
  const sorted = [...posts.value].sort((a, b) => formatDate(b.date).localeCompare(formatDate(a.date)))
  for (const post of sorted) {
    const year = formatDate(post.date).slice(0, 4) || '未标注日期'
    const group = groups.get(year) || []
    group.push(post)
    groups.set(year, group)
  }
  return [...groups].map(([year, entries]) => ({ year, entries }))
})
</script>

<template>
  <section class="terminal-archive" aria-label="文章归档">
    <p class="archive-command"><span aria-hidden="true">❯</span><code>history</code><span class="archive-count">{{ posts.length }} 篇文章</span></p>
    <h1 class="archive-title">{{ display(title) || '归档' }}</h1>
    <section v-for="group in years" :key="group.year" class="archive-year" :aria-label="`${group.year}的文章`">
      <h2>{{ group.year }}<span>{{ group.entries.length }} 篇</span></h2>
      <ol>
        <li v-for="post in group.entries" :key="post.path">
          <time v-if="formatDate(post.date)" :datetime="formatDate(post.date)">{{ formatDate(post.date, true) }}</time>
          <span v-else class="unknown-date">-- --</span>
          <RouterLink :to="post.path">{{ display(post.title) }}</RouterLink>
        </li>
      </ol>
    </section>
    <p v-if="!posts.length" class="archive-empty">还没有公开文章。</p>
  </section>
</template>

<style scoped>
.archive-command { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin: 0 0 28px; font-size: 13px; }
.archive-command > span:first-child { color: var(--terminal-green); }
.archive-command code { padding: 0; background: none; color: var(--terminal-text); font: inherit; }
.archive-count { margin-left: auto; color: var(--terminal-muted); font-size: 11px; }
.archive-title { margin: 24px 0 28px; color: var(--terminal-text); font-size: clamp(25px, 2.6vw, 34px); font-weight: 700; line-height: 1.6; overflow-wrap: anywhere; }
.archive-year { margin-top: 28px; }
.archive-year h2 { display: flex; align-items: baseline; gap: 12px; margin: 0 0 8px; padding-bottom: 10px; border-bottom: 1px solid var(--terminal-line); color: var(--terminal-accent); font: inherit; font-size: 17px; }
.archive-year h2 span { color: var(--terminal-muted); font-size: 11px; }
.archive-year ol { margin: 0; padding: 0; list-style: none; }
.archive-year li { display: grid; grid-template-columns: 6ch minmax(0, 1fr); gap: 16px; align-items: baseline; padding: 11px 0; font-size: 14px; line-height: 1.8; }
.archive-year time,
.unknown-date { color: var(--terminal-muted); font-size: 12px; white-space: nowrap; }
.archive-year a { color: var(--terminal-text); text-decoration: none; overflow-wrap: anywhere; }
.archive-year a:hover { color: var(--terminal-accent); text-decoration: underline; text-underline-offset: 4px; }
.archive-year a:focus-visible { outline: 2px solid var(--terminal-accent); outline-offset: 4px; }
.archive-empty { color: var(--terminal-muted); font-size: 13px; }
@media (max-width: 540px) {
  .archive-year li { gap: 10px; font-size: 13px; }
}
</style>

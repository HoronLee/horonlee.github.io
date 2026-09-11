<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate, useDisplayText, useTerminalPosts } from '../composables/posts'
import { categoryTrail, matchesCategory } from '../composables/taxonomy'

const props = defineProps<{ kind: 'tags' | 'categories', title?: string | Record<string, string> }>()
const route = useRoute()
const posts = useTerminalPosts()
const display = useDisplayText()
const label = computed(() => props.kind === 'tags' ? '标签' : '分类')
const queryKey = computed(() => props.kind === 'tags' ? 'tag' : 'category')
const selected = computed(() => {
  const value = route.query[queryKey.value]
  return (Array.isArray(value) ? value[0] : value) || ''
})
const terms = (value: unknown) => [...new Set((Array.isArray(value) ? value : [value])
  .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0))]
const entries = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts.value) {
    const names = props.kind === 'categories' ? categoryTrail(post.categories).map(entry => entry.path) : terms(post.tags)
    for (const name of names)
      counts.set(name, (counts.get(name) || 0) + 1)
  }
  return [...counts].map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
})
const matches = computed(() => selected.value
  ? posts.value.filter(post => props.kind === 'categories'
      ? matchesCategory(post.categories, selected.value)
      : terms(post.tags).includes(selected.value))
  : posts.value)
const termLink = (name?: string) => ({ path: `/${props.kind}/`, query: name ? { [queryKey.value]: name } : {} })
</script>

<template>
  <section class="terminal-taxonomy" :aria-label="`文章${label}`">
    <p class="taxonomy-command"><span aria-hidden="true">❯</span><code>ls ~/{{ kind }}</code><span class="taxonomy-count">{{ entries.length }} 个{{ label }}</span></p>
    <h1 class="taxonomy-title">{{ display(title) || label }}</h1>
    <nav v-if="entries.length" class="taxonomy-terms" :aria-label="`按${label}筛选`">
      <RouterLink :to="termLink()" :aria-current="!selected ? 'true' : undefined" :class="{ selected: !selected }">[全部]<span>{{ posts.length }}</span></RouterLink>
      <RouterLink v-for="entry in entries" :key="entry.name" :to="termLink(entry.name)" :aria-current="selected === entry.name ? 'true' : undefined" :class="{ selected: selected === entry.name }">
        {{ kind === 'tags' ? '#' : '' }}{{ display(entry.name) }}<span>{{ entry.count }}</span>
      </RouterLink>
    </nav>
    <div class="taxonomy-results">
      <h2>{{ selected ? display(selected) : '全部文章' }}<span>{{ matches.length }} 篇</span></h2>
      <ol v-if="matches.length">
        <li v-for="post in matches" :key="post.path">
          <span class="result-arrow" aria-hidden="true">&gt;</span>
          <RouterLink :to="post.path">{{ display(post.title) }}</RouterLink>
          <time v-if="formatDate(post.date)" :datetime="formatDate(post.date)">{{ formatDate(post.date) }}</time>
        </li>
      </ol>
      <p v-else class="taxonomy-empty">{{ selected ? `没有属于此${label}的公开文章。` : '还没有公开文章。' }}<RouterLink v-if="selected" :to="termLink()"> 查看全部</RouterLink></p>
    </div>
  </section>
</template>

<style scoped>
.taxonomy-command { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin: 0 0 20px; font-size: 13px; }
.taxonomy-command > span:first-child { color: var(--terminal-green); }
.taxonomy-command code { padding: 0; background: none; color: var(--terminal-text); font: inherit; }
.taxonomy-count { margin-left: auto; color: var(--terminal-muted); font-size: 11px; }
.taxonomy-title { margin: 24px 0 28px; color: var(--terminal-text); font-size: clamp(25px, 2.6vw, 34px); font-weight: 700; line-height: 1.6; overflow-wrap: anywhere; }
.taxonomy-terms { display: flex; flex-wrap: wrap; gap: 8px 12px; margin-bottom: 30px; }
.taxonomy-terms a { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; padding: 5px 8px; color: var(--terminal-muted); font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
.taxonomy-terms a.selected { color: var(--terminal-accent); background: var(--terminal-surface); }
.taxonomy-terms a span { color: var(--terminal-muted); font-size: 10px; }
.taxonomy-results h2 { display: flex; align-items: baseline; gap: 12px; margin: 0 0 6px; padding-bottom: 10px; border-bottom: 1px solid var(--terminal-line); color: var(--terminal-accent); font: inherit; font-size: 16px; overflow-wrap: anywhere; }
.taxonomy-results h2 span { color: var(--terminal-muted); font-size: 11px; white-space: nowrap; }
.taxonomy-results ol { margin: 0; padding: 0; list-style: none; }
.taxonomy-results li { display: grid; grid-template-columns: 12px minmax(0, 1fr) auto; align-items: baseline; gap: 10px; padding: 14px 0; border-bottom: 1px solid var(--terminal-line); font-size: 14px; line-height: 1.8; }
.result-arrow { color: var(--terminal-accent); }
.taxonomy-results li a { color: var(--terminal-text); overflow-wrap: anywhere; }
.taxonomy-results time { color: var(--terminal-muted); font-size: 11px; white-space: nowrap; }
.taxonomy-empty { margin-top: 22px; color: var(--terminal-muted); font-size: 13px; }
.taxonomy-empty a { color: var(--terminal-accent); }
a { text-decoration: none; }
a:hover { color: var(--terminal-accent); text-decoration: underline; text-underline-offset: 4px; }
a:focus-visible { outline: 2px solid var(--terminal-accent); outline-offset: 4px; }
@media (max-width: 540px) {
  .taxonomy-results li { grid-template-columns: 12px minmax(0, 1fr); gap: 3px 10px; font-size: 13px; }
  .taxonomy-results time { grid-column: 2; }
  .taxonomy-terms a { min-height: 44px; }
}
</style>

<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { formatDate, plainExcerpt, useDisplayText, useTerminalPosts } from '../composables/posts'
import { categoryTrail } from '../composables/taxonomy'

const props = withDefaults(defineProps<{ page?: number }>(), { page: 1 })
const site = useSiteConfig()
const posts = useTerminalPosts()
const display = useDisplayText()
const visiblePosts = computed(() => posts.value.filter(post => post.hide !== 'index'))
const pageSize = computed(() => Math.max(1, Math.floor(Number(site.value.pageSize) || 10)))
const totalPages = computed(() => Math.max(1, Math.ceil(visiblePosts.value.length / pageSize.value)))
const currentPage = computed(() => Math.max(1, Math.floor(Number(props.page) || 1)))
const pagePosts = computed(() => visiblePosts.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1)
  .filter(page => page === 1 || page === totalPages.value || Math.abs(page - currentPage.value) <= 1))
const pageLink = (page: number) => page === 1 ? '/' : `/page/${page}/`
</script>

<template>
  <section class="terminal-post-list" aria-label="文章列表">
    <div class="list-command"><span aria-hidden="true">❯</span><code>ls -lt ~/posts</code><span class="list-total">{{ visiblePosts.length }} 篇文章</span></div>
    <div v-if="pagePosts.length" class="post-rows">
      <article v-for="post in pagePosts" :key="post.path" class="post-row" :class="{ 'post-row-with-cover': post.cover?.trim() }">
        <span class="post-arrow" aria-hidden="true">&gt;</span>
        <div class="post-info">
          <h2><RouterLink :to="post.path">{{ display(post.title) }}</RouterLink></h2>
          <p v-if="post.excerpt || post.description" class="post-summary">{{ plainExcerpt(display(post.excerpt || post.description)) }}</p>
          <div v-if="post.categories || post.tags?.length" class="post-taxonomy">
            <span v-if="post.categories" class="post-categories">
              <template v-for="(category, index) in categoryTrail(post.categories)" :key="category.path">
                <span v-if="index" aria-hidden="true"> / </span><RouterLink :to="{ path: '/categories/', query: { category: category.path } }">{{ display(category.label) }}</RouterLink>
              </template>
            </span>
            <RouterLink v-for="tag in post.tags" :key="tag" :to="{ path: '/tags/', query: { tag } }">#{{ display(tag) }}</RouterLink>
          </div>
        </div>
        <time v-if="formatDate(post.date)" :datetime="formatDate(post.date)">{{ formatDate(post.date) }}</time>
        <RouterLink v-if="post.cover?.trim()" :to="post.path" class="post-cover-link" :aria-label="`阅读：${display(post.title)}`">
          <TerminalCover :src="post.cover" :alt="`${display(post.title)}的封面`" compact />
        </RouterLink>
      </article>
    </div>
    <p v-else class="list-empty">{{ visiblePosts.length ? '这一页没有文章。' : '还没有公开文章。' }}</p>
    <nav v-if="totalPages > 1 || currentPage > 1" class="post-pagination" aria-label="文章分页">
      <RouterLink v-if="currentPage > 1" :to="pageLink(Math.min(currentPage - 1, totalPages))">[上一页]</RouterLink>
      <template v-for="(page, index) in pageNumbers" :key="page">
        <span v-if="index > 0 && page - pageNumbers[index - 1] > 1" aria-hidden="true">…</span>
        <RouterLink :to="pageLink(page)" :aria-current="page === currentPage ? 'page' : undefined" :aria-label="`第 ${page} 页`">{{ page }}</RouterLink>
      </template>
      <RouterLink v-if="currentPage < totalPages" :to="pageLink(currentPage + 1)">[下一页]</RouterLink>
    </nav>
  </section>
</template>

<style scoped>
.list-command { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--terminal-line); font-size: 13px; }
.list-command > span:first-child { color: var(--terminal-green); }
.list-command code { padding: 0; background: none; color: var(--terminal-text); font: inherit; }
.list-total { margin-left: auto; color: var(--terminal-muted); font-size: 11px; }
.post-row { display: grid; grid-template-columns: 18px minmax(0, 1fr) auto; gap: 10px; padding: 22px 0; border-bottom: 1px solid var(--terminal-line); }
.post-arrow { padding-top: 2px; color: var(--terminal-accent); }
.post-info { min-width: 0; }
.post-info h2 { margin: 0; font: inherit; font-size: 16px; font-weight: 500; line-height: 1.7; overflow-wrap: anywhere; }
.post-info h2 a { color: var(--terminal-text); }
.post-info h2 a:hover { color: var(--terminal-accent); }
.post-summary { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; margin: 7px 0 0; color: var(--terminal-muted); font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
.post-taxonomy { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-top: 9px; font-size: 11px; line-height: 1.8; }
.post-taxonomy a { color: var(--terminal-accent); }
.post-categories { color: var(--terminal-muted); }
.post-categories a { color: var(--terminal-blue); }
.post-row time { padding-top: 5px; color: var(--terminal-muted); font-size: 11px; white-space: nowrap; }
.post-row-with-cover { grid-template-columns: 18px minmax(0, 1fr) 160px; }
.post-row-with-cover .post-info { grid-column: 2; grid-row: 1 / 3; }
.post-row-with-cover time { grid-column: 3; grid-row: 1; justify-self: end; }
.post-cover-link { grid-column: 3; grid-row: 2; align-self: start; display: block; min-width: 0; }
.post-cover-link:hover { text-decoration: none; }
.post-cover-link:hover :deep(.terminal-cover) { border-color: var(--terminal-accent); }
.post-pagination { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 26px; font-size: 12px; }
.post-pagination a { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; min-height: 36px; color: var(--terminal-muted); }
.post-pagination a[aria-current='page'] { background: var(--terminal-surface); color: var(--terminal-accent); }
.list-empty { padding: 22px 0; color: var(--terminal-muted); font-size: 13px; }
a { text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 4px; }
a:focus-visible { outline: 2px solid var(--terminal-accent); outline-offset: 4px; }
@media (max-width: 680px) {
  .post-row { grid-template-columns: 18px minmax(0, 1fr); gap: 5px 10px; }
  .post-row time { grid-column: 2; padding-top: 0; }
  .post-row-with-cover .post-info { grid-row: 1; }
  .post-row-with-cover time { grid-column: 2; grid-row: 2; justify-self: start; }
  .post-cover-link { grid-column: 2; grid-row: 3; width: min(100%, 280px); margin-top: 8px; }
  .post-info h2 { font-size: 15px; }
  .post-pagination a { min-height: 44px; }
}
</style>

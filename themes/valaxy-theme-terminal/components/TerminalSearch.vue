<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { plainExcerpt, useDisplayText, useTerminalPosts } from '../composables/posts'

const posts = useTerminalPosts()
const display = useDisplayText()
const router = useRouter()
const route = useRoute()
const id = useId()
const dialog = ref<HTMLDialogElement>()
const input = ref<HTMLInputElement>()
const query = ref('')
const composing = ref(false)
const navigationError = ref('')

function normalize(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase()
}

const entries = computed(() => posts.value.filter(post => post.path).map((post) => {
  const title = display(post.title) || '未命名文章'
  const excerpt = plainExcerpt(display(post.excerpt || post.description))
  const categories = Array.isArray(post.categories) ? post.categories : [post.categories]
  const labels = [...(post.tags || []), ...categories].filter(Boolean).map(display)
  return {
    path: post.path!,
    title,
    excerpt,
    labels,
    searchable: normalize([title, excerpt, ...labels].join(' ')),
  }
}))
const matches = computed(() => {
  const keyword = normalize(query.value.trim())
  return keyword ? entries.value.filter(post => post.searchable.includes(keyword)) : entries.value
})
const results = computed(() => matches.value.slice(0, 20))

async function open() {
  query.value = ''
  navigationError.value = ''
  composing.value = false
  await nextTick()
  if (!dialog.value)
    return
  if (!dialog.value.open)
    dialog.value.showModal()
  input.value?.focus()
}

function close() {
  dialog.value?.close()
}

function onEscape(event: KeyboardEvent) {
  if (event.isComposing || composing.value)
    return
  // search 输入框的原生 Esc 只清空文字，显式优先关闭搜索窗口。
  event.preventDefault()
  close()
}

async function openFirst(event: KeyboardEvent) {
  // Safari may clear isComposing on the Enter that confirms an IME candidate.
  if (composing.value || event.isComposing || event.keyCode === 229)
    return
  event.preventDefault()
  const first = results.value[0]
  if (!first)
    return
  navigationError.value = ''
  try {
    const failure = await router.push(first.path)
    if (!failure || router.resolve(first.path).fullPath === route.fullPath)
      close()
    else
      navigationError.value = '暂时无法打开这篇文章，请重新选择。'
  }
  catch {
    navigationError.value = '文章加载失败，请重试。'
  }
}

function closeCurrentResult(event: MouseEvent, path: string) {
  // An ordinary click on the current page does not change the watched route.
  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
    && router.resolve(path).fullPath === route.fullPath)
    close()
}

watch(() => route.fullPath, close)
watch(query, () => { navigationError.value = '' })
defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog" class="terminal-search" :aria-labelledby="`${id}-title`" :aria-describedby="`${id}-description`" @keydown.esc="onEscape">
    <header class="search-header">
      <h2 :id="`${id}-title`"><span aria-hidden="true">$ </span>grep -i ~/posts</h2>
      <button type="button" class="search-close" aria-label="关闭文章搜索" @click="close">×</button>
    </header>

    <div class="search-body">
      <p :id="`${id}-description`" class="search-description">搜索文章标题、摘要、标签和分类。按 Enter 打开首条结果，按 Esc 关闭。</p>
      <label class="search-field">
        <span aria-hidden="true">❯</span>
        <input
          ref="input"
          v-model="query"
          type="search"
          aria-label="搜索文章"
          :aria-describedby="`${id}-count`"
          autocomplete="off"
          placeholder="输入关键词…"
          @compositionstart="composing = true"
          @compositionend="composing = false"
          @keydown.enter="openFirst"
        >
      </label>
      <p :id="`${id}-count`" class="search-count" role="status" aria-live="polite" aria-atomic="true">
        {{ query.trim() ? `找到 ${matches.length} 篇文章` : `共 ${matches.length} 篇文章` }}<span v-if="matches.length > 20">，显示前 20 条</span>
      </p>
      <p v-if="navigationError" class="search-error" role="alert">{{ navigationError }}</p>

      <ul v-if="results.length" class="search-results" aria-label="文章搜索结果">
        <li v-for="post in results" :key="post.path">
          <RouterLink :to="post.path" class="search-result" @click="closeCurrentResult($event, post.path)">
            <span class="result-title">{{ post.title }}</span>
            <span v-if="post.excerpt" class="result-excerpt">{{ post.excerpt }}</span>
            <span v-if="post.labels.length" class="result-labels">{{ post.labels.map(label => `#${label}`).join('  ') }}</span>
          </RouterLink>
        </li>
      </ul>
      <p v-else class="search-empty">没有找到相关文章，试试其他关键词。</p>
    </div>
  </dialog>
</template>

<style scoped>
.terminal-search {
  box-sizing: border-box;
  width: min(680px, calc(100vw - 24px));
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  margin: auto;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--terminal-line);
  border-radius: 10px;
  color: var(--terminal-text);
  background: var(--terminal-bg);
  font: inherit;
  box-shadow: 0 24px 80px rgb(0 0 0 / 35%);
}
.terminal-search::backdrop { background: rgb(0 0 0 / 65%); }
.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px 10px 20px;
  border-bottom: 1px solid var(--terminal-line);
}
.search-header h2 { min-width: 0; margin: 0; font-size: 15px; font-weight: 700; overflow-wrap: anywhere; }
.search-header h2 > span, .search-field > span { color: var(--terminal-green); }
.search-close {
  display: grid;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  color: var(--terminal-muted);
  background: transparent;
  font: inherit;
  font-size: 28px;
  cursor: pointer;
}
.search-close:hover { color: var(--terminal-text); background: var(--terminal-line); }
.search-body { min-width: 0; padding: 18px 20px 22px; }
.search-description, .search-count { margin: 0 0 14px; color: var(--terminal-muted); font-size: 12px; line-height: 1.8; overflow-wrap: anywhere; }
.search-field { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--terminal-line); border-radius: 6px; }
.search-field:focus-within { border-color: var(--terminal-accent); }
.search-field input { box-sizing: border-box; width: 100%; min-width: 0; padding: 0; border: 0; outline: 0; color: var(--terminal-text); background: transparent; font: inherit; font-size: 16px; line-height: 1.8; }
.search-field input::placeholder { color: var(--terminal-muted); }
.search-count { margin: 12px 0; }
.search-results { margin: 0; padding: 0; list-style: none; }
.search-results li + li { border-top: 1px dashed var(--terminal-line); }
.search-result { display: flex; min-width: 0; flex-direction: column; gap: 7px; padding: 14px 8px; border-radius: 4px; color: inherit; text-decoration: none; overflow-wrap: anywhere; }
.search-result:hover { background: var(--terminal-line); }
.search-result:focus-visible, .search-close:focus-visible { outline: 2px solid var(--terminal-accent); outline-offset: 2px; }
.result-title { color: var(--terminal-accent); font-size: 14px; line-height: 1.6; }
.result-excerpt { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; color: var(--terminal-muted); font-size: 12px; line-height: 1.8; }
.result-labels { color: var(--terminal-teal); font-size: 11px; line-height: 1.8; }
.search-empty { margin: 24px 0 10px; color: var(--terminal-muted); font-size: 13px; line-height: 1.8; }
.search-error { color: var(--terminal-red); font-size: 12px; line-height: 1.8; }
@media (max-width: 480px) {
  .search-header { padding-left: 14px; }
  .search-body { padding: 14px; }
  .search-header h2 { font-size: 13px; }
}
</style>

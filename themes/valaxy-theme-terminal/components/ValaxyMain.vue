<script setup lang="ts">
import type { PageData, Post } from 'valaxy'
import { onClickHref, onContentUpdated, usePrevNext, useRuntimeConfig, useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate, useDisplayText } from '../composables/posts'
import { categoryTrail } from '../composables/taxonomy'

const props = defineProps<{ frontmatter: Post, data?: PageData }>()
const route = useRoute()
const router = useRouter()
const site = useSiteConfig()
const runtime = useRuntimeConfig()
const display = useDisplayText()
const layout = computed(() => props.frontmatter.layout || route.meta.layout || 'default')
const isPost = computed(() => layout.value === 'post' || (route.path.startsWith('/posts/') && !!props.frontmatter.date))
const [prev, next] = usePrevNext()
const waline = computed(() => runtime.value.addons['valaxy-addon-waline'])
onContentUpdated(() => onClickHref(router))
</script>

<template>
  <TerminalArchive v-if="layout === 'archives'" :title="frontmatter.title" />
  <TerminalTaxonomy v-else-if="layout === 'tags' || layout === 'categories'" :kind="layout" :title="frontmatter.title" />
  <TerminalProfile v-else-if="layout === 'profile'">
    <ValaxyMd :frontmatter="frontmatter"><slot /><slot name="main-content-md" /></ValaxyMd>
  </TerminalProfile>
  <section v-else class="terminal-document">
    <header class="terminal-document-header">
      <div class="terminal-document-command"><p class="terminal-command"><span>❯</span> {{ isPost ? 'less' : 'cat' }} <span class="terminal-muted">{{ display(frontmatter.title) }}.md</span></p><RouterLink v-if="isPost" to="/" class="terminal-back">[q] 返回列表</RouterLink></div>
      <h1>{{ display(frontmatter.title) }}</h1>
      <div v-if="isPost" class="terminal-post-meta">
        <time :datetime="formatDate(frontmatter.date)">{{ formatDate(frontmatter.date) }}</time>
        <span v-if="frontmatter.updated">更新 {{ formatDate(frontmatter.updated) }}</span>
        <template v-if="site.statistics.enable"><span v-if="frontmatter.wordCount">{{ frontmatter.wordCount }} 字</span><span v-if="frontmatter.readingTime">约 {{ frontmatter.readingTime }} 分钟</span></template>
      </div>
      <div v-if="isPost && frontmatter.tags?.length" class="terminal-post-tags"><RouterLink v-for="tag in frontmatter.tags" :key="String(tag)" :to="{ path: '/tags/', query: { tag: String(tag) } }">#{{ tag }}</RouterLink></div>
      <nav v-if="isPost && frontmatter.categories" class="terminal-post-tags" aria-label="文章分类"><RouterLink v-for="category in categoryTrail(frontmatter.categories)" :key="category.path" :to="{ path: '/categories/', query: { category: category.path } }">{{ category.label }}/</RouterLink></nav>
    </header>
    <slot name="main-content-before" />
    <slot name="main-content"><ValaxyMd :frontmatter="frontmatter"><slot /><slot name="main-content-md" /></ValaxyMd></slot>
    <slot name="main-content-after" />
    <details v-if="isPost && site.sponsor.enable && frontmatter.sponsor !== false" class="terminal-sponsor">
      <summary>[ + ] {{ site.sponsor.title || '支持本站' }}</summary>
      <div><figure v-for="method in site.sponsor.methods" :key="method.name"><img :src="method.url" :alt="`${method.name}收款码`" loading="lazy" width="180"><figcaption>{{ method.name }}</figcaption></figure></div>
    </details>
    <nav v-if="isPost && frontmatter.nav !== false && (prev || next)" class="terminal-post-nav" aria-label="相邻文章">
      <RouterLink v-if="prev" :to="prev.path || '/'">← 上一篇<span>{{ display(prev.title) }}</span></RouterLink><span v-else />
      <RouterLink v-if="next" :to="next.path || '/'">下一篇 →<span>{{ display(next.title) }}</span></RouterLink>
    </nav>
    <RouterLink v-if="layout === '404'" to="/" class="terminal-back">cd ~ / 返回首页</RouterLink>
  </section>
  <section v-if="site.comment.enable && frontmatter.comment !== false && waline" class="terminal-comments" aria-label="评论">
    <h2 class="terminal-command"><span>❯</span> ./discuss <span class="terminal-muted">留言与讨论</span></h2>
    <ClientOnly><WalineClient :options="waline.options" /></ClientOnly>
  </section>
</template>

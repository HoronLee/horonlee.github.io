import { useSiteStore, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'

export function useTerminalPosts() {
  const site = useSiteStore()
  // Valaxy 已处理草稿、隐藏文章和排序；hide:index 仍应出现在归档中。
  return computed(() => site.postList)
}

export function useDisplayText() {
  const { $tO } = useValaxyI18n()
  return (value: unknown) => value == null ? '' : $tO(value as Parameters<typeof $tO>[0]) || ''
}

export function formatDate(value: unknown, short = false) {
  if (!value)
    return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime()))
    return ''
  const text = date.toISOString().slice(0, 10)
  return short ? text.slice(5) : text
}

export function plainExcerpt(value: unknown) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/&[a-zA-Z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim()
}

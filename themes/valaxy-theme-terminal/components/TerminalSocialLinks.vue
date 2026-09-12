<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useDisplayText } from '../composables/posts'

defineProps<{ compact?: boolean }>()
const site = useSiteConfig()
const display = useDisplayText()
const expanded = ref<string>()
const feedback = ref<{ name: string, message: string, shortMessage: string }>()
let feedbackTimer: ReturnType<typeof setTimeout> | undefined
let operationId = 0
let unmounted = false
const socials = computed(() => site.value.social.map((social) => {
  const isCopy = social.link.startsWith('copy:')
  return {
    ...social,
    isCopy,
    copyValue: isCopy ? social.link.slice('copy:'.length).trim() : '',
    valid: !isCopy && /^(https?:\/\/[^\s/]+(?:[/?#]|$)|mailto:|\/[^/])/.test(social.link),
  }
}))
function shortName(name: string) {
  if (name.startsWith('QQ')) return 'QQ'
  return ({ '网易云音乐': '网易云', '哔哩哔哩': 'B站', 'E-Mail': '邮箱', 'Twitter': '推特', 'Travelling': '开往' } as Record<string, string>)[name] || name
}

function socialText(name: string, compact = false) {
  if (feedback.value?.name === name)
    return compact ? feedback.value.shortMessage : feedback.value.message
  const text = display(name)
  return compact ? shortName(text) : text
}

function clearFeedback() {
  if (feedbackTimer)
    clearTimeout(feedbackTimer)
  feedbackTimer = undefined
  feedback.value = undefined
}

async function showFeedback(name: string, message: string, shortMessage: string, currentOperation: number) {
  if (unmounted || currentOperation !== operationId)
    return
  clearFeedback()
  await nextTick()
  if (unmounted || currentOperation !== operationId)
    return
  feedback.value = { name, message, shortMessage }
  feedbackTimer = setTimeout(clearFeedback, 3000)
}

async function writeClipboard(value: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value)
      return true
    }
  }
  catch {}

  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.readOnly = true
  textarea.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none'
  document.body.append(textarea)
  textarea.select()

  let copied = false
  try {
    copied = document.execCommand('copy')
  }
  catch {}
  finally {
    textarea.remove()
    activeElement?.focus({ preventScroll: true })
  }
  return copied
}

async function activateSocial(social: { name: string, isCopy: boolean, copyValue: string }) {
  const currentOperation = ++operationId
  if (!social.isCopy) {
    clearFeedback()
    expanded.value = expanded.value === social.name ? undefined : social.name
    return
  }

  expanded.value = undefined
  if (!social.copyValue) {
    await showFeedback(social.name, '没有可复制的内容', '无法复制', currentOperation)
    return
  }

  const copied = await writeClipboard(social.copyValue)
  await showFeedback(
    social.name,
    copied ? `已复制：${social.copyValue}` : `复制失败，请手动复制：${social.copyValue}`,
    copied ? '已复制' : '复制失败',
    currentOperation,
  )
}

onBeforeUnmount(() => {
  unmounted = true
  operationId++
  clearFeedback()
})
</script>

<template>
  <div class="terminal-socials" :class="{ 'terminal-socials-compact': compact }" role="group" aria-label="社交与订阅">
    <template v-for="social in socials" :key="social.name">
      <a v-if="social.valid" :href="social.link" :target="social.link.startsWith('http') ? '_blank' : undefined" rel="noopener noreferrer" :aria-label="display(social.name)">
        <TerminalIcon :name="social.icon" /><span>{{ compact ? shortName(display(social.name)) : display(social.name) }}</span>
      </a>
      <button v-else type="button" :aria-expanded="social.isCopy ? undefined : expanded === social.name" :aria-label="social.isCopy ? `复制 ${display(social.name)}` : display(social.name)" :title="social.isCopy ? `点击复制 ${display(social.name)}` : undefined" @click="activateSocial(social)">
        <TerminalIcon :name="social.icon" /><span>{{ socialText(social.name, compact) }}</span>
      </button>
      <p v-if="!social.valid && !social.isCopy && expanded === social.name" class="terminal-social-detail">{{ display(social.name) }}</p>
    </template>
    <span class="terminal-social-feedback" role="status" aria-live="polite" aria-atomic="true">{{ feedback?.message || '' }}</span>
  </div>
</template>

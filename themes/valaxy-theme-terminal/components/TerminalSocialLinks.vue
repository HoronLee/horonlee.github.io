<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { computed, ref } from 'vue'
import { useDisplayText } from '../composables/posts'

defineProps<{ compact?: boolean }>()
const site = useSiteConfig()
const display = useDisplayText()
const expanded = ref<string>()
const socials = computed(() => site.value.social.map(social => ({
  ...social,
  valid: /^(https?:\/\/[^\s/]+(?:[/?#]|$)|mailto:|\/[^/])/.test(social.link),
})))
function shortName(name: string) {
  if (name.startsWith('QQ')) return 'QQ'
  return ({ '网易云音乐': '网易云', '哔哩哔哩': 'B站', 'E-Mail': '邮箱', 'Twitter': '推特', 'Travelling': '开往' } as Record<string, string>)[name] || name
}
</script>

<template>
  <div class="terminal-socials" :class="{ 'terminal-socials-compact': compact }" role="group" aria-label="社交与订阅">
    <template v-for="social in socials" :key="social.name">
      <a v-if="social.valid" :href="social.link" :target="social.link.startsWith('http') ? '_blank' : undefined" rel="noopener noreferrer" :aria-label="display(social.name)">
        <TerminalIcon :name="social.icon" /><span>{{ compact ? shortName(display(social.name)) : display(social.name) }}</span>
      </a>
      <button v-else type="button" :aria-expanded="expanded === social.name" @click="expanded = expanded === social.name ? undefined : social.name">
        <TerminalIcon :name="social.icon" /><span>{{ compact ? shortName(display(social.name)) : display(social.name) }}</span>
      </button>
      <p v-if="!social.valid && expanded === social.name" class="terminal-social-detail" role="status">{{ display(social.name) }}</p>
    </template>
  </div>
</template>

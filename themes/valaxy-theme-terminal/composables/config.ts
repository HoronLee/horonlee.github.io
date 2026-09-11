import type { TerminalThemeConfig } from '../types'
import { useValaxyConfig } from 'valaxy'
import { computed } from 'vue'

export function useTerminalConfig() {
  const config = useValaxyConfig<TerminalThemeConfig>()
  return computed(() => config.value.themeConfig)
}

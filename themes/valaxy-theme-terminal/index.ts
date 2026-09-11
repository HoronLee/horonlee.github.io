import type { UserThemeConfig } from './types'

export type { TerminalThemeConfig, TerminalDevice, TerminalNavigation, UserThemeConfig } from './types'

/** 为用户的 theme.config.ts 提供主题专属类型提示。配置合并由 Valaxy 完成。 */
export function defineThemeConfig(config: UserThemeConfig) {
  return config
}

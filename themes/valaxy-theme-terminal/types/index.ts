export interface TerminalNavigation {
  text: string
  link: string
  icon: string
}

export interface TerminalDevice {
  name: string
  kind: 'laptop' | 'phone' | 'handheld' | 'other'
  details: { label: string, value: string }[]
}

export interface TerminalThemeConfig {
  accent: 'mauve' | 'blue' | 'teal'
  terminal: { user: string, host: string }
  /** Latin/code family; built-in Maple Mono NF covers Latin and Nerd icons, Chinese uses system fonts. */
  font: { family: string, ligatures: boolean }
  navigation: TerminalNavigation[]
  home: { intro: string }
  icons: 'nerd' | 'ascii'
  keyboard: boolean
  profile: {
    name: string
    age?: number
    hobbies: string[]
    bio: string
    shell: string
    terminal: string
    ascii: string
  }
  devices: TerminalDevice[]
  footer: {
    since: number
    icp: string
    moe: string
    visitors: boolean
    links: { text: string, link: string }[]
  }
}

type PartialConfig<T> = T extends unknown[] ? T : T extends object ? { [K in keyof T]?: PartialConfig<T[K]> } : T
export type UserThemeConfig = PartialConfig<TerminalThemeConfig>

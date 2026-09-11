<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useTerminalConfig } from '../composables/config'

const config = useTerminalConfig()
const site = useSiteConfig()
const colors = ['green', 'peach', 'mauve', 'blue', 'teal']
const swatches = ['surface', 'peach', 'green', 'blue', 'mauve', 'teal']

// 保留 ASCII 每一行的空白，由配置提供个人标记。
const asciiLines = computed(() => config.value.profile.ascii.split('\n'))
const profileRows = computed(() => {
  const { profile, font } = config.value
  return [
    { label: 'Name', value: profile.name },
    ...(profile.age == null ? [] : [{ label: 'Age', value: String(profile.age) }]),
    { label: 'Hobbies', value: profile.hobbies.join(' / ') || '待填写' },
    { label: 'Blog', value: profile.bio },
    { label: 'Shell', value: profile.shell },
    { label: 'Terminal', value: profile.terminal },
    { label: 'Font', value: Array.isArray(font.family) ? font.family.join(', ') : font.family },
  ].filter(row => row.value)
})
</script>

<template>
  <section class="terminal-profile" aria-label="关于我">
    <div class="profile-commands">
      <p class="profile-command"><span aria-hidden="true">❯</span><code>whoami</code></p>
      <p class="whoami-output">{{ config.terminal.user }}</p>
      <p class="profile-command"><span aria-hidden="true">❯</span><code>fastfetch --config about</code></p>
    </div>

    <div class="profile-fetch">
      <div class="profile-mark">
        <pre class="fetch-art" aria-hidden="true"><span
          v-for="(line, index) in asciiLines"
          :key="index"
          :style="{ color: `var(--terminal-${colors[index % colors.length]})` }"
        >{{ line }}{{ index < asciiLines.length - 1 ? '\n' : '' }}</span></pre>
        <p class="fetch-caption">{{ config.terminal.user }}</p>
      </div>
      <div class="profile-info">
        <h1 class="fetch-title">
          <span>{{ config.terminal.user }}</span>@<span>{{ site.title || config.terminal.host }}</span>
        </h1>
        <dl class="fetch-data">
          <template v-for="row in profileRows" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </template>
        </dl>
        <p v-if="site.subtitle" class="profile-tagline">{{ site.subtitle }}</p>
        <div class="fetch-colors" aria-hidden="true">
          <span
            v-for="(color, index) in [...swatches, ...swatches]"
            :key="index"
            :style="{ backgroundColor: `var(--terminal-${color})` }"
          />
        </div>
      </div>
    </div>

    <section v-if="config.devices.length" class="profile-devices" aria-label="主要使用的设备">
      <h2 class="profile-section-title">
        <span aria-hidden="true">❯</span><code>ls ~/devices</code><small>主要使用的设备</small>
      </h2>
      <div class="devices-grid">
        <article v-for="(device, index) in config.devices" :key="`${device.name}-${index}`" class="device">
          <p class="device-kind"><TerminalIcon :name="device.kind" /> {{ device.kind }}</p>
          <h3>{{ device.name }}</h3>
          <dl>
            <template v-for="(detail, detailIndex) in device.details" :key="`${detail.label}-${detailIndex}`">
              <dt>{{ detail.label }}</dt><dd>{{ detail.value }}</dd>
            </template>
          </dl>
        </article>
      </div>
    </section>

    <div v-if="$slots.default" class="profile-content">
      <slot />
    </div>

    <section class="profile-socials" aria-label="社交与订阅">
      <h2 class="profile-section-title">
        <span aria-hidden="true">❯</span><code>cat ~/.socials</code><small>找到我</small>
      </h2>
      <TerminalSocialLinks />
    </section>
  </section>
</template>

<style scoped>
.terminal-profile { color: var(--terminal-text); }
.profile-commands { margin-bottom: 24px; }
.profile-command,
.profile-section-title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  font: inherit;
  font-size: 13px;
  line-height: 1.8;
}
.profile-command > span,
.profile-section-title > span { color: var(--terminal-green); }
.profile-command code,
.profile-section-title code { padding: 0; background: none; color: inherit; font: inherit; }
.whoami-output { margin: 5px 0 22px 20px; color: var(--terminal-accent); font-size: 13px; }
.profile-fetch {
  display: grid;
  grid-template-columns: 155px minmax(0, 1fr);
  align-items: center;
  gap: 28px;
  margin-bottom: 38px;
}
.profile-mark { min-width: 0; }
.fetch-art {
  width: max-content;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  overflow-x: auto;
  background: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.23;
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
}
.fetch-caption { margin: 15px 0 0; color: var(--terminal-muted); font-size: 11px; text-align: center; letter-spacing: 3px; }
.profile-info { min-width: 0; }
.fetch-title {
  margin: 0 0 13px;
  padding-bottom: 9px;
  border-bottom: 1px dashed var(--terminal-line);
  font: inherit;
  font-size: 19px;
  font-weight: 500;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.fetch-title span:first-child { color: var(--terminal-accent); }
.fetch-title span:last-child { color: var(--terminal-blue); }
.fetch-data { display: grid; grid-template-columns: 8ch minmax(0, 1fr); gap: 6px 12px; margin: 0; font-size: 13px; line-height: 1.7; }
.fetch-data dt { color: var(--terminal-accent); font-weight: 500; }
.fetch-data dt::after { content: ':'; }
.fetch-data dd,
.device dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }
.profile-tagline { margin: 16px 0 0; color: var(--terminal-muted); font-size: 12px; line-height: 1.8; }
.fetch-colors { display: grid; grid-template-columns: repeat(6, 22px); grid-template-rows: 10px 10px; width: max-content; margin-top: 16px; }
.fetch-colors span:nth-child(n + 7) { opacity: .68; }
.profile-section-title { padding-bottom: 10px; border-bottom: 1px solid var(--terminal-line); }
.profile-section-title small { margin-left: auto; color: var(--terminal-muted); font-size: 11px; }
.devices-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin: 21px 0 34px; }
.device { min-width: 0; }
.device-kind { margin: 0 0 10px; color: var(--terminal-muted); font-size: 11px; }
.device-kind span { color: var(--terminal-teal); }
.device h3 { min-height: 48px; margin: 0 0 10px; font: inherit; font-size: 14px; font-weight: 500; line-height: 1.7; overflow-wrap: anywhere; }
.device dl { display: grid; grid-template-columns: 4ch minmax(0, 1fr); gap: 5px 8px; margin: 0; font-size: 12px; line-height: 1.7; }
.device dt { color: var(--terminal-muted); overflow-wrap: anywhere; }
.profile-content { margin: 0 0 32px; }
.profile-socials > .profile-section-title { margin-bottom: 12px; }
@media (max-width: 850px) {
  .profile-fetch { grid-template-columns: 120px minmax(0, 1fr); gap: 19px; }
  .fetch-art { font-size: 11px; }
  .fetch-data { grid-template-columns: 8ch minmax(0, 1fr); gap: 5px 10px; font-size: 12px; }
  .devices-grid { grid-template-columns: 1fr; gap: 18px; }
  .device { padding-bottom: 16px; border-bottom: 1px solid var(--terminal-line); }
  .device h3 { min-height: 0; }
}
@media (max-width: 540px) {
  .profile-fetch { grid-template-columns: 1fr; gap: 24px; }
  .profile-mark { display: flex; align-items: center; gap: 25px; }
  .fetch-art { flex: 0 1 auto; margin: 0; }
  .fetch-caption { min-width: 0; margin: 0; font-size: 13px; letter-spacing: 2px; overflow-wrap: anywhere; }
  .fetch-data { gap: 7px 12px; font-size: 13px; }
  .profile-section-title small { margin-left: 0; }
}
</style>

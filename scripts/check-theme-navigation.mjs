// 运行前启动 dev 或 preview；需要 PATH 中可用的 agent-browser。
// pnpm exec node scripts/check-theme-navigation.mjs http://127.0.0.1:4173
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const base = new URL(process.argv[2] || 'http://127.0.0.1:4173')
const session = `terminal-navigation-${process.pid}`
const browser = (...args) => {
  const result = JSON.parse(execFileSync('rtk', ['proxy', 'agent-browser', '--session', session, '--json', ...args], {
    encoding: 'utf8',
    timeout: 35000,
  }))
  assert.ok(result.success, result.error)
  return result.data
}
const evaluate = source => browser('eval', source).result
const wait = source => browser('wait', '--fn', source)
const navigate = path => browser('open', new URL(path, base).href)
const clickNav = label => browser('find', 'role', 'link', 'click', '--name', label, '--exact')

try {
  // 必须先访问正文，让正文内容更新钩子执行，再以 SPA 导航到筛选页。
  // 仅直接打开 /tags/ 会漏掉旧 onClickHref 全局监听导致的回归。
  navigate('/posts/GormNote')
  const anchorSelector = '.markdown-body a[href^="#"]'
  wait(`!!document.querySelector(${JSON.stringify(anchorSelector)})`)
  const anchor = evaluate(`document.querySelectorAll(${JSON.stringify(anchorSelector)})[2].getAttribute('href')`)
  browser('click', `.markdown-body a[href=${JSON.stringify(anchor)}]`)
  wait(`decodeURIComponent(location.hash) === ${JSON.stringify(anchor)}`)
  assert.ok(evaluate(`(() => { const target = document.getElementById(${JSON.stringify(anchor.slice(1))}); return !!target && target.getBoundingClientRect().top >= 0 && target.getBoundingClientRect().top < innerHeight })()`), '正文锚点没有滚动到可见区域')

  for (const [kind, label, query] of [['tags', '标签', 'tag'], ['categories', '分类', 'category']]) {
    clickNav(`${label}/`)
    wait(`!!document.querySelector('nav[aria-label="按${label}筛选"]')`)
    const selector = `nav[aria-label="按${label}筛选"]`
    const choices = evaluate(`Array.from(document.querySelectorAll('${selector} a')).slice(1, 3).map(a => ({ href: a.getAttribute('href'), name: new URL(a.href).searchParams.get('${query}'), count: Number(a.querySelector('span').textContent) }))`)
    assert.equal(choices.length, 2, `缺少${label}回归数据`)
    for (const choice of choices) {
      browser('click', `${selector} a[href=${JSON.stringify(choice.href)}]`)
      wait(`new URL(location.href).searchParams.get('${query}') === ${JSON.stringify(choice.name)} && document.querySelectorAll('.taxonomy-results li').length === ${choice.count}`)
      assert.ok(evaluate(`document.querySelector('.taxonomy-results h2').textContent.includes(${JSON.stringify(choice.name)})`), `${label}结果标题没有更新`)
      assert.equal(evaluate(`document.querySelector('${selector} a[aria-current="true"]').getAttribute('href')`), choice.href)
    }
    browser('back')
    wait(`new URL(location.href).searchParams.get('${query}') === ${JSON.stringify(choices[0].name)} && document.querySelectorAll('.taxonomy-results li').length === ${choices[0].count}`)
    navigate(choices[0].href)
    wait(`document.querySelectorAll('.taxonomy-results li').length === ${choices[0].count}`)
    browser('click', `${selector} a:first-child`)
    wait(`!new URL(location.href).searchParams.has('${query}') && document.querySelector('.taxonomy-results h2').textContent.includes('全部文章')`)
    // 重新挂载正文后再测下一类，避免整页刷新掩盖全局监听泄漏。
    navigate('/posts/GormNote')
    wait('!!document.querySelector(".markdown-body")')
  }

  clickNav('归档/')
  wait('!!document.querySelector("nav[aria-label=按年份筛选]")')
  const year = evaluate('(() => { const a=document.querySelector(".archive-filters a:nth-child(2)"); return { href:a.getAttribute("href"), year:new URL(a.href).searchParams.get("year"), count:Number(a.querySelector("span").textContent) } })()')
  browser('click', `.archive-filters a[href=${JSON.stringify(year.href)}]`)
  wait(`new URL(location.href).searchParams.get('year') === ${JSON.stringify(year.year)} && document.querySelectorAll('.archive-year').length === 1 && document.querySelectorAll('.archive-year li').length === ${year.count}`)
  navigate(year.href)
  wait(`document.querySelectorAll('.archive-year').length === 1 && document.querySelectorAll('.archive-year li').length === ${year.count}`)
  browser('click', '.archive-filters a:first-child')
  wait('!new URL(location.href).searchParams.has("year") && document.querySelectorAll(".archive-year").length > 1')
  console.log('导航验证通过：正文锚点、先访问正文后的标签/分类筛选、连续切换、选中状态、后退、刷新、全部重置与归档年份筛选。')
}
finally {
  browser('close')
}

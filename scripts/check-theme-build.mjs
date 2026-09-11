#!/usr/bin/env node
// Validate deployed output, including SSG failures that the build CLI may swallow.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.resolve(process.argv[2] || path.join(root, 'dist'))
const failures = []
const pages = new Map()
const checkedFonts = new Set()
const requiredRoutes = ['/', '/about/', '/archives/', '/tags/', '/categories/', '/links/']
const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '))

function check(condition, message) {
  if (!condition)
    failures.push(message)
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(filename) : [filename]
  })
}

function decodeEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
    if (entity[0] === '#') {
      const point = entity[1].toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number(entity.slice(1))
      return point <= 0x10FFFF ? String.fromCodePoint(point) : '\uFFFD'
    }
    return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }[entity.toLowerCase()]
  })
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(([, name, double, single, bare]) => [name.toLowerCase(), decodeEntities(double ?? single ?? bare)]))
}

function links(html) {
  return [...html.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href).filter(Boolean)
}

function visibleText(html) {
  return decodeEntities(html.replace(/<!--[^]*?-->/g, '').replace(/<(script|style|pre|code)\b[^>]*>[^]*?<\/\1\s*>/gi, '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').trim()
}

function localRoute(href) {
  if (!href.startsWith('/') || href.startsWith('//'))
    return undefined
  return decodeURIComponent(new URL(href, 'https://build.invalid').pathname)
}

function routeOutput(route) {
  const pathname = localRoute(route)
  if (!pathname)
    return undefined
  const relative = pathname.replace(/^\/+|\/+$/g, '')
  // Valaxy routes may be emitted as /route.html or /route/index.html.
  // Preserve dots, nested segments, Unicode, and ampersands in article slugs.
  const candidates = relative
    ? [path.join(dist, relative, 'index.html'), path.join(dist, `${relative}.html`), path.join(dist, relative)]
    : [path.join(dist, 'index.html')]
  return candidates.find(filename => filename.startsWith(`${dist}${path.sep}`) && existsSync(filename) && statSync(filename).isFile())
}

function validateStructure(html, name) {
  check(/^\s*<!doctype html>/i.test(html), `${name}: 缺少 HTML doctype`)
  for (const tag of ['html', 'head', 'body']) {
    check((html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length === 1
      && (html.match(new RegExp(`</${tag}\\s*>`, 'gi')) || []).length === 1, `${name}: ${tag} 文档结构不完整`)
  }
  // Rendered SSG markup uses explicit closing tags. Ignore raw-text elements so
  // example JS/CSS cannot be mistaken for HTML. This also catches truncated SSR.
  const markup = html.replace(/<!--[^]*?-->/g, '').replace(/<(script|style)\b[^>]*>[^]*?<\/\1\s*>/gi, '<$1></$1>')
  const stack = []
  for (const match of markup.matchAll(/<\/?([a-z][\w:-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*\/?>/gi)) {
    const tag = match[1].toLowerCase()
    if (match[0].startsWith('</')) {
      const opened = stack.pop()
      if (opened !== tag) {
        check(false, `${name}: HTML 标签不匹配，预期关闭 ${opened || '(无)'}，实际为 ${tag}`)
        return
      }
    }
    else if (!voidTags.has(tag) && !match[0].endsWith('/>')) {
      stack.push(tag)
    }
  }
  check(stack.length === 0, `${name}: HTML 未闭合：${stack.join(', ')}`)
}

function inspectPage(filename, required = false) {
  if (pages.has(filename))
    return pages.get(filename)
  const html = readFileSync(filename, 'utf8')
  const name = path.relative(dist, filename)
  const themed = /class=["'][^"']*\bterminal-site\b/.test(html)
  if (!themed && !required)
    return undefined
  check(themed, `${name}: 缺少 terminal-site，SSR 可能未完成`)
  validateStructure(html, name)
  const mains = [...html.matchAll(/<main\b([^>]*)>([^]*?)<\/main\s*>/gi)]
  check(mains.length === 1, `${name}: 应生成一个完整的 main 正文节点`)
  const main = mains[0]?.[2] || ''
  check(attributes(mains[0]?.[1] || '').id === 'terminal-main', `${name}: main 缺少 terminal-main 锚点`)
  check(visibleText(main).length > 20 && /<(section|article|h[1-6])\b/i.test(main), `${name}: SSR 正文为空或只有外壳`)
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = attributes(match[0])
    check(!(attrs.rel?.toLowerCase().split(/\s+/).includes('preload') && attrs.as?.toLowerCase() === 'font'), `${name}: 存在 font preload，破坏字体按字符范围加载`)
  }
  const page = { html, main, name }
  pages.set(filename, page)
  return page
}

function validateRequiredPage(route) {
  const filename = routeOutput(route)
  check(filename, `${route}: 缺少静态 HTML 产物`)
  if (!filename)
    return
  const page = inspectPage(filename, true)
  const navigation = [...page.html.matchAll(/<nav\b[^>]*>([^]*?)<\/nav\s*>/gi)]
    .find(match => attributes(match[0].slice(0, match[0].indexOf('>') + 1))['aria-label'] === '博客导航')
  check(navigation, `${page.name}: 缺少博客导航`)
  // 导航允许用户增删；验证当前配置的内部目标，不强制保留默认菜单。
  for (const href of links(navigation?.[1] || '')) {
    if (localRoute(href))
      check(routeOutput(href), `${page.name}: 导航链接 ${href} 缺少静态页面`)
  }
  check(!/\bundefined\b|\bNaN\b|\[object Object\]|未定义/i.test(visibleText(page.main)), `${page.name}: 正文出现未定义数据占位符`)
  const mainLinks = links(page.main)
  const features = {
    '/': () => /<h1\b/.test(page.main) && mainLinks.some(href => href.startsWith('/posts/')),
    '/about/': () => /whoami/.test(page.main) && /fastfetch/.test(page.main) && /<dl\b/.test(page.main),
    '/archives/': () => /<time\b/.test(page.main) && mainLinks.some(href => href.startsWith('/posts/')),
    '/tags/': () => mainLinks.some(href => href.includes('/tags/?tag=')),
    '/categories/': () => mainLinks.some(href => href.includes('/categories/?category=')),
    '/links/': () => /<h1\b/.test(page.main) && mainLinks.some(href => /^https?:\/\/[^/\s]+/.test(href)),
  }
  check(features[route](), `${page.name}: 缺少该页面的主要内容（首页文章、个人资料、归档、筛选项或友链）`)
}

function validateFonts(cssFiles) {
  let mapleFaces = 0
  for (const filename of cssFiles) {
    const css = readFileSync(filename, 'utf8')
    for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi)) {
      const href = (match[1] ?? match[2] ?? match[3]).trim()
      if (!/\.woff2(?:[?#]|$)/i.test(href) || /^(?:[a-z]+:|\/\/)/i.test(href))
        continue
      const pathname = decodeURIComponent(href.split(/[?#]/)[0])
      const target = pathname.startsWith('/') ? path.join(dist, pathname.slice(1)) : path.resolve(path.dirname(filename), pathname)
      check(target.startsWith(`${dist}${path.sep}`), `${path.relative(dist, filename)}: 字体引用越出 dist：${href}`)
      if (checkedFonts.has(target))
        continue
      checkedFonts.add(target)
      check(existsSync(target) && statSync(target).isFile(), `${path.relative(dist, filename)}: 字体文件不存在：${href}`)
      if (existsSync(target) && statSync(target).isFile())
        check(readFileSync(target).subarray(0, 4).toString() === 'wOF2', `${href}: 不是有效的 WOFF2 文件头`)
    }
    for (const match of css.matchAll(/@font-face\s*\{([^}]+)\}/gi)) {
      if (!/font-family\s*:\s*["']?Maple Mono NF["']?\s*;/i.test(match[1]))
        continue
      mapleFaces++
      check(/unicode-range\s*:\s*U\+/i.test(match[1]), `${path.relative(dist, filename)}: Maple 字体缺少 unicode-range`)
      check(/font-display\s*:\s*swap\b/i.test(match[1]), `${path.relative(dist, filename)}: Maple 字体缺少 font-display: swap`)
      check(/url\([^)]*\.woff2/i.test(match[1]), `${path.relative(dist, filename)}: Maple 字体没有自托管 WOFF2 URL`)
      const ranges = match[1].match(/unicode-range\s*:\s*([^;}]+)/i)?.[1] || ''
      const systemCjk = [[0x2E80, 0xA4CF], [0xF900, 0xFAFF], [0xFE10, 0xFE1F], [0xFE30, 0xFE6F], [0xFF00, 0xFFEF], [0x16FE0, 0x18DFF], [0x1B000, 0x1B2FF], [0x20000, 0x3FFFF]]
      for (const range of ranges.matchAll(/U\+([\dA-F]+)(?:-([\dA-F]+))?/gi)) {
        const start = Number.parseInt(range[1], 16)
        const end = Number.parseInt(range[2] || range[1], 16)
        check(!systemCjk.some(([low, high]) => start <= high && end >= low), `Maple 的 ${range[0]} 覆盖了应由系统字体渲染的中文或全角字符`)
      }
    }
  }
  check(mapleFaces > 1, 'CSS 未生成 Maple Mono NF 的 unicode-range 分片')
  check(checkedFonts.size > 1, '未找到可验证的本地 WOFF2 字体分片')
  check(!cssFiles.some(filename => /Maple Mono NF CN|maple-mono-nf-cn/i.test(readFileSync(filename, 'utf8'))), '产物仍引用旧 NF CN 中文 Web 字体')
}

function validateCodeHighlighting(cssFiles) {
  const css = cssFiles.map(filename => readFileSync(filename, 'utf8')).join('\n')
  // Shiki emits only variables with Valaxy's defaultColor:false. The themes in
  // HTML alone cannot prove that their colors reach the browser's color property.
  for (const mode of ['light', 'dark']) {
    const colorRule = new RegExp(`[^{}]*\\.(?:vp-code|shiki)[^{}]*\\{[^{}]*\\bcolor\\s*:\\s*var\\(\\s*--shiki-${mode}(?:\\s*[,)]|\\s+\\))`)
    check(colorRule.test(css), `CSS 缺少 --shiki-${mode} 到代码 token color 的映射，代码高亮会丢失`)
  }
  const article = routeOutput('/posts/GormNote')
  check(article, '缺少用于检查代码高亮的真实文章 /posts/GormNote')
  if (article) {
    const html = readFileSync(article, 'utf8')
    check(/<pre\b[^>]*\bshiki\b[^>]*\bcatppuccin-latte\b[^>]*\bcatppuccin-mocha\b/.test(html), 'GormNote 未输出 Catppuccin 双主题代码块')
    check(/<span\b[^>]*--shiki-light\s*:[^>]*--shiki-dark\s*:/.test(html), 'GormNote 未输出 Shiki 双主题 token')
  }
}

function validateCovers() {
  // Use an existing local cover so this check is independent of remote image hosts.
  const route = '/posts/Harbor-HTTPS'
  const source = readFileSync(path.join(root, 'pages/posts/Harbor-HTTPS.md'), 'utf8')
  const cover = source.match(/^cover:\s*(.+)$/m)?.[1].trim()
  check(cover, '封面检查文章 Harbor-HTTPS 缺少 cover 配置')
  if (!cover)
    return
  const hasCover = html => [...html.matchAll(/<img\b[^>]*>/g)].some(match => attributes(match[0]).src === cover)
  const article = routeOutput(route)
  check(article, '缺少用于检查封面的文章 /posts/Harbor-HTTPS')
  if (article) {
    const header = readFileSync(article, 'utf8').match(/<header\b[^>]*class="terminal-document-header"[^>]*>([^]*?)<\/header>/)?.[1] || ''
    check(hasCover(header), 'Harbor-HTTPS 文章头部没有渲染已配置的 cover')
  }
  const rows = [...pages.values()].flatMap(page => [...page.main.matchAll(/<article\b[^>]*class="post-row\b[^>]*>([^]*?)<\/article>/g)].map(match => match[1]))
  const listing = rows.find(row => links(row).some(href => localRoute(href)?.replace(/\/$/, '') === route))
  check(listing && hasCover(listing), '文章列表没有渲染 Harbor-HTTPS 的 cover')
}

try {
  if (!existsSync(dist))
    throw new Error(`构建目录不存在：${dist}`)
  const files = walk(dist)
  for (const route of requiredRoutes)
    validateRequiredPage(route)
  for (const filename of files.filter(filename => filename.endsWith('.html')))
    inspectPage(filename)
  const index = pages.get(path.join(dist, 'index.html'))
  const linkedRoutes = new Set(links(index?.html || '').filter(href => /^\/(?:page|posts)\//.test(href)))
  check(linkedRoutes.size > 0, '首页没有文章或分页链接')
  for (const route of linkedRoutes) {
    const filename = routeOutput(route)
    check(filename, `首页链接 ${route} 没有对应的静态 HTML 产物`)
    if (filename)
      inspectPage(filename, true)
  }
  validateFonts(files.filter(filename => filename.endsWith('.css')))
  validateCodeHighlighting(files.filter(filename => filename.endsWith('.css')))
  validateCovers()
  if (failures.length) {
    console.error(`主题产物验证失败（${failures.length} 项）：\n${failures.map(message => `- ${message}`).join('\n')}`)
    process.exitCode = 1
  }
  else {
    console.log(`主题产物验证通过：${pages.size} 个 SSR 页面、${linkedRoutes.size} 个首页文章/分页链接、${checkedFonts.size} 个本地 WOFF2 字体文件；无字体预加载。`)
  }
}
catch (error) {
  console.error(`主题产物验证失败：${error.message}`)
  process.exitCode = 1
}

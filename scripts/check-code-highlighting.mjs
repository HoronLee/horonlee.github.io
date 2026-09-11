// Requires rtk and agent-browser (with Chromium installed), plus a running dev/preview server.
// Exercises real article markup, both theme buttons, and desktop/mobile overflow.
// rtk node scripts/check-code-highlighting.mjs [http://127.0.0.1:4173]
import { execFileSync } from 'node:child_process'

const origin = process.argv[2] || 'http://127.0.0.1:4173'
const session = `terminal-code-check-${process.pid}`
const browser = (...args) => execFileSync('rtk', ['proxy', 'agent-browser', '--session', session, ...args], { encoding: 'utf8' })

try {
  browser('open', new URL('/posts/GormNote', origin).href)
  browser('wait', 'pre.shiki span[style]')
  for (const width of [1440, 390]) {
    browser('set', 'viewport', String(width), '900')
    for (const mode of ['light', 'dark']) {
      browser('find', 'role', 'button', 'click', '--name', mode, '--exact')
      browser('wait', '--fn', `document.documentElement.classList.contains('dark') === ${mode === 'dark'}`)
      const result = browser('eval', `(() => {
        const assert = (ok, message) => { if (!ok) throw Error(message) };
        const blocks = [...document.querySelectorAll('.markdown-body pre.shiki')];
        const tokens = blocks.flatMap(block => [...block.querySelectorAll('span[style]')]);
        const colors = [...new Set(tokens.map(token => getComputedStyle(token).color))];
        assert(blocks.length > 0 && colors.length >= 3, 'Syntax highlighting missing: ' + JSON.stringify({ blocks: blocks.length, colors }));
        const keyword = tokens.find(token => token.textContent === 'import');
        assert(getComputedStyle(keyword).color === '${mode === 'dark' ? 'rgb(203, 166, 247)' : 'rgb(136, 57, 239)'}', 'Incorrect Catppuccin keyword color');
        const comment = tokens.find(token => token.textContent.includes('//由于'));
        assert(getComputedStyle(comment).fontStyle === 'italic', 'Shiki comment font style missing');
        assert(blocks.every(block => parseFloat(getComputedStyle(block.querySelector('code')).fontSize) >= 12), 'Code font too small');
        assert(blocks.every(block => getComputedStyle(block.querySelector('code')).fontFamily.split(',')[0].trim().replace(/["']/g, '') === 'Maple Mono NF'), 'Code font family changed');
        assert(document.documentElement.scrollWidth <= window.innerWidth + 1, 'Code causes page overflow');
        const wide = blocks.find(block => block.scrollWidth > block.clientWidth);
        if (window.innerWidth < 700) assert(wide, 'Expected a real long code line to check horizontal scrolling');
        if (wide) {
          wide.scrollLeft = 100;
          assert(wide.scrollLeft > 0 && getComputedStyle(wide).overflowX === 'auto', 'Long code cannot scroll horizontally');
        }
        return { mode: '${mode}', width: window.innerWidth, blocks: blocks.length, tokenColors: colors.length, keyword: getComputedStyle(keyword).color, codeFontSize: getComputedStyle(keyword).fontSize, scrollLeft: wide?.scrollLeft || 0 };
      })()`)
      console.log(result.trim())
    }
  }
} finally {
  browser('close')
}

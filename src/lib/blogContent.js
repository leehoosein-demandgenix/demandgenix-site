// Renders a blog post's Sanity content to clean, semantic HTML. Styling lives in v2.css under .dg-prose.
// All text is escaped, and link addresses are limited to http(s), mailto, tel and on-site paths.
//
// Hooks other code depends on:
//   .callout-box      the AEO "speakable" selector on the demand-gen vs lead-gen post
//   faqHeadingId      the id given to the first "FAQ" heading, used by the same selector

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeHref = (h) => (/^(https?:|mailto:|tel:|\/|#)/i.test(h || '') ? h : '#')

function renderChildren(block) {
  const defs = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d]))
  return (block.children || [])
    .map((child) => {
      let html = esc(child.text)
      for (const mark of child.marks || []) {
        if (mark === 'strong') html = `<strong>${html}</strong>`
        else if (mark === 'em') html = `<em>${html}</em>`
        else if (mark === 'code') html = `<code>${html}</code>`
        else if (defs[mark]?._type === 'link' && defs[mark].href) {
          const href = safeHref(defs[mark].href)
          const external = /^https?:/i.test(href)
          html = `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${html}</a>`
        }
      }
      return html
    })
    .join('')
}

const plainText = (block) => (block.children || []).map((c) => c.text || '').join('')

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

function table({ caption, headers, rows, firstIsLabel = true }) {
  const head = headers.map((h) => `<th scope="col">${esc(h)}</th>`).join('')
  const body = rows
    .map((row) => {
      const cells = row.map((cell, i) => (i === 0 && firstIsLabel ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`))
      return `<tr>${cells.join('')}</tr>`
    })
    .join('')
  const cap = caption ? `<caption>${esc(caption)}</caption>` : ''
  return `<div class="dg-table-wrap" role="region" tabindex="0" aria-label="${esc(caption || 'Table')}"><table>${cap}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`
}

const CALLOUT_LABELS = { insight: 'Insight', warning: 'Warning', tip: 'Tip' }

function renderBlock(block, ctx) {
  switch (block._type) {
    case 'code':
    case 'codeBlock': {
      const lang = block.language || 'text'
      const file = block.filename ? `<div class="dg-code__file">${esc(block.filename)}</div>` : ''
      return `<div class="dg-code">${file}<pre data-language="${esc(lang)}"><code>${esc(block.code)}</code></pre></div>`
    }
    case 'image': {
      if (!block.asset?.url) return ''
      const cap = block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''
      return `<figure><img src="${esc(block.asset.url)}?w=1200&auto=format&q=80" alt="${esc(block.alt)}" loading="lazy" decoding="async">${cap}</figure>`
    }
    case 'threeColumnBlock': {
      if (!block.columns?.length) return ''
      const cols = block.columns.map((c) => `<div><h4>${esc(c.title)}</h4><p>${esc(c.content)}</p></div>`).join('')
      return `<div class="dg-cols3">${cols}</div>`
    }
    case 'twoColumnTable':
      return table({
        headers: [block.col1Header, block.col2Header],
        rows: (block.rows || []).map((r) => [r.label, r.value])
      })
    case 'comparisonTable':
      return table({
        headers: [block.col1Header, block.col2Header, block.col3Header],
        rows: (block.rows || []).map((r) => [r.col1, r.col2, r.col3])
      })
    case 'fiveColumnTable':
      return table({
        caption: block.tableTitle,
        headers: [block.col1Header, block.col2Header, block.col3Header, block.col4Header, block.col5Header],
        rows: (block.rows || []).map((r) => [r.col1, r.col2, r.col3, r.col4, r.col5])
      })
    case 'calloutBox': {
      const type = CALLOUT_LABELS[block.type] ? block.type : 'insight'
      const title = block.title ? `<p class="dg-callout__title">${esc(block.title)}</p>` : ''
      return `<aside class="callout-box dg-callout dg-callout--${type}"><span class="dg-callout__label">${CALLOUT_LABELS[type]}</span>${title}<p>${esc(block.content)}</p></aside>`
    }
    case 'block': {
      const inner = renderChildren(block)
      if (!inner) return ''
      switch (block.style) {
        case 'h2':
        case 'h3':
        case 'h4': {
          const text = plainText(block)
          let id = slugify(text)
          if (block.style === 'h2' && ctx.faqHeadingId && !ctx.faqIdUsed && /faq|frequently asked/i.test(text)) {
            id = ctx.faqHeadingId
            ctx.faqIdUsed = true
          } else if (id) {
            let n = 2
            const base = id
            while (ctx.ids.has(id)) id = `${base}-${n++}`
          }
          ctx.ids.add(id)
          return `<${block.style}${id ? ` id="${esc(id)}"` : ''}>${inner}</${block.style}>`
        }
        case 'blockquote':
          return `<blockquote><p>${inner}</p></blockquote>`
        default:
          return `<p>${inner}</p>`
      }
    }
    default:
      return ''
  }
}

export function renderBlocks(blocks, { faqHeadingId } = {}) {
  if (!Array.isArray(blocks)) return ''
  const ctx = { ids: new Set(), faqHeadingId, faqIdUsed: false }
  const out = []
  let list = null // { tag, items: [] }

  const flush = () => {
    if (list) out.push(`<${list.tag}>${list.items.join('')}</${list.tag}>`)
    list = null
  }

  for (const block of blocks) {
    if (block?.listItem === 'bullet' || block?.listItem === 'number') {
      const tag = block.listItem === 'bullet' ? 'ul' : 'ol'
      if (!list || list.tag !== tag) {
        flush()
        list = { tag, items: [] }
      }
      list.items.push(`<li>${renderChildren(block)}</li>`)
      continue
    }
    flush()
    const html = renderBlock(block, ctx)
    if (html) out.push(html)
  }
  flush()
  return out.join('\n')
}

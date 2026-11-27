// Applies the November 2026 copy changes to Sanity as DRAFTS. Nothing goes live: open Studio, review each
// draft, then press Publish.
//
//   node --env-file=.env scripts/patch-copy-2026-11.mjs --dry-run    show before and after, change nothing
//   node --env-file=.env scripts/patch-copy-2026-11.mjs              write the drafts
//   node --env-file=.env scripts/patch-copy-2026-11.mjs --force      also replace drafts that already exist
//
// Needs SANITY_WRITE_TOKEN (the line in .env). Each draft is a copy of the published document with only the
// fields listed below changed. A field is changed only if its published wording matches `from` exactly.
// Anything else is reported and left alone. This script never publishes.
import { randomUUID } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { createClient } from '@sanity/client'
import { rt } from '../src/content/defaults.js'

// --- What changes ------------------------------------------------------------
// Paths read like the schema. [o1] picks the list item with that key, and [=] picks the line in a plain
// list whose text matches. Rich text is written as a list of paragraphs, with **bold** shown like that.
// `null` means the field is empty: as `from` it must not be filled in yet, as `to` it is cleared.
const change = (doc, path, from, to) => ({ doc, path, from, to })

export const CHANGES = [
  // Site settings
  change('siteSettings', 'ctaNote',
    '30 minutes. An honest read on whether I can help.',
    '30 minutes, free, to see whether I can help.'),
  change('siteSettings', 'siteDescription',
    'DemandGenix is a one-person marketing practice in Manchester run by Lee Hoosein. It takes on the ads, website and follow-up that are meant to bring in new business, and says plainly what they return and what can’t be tracked.',
    'DemandGenix is a one-person marketing practice in Manchester run by Lee Hoosein. It takes on the ads, website and follow-up that are meant to bring in new business, and reports what they return and what can’t be tracked.'),
  change('siteSettings', 'spendWidget.areas[w1].untraceable',
    'Someone sees an ad, searches your name a week later, and it all shows up as direct.',
    'A colleague recommends you, and the enquiry arrives with no source at all.'),

  // Home page
  change('homePage', 'heroKicker', 'Lee Hoosein · Manchester', 'Lee Hoosein, Manchester'),
  change('homePage', 'heroSub',
    'I run the ads, website and follow-up that bring in new business. First, I work out what’s actually happening.',
    'I run the ads, website and follow-up that bring in new business. First, I work out what’s happening.'),
  change('homePage', 'offerLede',
    'The marketing that’s meant to bring in new business. I run it, and I make it earn its keep.',
    'The marketing that’s meant to bring in new business, run by me and judged on what it brings in.'),
  change('homePage', 'offerItems[o1].description',
    'Who they’re aimed at, what they say, and whether they’re paying for themselves.',
    'Whether the ads reach the right people and pay for themselves.'),
  change('homePage', 'offerItems[o2].description',
    'Whether it says what you sell, whether the forms work, and whether a visitor knows what to do next.',
    'Whether it’s clear what you sell and the forms work, so visitors know what to do next.'),
  change('homePage', 'offerItems[o3].description',
    'What happens after someone gets in touch: how quickly, how well, and whether anyone can tell where it came from.',
    'What happens after someone gets in touch, including how fast they hear back and whether anyone records where they came from.'),
  change('homePage', 'honestHeading',
    'Some of it can be fixed. Some of it can’t even be tracked.',
    'What can be fixed, and what can’t be tracked'),
  change('homePage', 'honestLabel', 'The honest bit', null),
  change('homePage', 'honestBody',
    [
      'Most companies I start with are spending money and can’t tell what’s coming back from it. So I work that out first.',
      'Some of it turns out to be fixable: a form that quietly fails, ads aimed at the wrong people, enquiries left waiting. Some of it genuinely can’t be traced any more. Someone sees an ad, searches your name a week later, and it all shows up as direct. With a few dozen deals a quarter, no test will settle it either.',
      '**I’ll tell you which is which,** rather than sell you a dashboard that pretends otherwise.'
    ],
    [
      'Most companies I start with are spending money and can’t tell what’s coming back from it, so I work that out first.',
      'Some problems turn out to be fixable: a form that stopped sending enquiries, ads aimed at the wrong people, enquiries left waiting. Others can’t be traced any more, like a recommendation in a private Slack group, and with a few dozen deals a quarter no test will settle it either.',
      'I’ll tell you early which is which, so you’re not paying for a report that claims more than the data shows.'
    ]),
  // Replaces the three "How we’d start" steps, which stay saved but are no longer shown on the Home page.
  change('homePage', 'startBody', null,
    [
      'First there’s a free 30-minute call about what you’re spending and what you’re seeing. If it’s a fit, I agree a first piece of work with you in writing, and once it’s done you decide whether I carry on.',
      '[Here’s how working together starts.](/services/#how-we-would-start)'
    ]),
  change('homePage', 'proofHeading', 'What’s been said, and what’s been done', 'Work and feedback'),
  change('homePage', 'aboutBody',
    [
      'I’ve spent 20 years in marketing, including at Allianz Business Services, Aldermore, Sorted and Diffblue. DemandGenix is just me, on purpose: you get me doing the work, not an account manager passing it on.',
      'I take on a small number of clients at a time, and I’ll tell you straight if I’m not the right fit.'
    ],
    [
      'I’ve spent 20 years in marketing, including at Allianz Business Services, Aldermore, Sorted and Diffblue. DemandGenix is just me, on purpose, so the person you speak to is the person doing the work.',
      'I take on a small number of clients at a time, and I’ll tell you if I’m not the right fit.'
    ]),
  change('homePage', 'closingHeading',
    'Want a straight answer on where your marketing money goes?',
    'Want to know where your marketing money goes?'),
  change('homePage', 'closingNote', 'Thirty minutes, free. If I can’t help, I’ll say so.', 'Thirty minutes, free.'),

  // Services page
  change('servicesPage', 'heroSub',
    'The ads, website and follow-up, run by me. First, I work out what’s actually happening.',
    'The ads, website and follow-up, run by me. First, I work out what’s happening.'),
  change('servicesPage', 'whoTail', 'Sector doesn’t matter. The situation does.', 'That can be a company in any sector.'),
  change('servicesPage', 'areas[a1].whatIDo',
    ['I run the paid ads. That means the targeting, the wording, the budget and the judgement about what to switch off. If something shouldn’t be running, I’ll say so.'],
    ['I run the paid ads. That means the targeting, the wording, the budget and the judgement about what to switch off. If something shouldn’t be running, I’ll switch it off or tell you why.']),
  change('servicesPage', 'areas[a1].lookFirst[=]',
    'Which campaigns produce enquiries a salesperson actually wants',
    'Which campaigns produce enquiries a salesperson wants'),
  change('servicesPage', 'areas[a2].lookFirst[=]',
    'Whether the enquiry form actually reaches you',
    'Whether enquiries from the form reach you'),
  change('servicesPage', 'honestHeading',
    'Some of it can be fixed. Some of it can’t even be tracked.',
    'What can and can’t be tracked'),
  change('servicesPage', 'honestLabel', 'The honest bit', null),
  change('servicesPage', 'honestBody',
    [
      'The part of a buyer’s journey you can actually see is shrinking. So I tell you early which is which, **rather than sell you a dashboard that pretends otherwise.**',
      'Click through the three areas to see the kind of thing I mean.'
    ],
    ['Less of a buyer’s journey shows up in your analytics each year, so I’ll tell you early which problems can be fixed and which can’t be measured. Here’s the kind of thing I find in each area.']),
  change('servicesPage', 'startSteps[s1].body',
    ['Thirty minutes. You tell me what you’re spending and what you’re seeing. I tell you honestly whether I can help. If I can’t, I’ll say so.'],
    ['Thirty minutes. You tell me what you’re spending and what you’re seeing. I’ll tell you whether I can help.']),
  change('servicesPage', 'startSteps[s2].body',
    ['If it’s a fit, I go into your accounts and come back with what’s actually happening and what I’d do over the next 90 days. It’s scoped and agreed in writing first, and you get it live, in a conversation, not as a PDF. I’ll talk you through what it involves and costs on the intro call.'],
    ['If it’s a fit, I go into your accounts and come back with what’s happening and what I’d do over the next 90 days. It’s scoped and agreed in writing first, and I talk you through the findings in a meeting. I’ll explain what it involves and costs on the intro call.']),
  change('servicesPage', 'isntHeading', 'What this isn’t', 'What you get'),
  change('servicesPage', 'isntBody', null,
    ['Plain reporting on what can be measured, and a clear note on what can’t. If most of your marketing is working, I’ll tell you that too. And it’s me doing the work from start to finish.']),
  change('servicesPage', 'faqs[f1].answer',
    ['I run the marketing that’s meant to bring in new business: the ads, the website, and the follow-up when someone gets in touch. I start by working out what’s really happening, fix what can be fixed, and tell you plainly what can’t be tracked.'],
    ['I run the marketing that’s meant to bring in new business: the ads, the website, and the follow-up when someone gets in touch. I start by working out what’s happening, fix what I can, and tell you what can’t be tracked.']),
  change('servicesPage', 'faqs[f2].answer',
    ['Some of it, yes. Some of it genuinely can’t be tracked any more: someone sees an ad, searches your name later, and it shows up as direct. I’ll show you which is which, early, rather than draw a chart that pretends everything is measurable.'],
    ['Some of it, yes. Some of it can’t be tracked any more. Someone sees an ad, searches your name a week later, and it shows up as direct traffic. I’ll show you early which parts can be measured.']),
  change('servicesPage', 'faqs[f4].answer',
    ['It’s me doing the work. DemandGenix is a one-person practice, on purpose, so you won’t be handed to an account manager or a team you never meet.'],
    ['It’s me doing the work. DemandGenix is a one-person practice, so you won’t be handed to an account manager or a team you never meet.']),
  change('servicesPage', 'closingHeading',
    'Want a straight answer on where your marketing money goes?',
    'Want to know where your marketing money goes?'),
  change('servicesPage', 'closingNote', 'Thirty minutes, free. If I can’t help, I’ll say so.', 'Thirty minutes, free.'),

  // Contact page
  change('contactPage', 'heroHeadline',
    'Let’s have a straight conversation about where your marketing money goes.',
    'Let’s talk about where your marketing money goes.'),
  change('contactPage', 'heroSub',
    'Book a free 30-minute intro call. You tell me what you’re spending and what you’re seeing, and I tell you honestly whether I can help.',
    'Book a free 30-minute intro call. You tell me what you’re spending and what you’re seeing, and I’ll tell you whether I can help.'),
  // Replaces the three "What to expect" steps, which stay saved but are no longer shown.
  change('contactPage', 'expectBody', null,
    ['I’ll reply within 24 hours, usually sooner during UK business hours. If it’s a fit after the call, I’ll set out in writing what a first piece of work involves and costs before you commit to anything.'])
]

// --- Reading and writing one field -------------------------------------------
const newKey = () => randomUUID().replace(/-/g, '').slice(0, 12)
const isRich = (c) => Array.isArray(c.from) || Array.isArray(c.to)

// A block as comparable text. Any formatting the copy above does not describe shows up as a tag, so a
// paragraph someone has since re-formatted counts as changed.
function toMarkup(block) {
  if (block?._type !== 'block' || (block.style || 'normal') !== 'normal' || block.listItem) return `<${block?.style || block?._type}>`
  const links = new Map((block.markDefs || []).map((d) => [d._key, d]))
  return (block.children || [])
    .map((child) => {
      if (child._type !== 'span') return `<${child._type}>`
      return (child.marks || []).reduce((text, mark) => {
        if (mark === 'strong') return `**${text}**`
        if (links.get(mark)?._type === 'link') return `[${text}](${links.get(mark).href})`
        return `<${mark}>${text}</${mark}>`
      }, child.text)
    })
    .join('')
}

// New paragraphs keep the key of the paragraph they replace.
function toBlocks(paragraphs, previous = []) {
  return rt(...paragraphs).map((block, i) => ({
    ...block,
    _key: previous[i]?._key || newKey(),
    children: block.children.map((child) => ({ ...child, _key: newKey() }))
  }))
}

// Finds the object and property a path points at, or null if part of the path does not exist.
function locate(document, change) {
  const parts = change.path.split('.')
  let node = document
  for (let i = 0; i < parts.length; i++) {
    const [, name, selector] = parts[i].match(/^(\w+)(?:\[(.+)\])?$/)
    const last = i === parts.length - 1
    if (!selector) {
      if (last) return { holder: node, key: name }
      node = node?.[name]
    } else if (selector === '=') {
      const list = node?.[name]
      if (!Array.isArray(list)) return null
      let index = list.indexOf(change.from)
      if (index < 0) index = list.indexOf(change.to)
      return index < 0 ? null : { holder: list, key: index }
    } else {
      node = node?.[name]?.find((item) => item?._key === selector)
    }
    if (!node) return null
  }
  return null
}

function read(document, change) {
  const at = locate(document, change)
  if (!at) return { found: false, value: undefined }
  const raw = at.holder[at.key]
  if (raw === undefined || raw === null || raw === '' || (Array.isArray(raw) && !raw.length)) return { found: true, value: null }
  if (isRich(change)) return { found: true, value: Array.isArray(raw) ? raw.map(toMarkup) : raw }
  return { found: true, value: raw }
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// 'apply' (matches `from`), 'done' (already says `to`) or 'mismatch' (says something else).
export function statusOf(document, change) {
  const { found, value } = read(document, change)
  if (!found) return 'mismatch'
  if (same(value, change.to)) return 'done'
  return same(value, change.from) ? 'apply' : 'mismatch'
}

function write(document, change) {
  const { holder, key } = locate(document, change)
  if (change.to === null) delete holder[key]
  else if (isRich(change)) holder[key] = toBlocks(change.to, holder[key])
  else holder[key] = change.to
}

// --- Output ------------------------------------------------------------------
function show(value, sign) {
  if (value === undefined) return `    ${sign} (this field or list item could not be found)`
  if (value === null) return `    ${sign} (empty)`
  return [value].flat().map((line) => `    ${sign} ${typeof line === 'string' ? line : JSON.stringify(line)}`).join('\n')
}

// Top-level fields where two versions of a document differ, ignoring Sanity's bookkeeping.
function differingFields(a, b) {
  const skip = new Set(['_id', '_rev', '_createdAt', '_updatedAt', '_system'])
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => !skip.has(k) && !same(a[k], b[k]))
}

// --- Run ---------------------------------------------------------------------
export async function run({ client, args, log = console.log }) {
  const unknown = args.filter((a) => a !== '--dry-run' && a !== '--force')
  if (unknown.length) {
    log(`Unknown option: ${unknown.join(' ')}. Use --dry-run and/or --force. Nothing was written.`)
    return 1
  }
  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')
  const mismatches = []
  const blocked = []
  const writes = []

  for (const id of [...new Set(CHANGES.map((c) => c.doc))]) {
    const changes = CHANGES.filter((c) => c.doc === id)
    const published = await client.getDocument(id)
    const draft = await client.getDocument(`drafts.${id}`)
    log(`\n=== ${id} ===`)
    if (!published) {
      log('  No published document found. Skipped.')
      for (const c of changes) mismatches.push({ ...c, actual: undefined })
      continue
    }

    const next = structuredClone(published)
    const applying = []
    let done = 0
    for (const c of changes) {
      const status = statusOf(published, c)
      if (status === 'done') done++
      else if (status === 'mismatch') mismatches.push({ ...c, actual: read(published, c).value })
      else {
        log(`\n  ${c.path}`)
        log(show(c.from, '-'))
        log(show(c.to, '+'))
        write(next, c)
        applying.push(c)
      }
    }
    log(`\n  ${applying.length} to change, ${done} already published, ${changes.length - applying.length - done} not matching.`)
    if (!applying.length) continue

    if (draft) {
      if (applying.every((c) => statusOf(draft, c) === 'done')) {
        log('  A draft with these changes already exists. Nothing to write: review and publish it in Studio.')
        continue
      }
      const edits = differingFields(published, draft)
      const summary = edits.length ? edits.join(', ') : 'none'
      if (!force) {
        log(`  A DRAFT ALREADY EXISTS and will not be overwritten. Fields where it differs from the published page: ${summary}.`)
        blocked.push(id)
        continue
      }
      log(`  --force: the existing draft will be replaced. Unpublished differences that will be LOST: ${summary}.`)
    }

    delete next._rev
    delete next._updatedAt
    next._id = `drafts.${id}`
    writes.push({ document: next, replace: Boolean(draft) })
  }

  if (mismatches.length) {
    log('\n=== NOT CHANGED: published wording does not match what was expected ===')
    for (const m of mismatches) {
      log(`\n  ${m.doc} > ${m.path}`)
      log('   expected:')
      log(show(m.from, ' '))
      log('   found:')
      log(show(m.actual, ' '))
    }
  }

  if (blocked.length) {
    log(`\nStopped because a draft already exists for: ${blocked.join(', ')}. Nothing was written.`)
    log('Publish or discard those drafts in Studio and run again, or add --force to replace them.')
    return 1
  }
  if (dryRun) {
    log(`\nDry run only. Nothing was written. ${writes.length} draft(s) would be written.`)
    return mismatches.length ? 2 : 0
  }
  if (!writes.length) {
    log('\nNothing to write.')
    return mismatches.length ? 2 : 0
  }

  // One transaction: either every draft is written or none is. `create` fails if a draft has appeared since
  // the check above, so an unforced run can never overwrite one.
  const transaction = client.transaction()
  for (const { document, replace } of writes) {
    if (!document._id.startsWith('drafts.')) throw new Error(`Refusing to write a non-draft: ${document._id}`)
    if (replace) transaction.createOrReplace(document)
    else transaction.create(document)
  }
  await transaction.commit()
  log(`\nWrote ${writes.length} draft(s): ${writes.map((w) => w.document._id).join(', ')}.`)
  log('Nothing is live yet. Open Studio, review each draft, then press Publish.')
  return mismatches.length ? 2 : 0
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    console.error('SANITY_WRITE_TOKEN is not set. Run with: node --env-file=.env scripts/patch-copy-2026-11.mjs --dry-run')
    process.exit(1)
  }
  const client = createClient({ projectId: 'fv5q0f3v', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token })
  run({ client, args: process.argv.slice(2) })
    .then((code) => { process.exitCode = code })
    .catch((error) => {
      console.error(`\nFailed: ${error.message}\nNo drafts were written.`)
      process.exitCode = 1
    })
}

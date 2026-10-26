// Checks the structured data (JSON-LD) in the built site against the real schema.org vocabulary:
// every property must exist and be defined for the node's type (or one of its parent types), and
// typed values must be an allowed kind of thing. It catches mistakes such as putting `breadcrumb` on a
// BlogPosting (it belongs to WebPage), which Google's and schema.org's validators flag.
//
//   npm run build && node scripts/validate-jsonld.mjs          check every page in dist/
//   node scripts/validate-jsonld.mjs dist/blog                 check part of the site
//
// The vocabulary is downloaded once to the system temp folder and reused.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const VOCAB_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld'
const cache = path.join(os.tmpdir(), 'schemaorg-current-https.jsonld')
if (!fs.existsSync(cache)) {
  const res = await fetch(VOCAB_URL)
  if (!res.ok) throw new Error(`Could not download the schema.org vocabulary (${res.status})`)
  fs.writeFileSync(cache, await res.text())
}

const vocab = JSON.parse(fs.readFileSync(cache, 'utf8'))['@graph']
const short = (id) => String(id).replace(/^schema:/, '')
const asList = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])

const parents = new Map() // class -> direct parent classes
const domains = new Map() // property -> classes it may be used on
const ranges = new Map() //  property -> classes it may hold
for (const node of vocab) {
  const type = asList(node['@type'])
  if (type.includes('rdfs:Class')) {
    parents.set(short(node['@id']), asList(node['rdfs:subClassOf']).map((p) => short(p['@id'])))
  }
  if (type.includes('rdf:Property')) {
    domains.set(short(node['@id']), asList(node['schema:domainIncludes']).map((d) => short(d['@id'])))
    ranges.set(short(node['@id']), asList(node['schema:rangeIncludes']).map((d) => short(d['@id'])))
  }
}

const ancestors = (cls, seen = new Set()) => {
  if (seen.has(cls)) return seen
  seen.add(cls)
  for (const p of parents.get(cls) || []) ancestors(p, seen)
  return seen
}

const issues = []
function check(node, where) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) return node.forEach((n) => check(n, where))
  const types = asList(node['@type']).map(short)
  if (types.length) {
    const allowed = new Set(types.flatMap((t) => [...ancestors(t)]))
    for (const t of types) if (!parents.has(t)) issues.push(`${where}: unknown type "${t}"`)
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('@')) continue
      if (!domains.has(key)) {
        issues.push(`${where}: "${key}" is not a schema.org property (on ${types.join('+')})`)
        continue
      }
      if (!domains.get(key).some((d) => allowed.has(d))) {
        issues.push(`${where}: "${key}" is not defined for ${types.join('+')} (it belongs to ${domains.get(key).join(', ')})`)
      }
      // A typed nested value must be an allowed kind of thing for that property.
      const okRange = ranges.get(key) || []
      for (const child of asList(value)) {
        if (child && typeof child === 'object' && child['@type']) {
          const childTypes = asList(child['@type']).map(short)
          const fits = childTypes.some((ct) => [...ancestors(ct)].some((a) => okRange.includes(a)))
          if (okRange.length && !fits) issues.push(`${where}: "${key}" holds ${childTypes.join('+')}, expected ${okRange.join(' or ')}`)
        }
        check(child, `${where} > ${key}`)
      }
    }
  } else {
    for (const value of Object.values(node)) check(value, where)
  }
}

const root = process.argv[2] || 'dist'
const files = []
;(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.html')) files.push(p)
  }
})(root)

let nodes = 0
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8')
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data
    try {
      data = JSON.parse(m[1])
    } catch {
      issues.push(`${file}: invalid JSON in a JSON-LD block`)
      continue
    }
    const graph = data['@graph'] || [data]
    nodes += graph.length
    for (const node of graph) check(node, `${file.replace(/^dist\//, '')} [${asList(node['@type']).join('+')}]`)
  }
}

console.log(`Checked ${nodes} nodes across ${files.length} pages against schema.org.`)
const unique = [...new Set(issues)]
if (unique.length) {
  console.log(`\n${unique.length} problem(s):`)
  for (const i of unique) console.log(`  - ${i}`)
  process.exit(1)
}
console.log('No problems found.')

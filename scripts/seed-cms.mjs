// Loads the draft copy from src/content/defaults.js into Sanity as DRAFTS.
// Nothing goes live: open Studio, review each page, and press Publish.
//
//   node scripts/seed-cms.mjs --dry-run            print what would be written, change nothing
//   SANITY_WRITE_TOKEN=... node scripts/seed-cms.mjs   write the drafts
//
// Create a token at https://www.sanity.io/manage > project fv5q0f3v > API > Tokens (role: Editor).
// It is safe to re-run: it replaces the drafts, and never touches anything you have already published.
import { createClient } from '@sanity/client'
import { siteSettingsDefaults, homePageDefaults, servicesPageDefaults } from '../src/content/defaults.js'

const dryRun = process.argv.includes('--dry-run')
const token = process.env.SANITY_WRITE_TOKEN

if (!dryRun && !token) {
  console.error('Set SANITY_WRITE_TOKEN, or use --dry-run to preview.')
  process.exit(1)
}

const docs = [
  { _id: 'drafts.siteSettings', _type: 'siteSettings', ...siteSettingsDefaults },
  { _id: 'drafts.homePage', _type: 'homePage', ...homePageDefaults },
  { _id: 'drafts.servicesPage', _type: 'servicesPage', ...servicesPageDefaults }
]

const client = createClient({
  projectId: 'fv5q0f3v',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token
})

for (const doc of docs) {
  const size = JSON.stringify(doc).length
  if (dryRun) {
    console.log(`[dry run] would write ${doc._id} (${doc._type}, ${size} bytes, ${Object.keys(doc).length - 2} fields)`)
    continue
  }
  // If a published version already exists, leave it alone: the draft is a proposed edit on top of it.
  await client.createOrReplace(doc)
  console.log(`wrote ${doc._id}`)
}

console.log(dryRun ? '\nDry run only. Nothing was written.' : '\nDone. Open Studio, review each draft, then Publish.')

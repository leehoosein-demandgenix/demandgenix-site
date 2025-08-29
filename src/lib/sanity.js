import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'fv5q0f3v',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Helper functions
export async function getHero() {
  return await client.fetch(`*[_type == "hero"][0]`)
}

export async function getServices() {
  return await client.fetch(`*[_type == "service"] | order(order asc)`)
}

export async function getAbout() {
  return await client.fetch(`*[_type == "about"][0]`)
}

export async function getContact() {
  return await client.fetch(`*[_type == "contact"][0]`)
}

export async function getSiteSettings() {
  return await client.fetch(`*[_type == "siteSettings"][0]`)
}

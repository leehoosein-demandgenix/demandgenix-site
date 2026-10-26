// Generates /webmcp.js from the CMS, so the facts AI agents are given always match the site.
// The behaviour lives in src/lib/webmcp.template.js.
import template from '../lib/webmcp.template.js?raw';
import { getSiteSettings, getServicesPage, getContactPage } from '../lib/sanity.js';
import { SITE_URL, blocksToPlain } from '../lib/seo.js';

export async function GET() {
  const [settings, services, contact] = await Promise.all([getSiteSettings(), getServicesPage(), getContactPage()]);

  const pricing = 'Not published. Cost depends on what the first piece of work finds, and is discussed on the free intro call before any commitment.';
  const bookingPath = settings.ctaHref || '/contact/';

  const data = {
    url: SITE_URL,
    email: settings.email,
    contactPath: bookingPath,
    responseTime: contact.responseTime,
    voice: `Written in the first person by ${settings.founderName}, who runs ${settings.tradingName}.`,
    servicesOverview: `${services.heroHeadline} ${services.heroSub}`,
    whoItIsFor: [...services.whoPoints, services.whoTail].filter(Boolean),
    services: services.areas.map((a: any) => ({
      name: a.name,
      summary: a.summary,
      whatIDo: blocksToPlain(a.whatIDo),
      whatILookAtFirst: a.lookFirst
    })),
    howWorkStarts: services.startSteps.map((s: any) => ({ step: s.title, detail: blocksToPlain(s.body) })),
    pricing,
    questions: services.faqs.map((f: any) => ({ question: f.question, answer: blocksToPlain(f.answer) })),
    routes: {
      home: '/',
      services: '/services/',
      blog: '/blog/',
      contact: bookingPath,
      'privacy-policy': '/privacy-policy/',
      'cookie-policy': '/cookie-policy/'
    },
    company: {
      name: settings.tradingName,
      legalName: settings.companyName,
      location: `${settings.locality}, UK`,
      servingRegions: settings.areaServed,
      email: settings.email,
      linkedin: settings.linkedinUrl,
      website: SITE_URL,
      description: settings.siteDescription,
      founder: {
        name: settings.founderName,
        title: settings.founderJobTitle,
        bio: settings.founderBio,
        credentials: (settings.founderCredentials || []).map((c: any) => ({ name: c.name, awardedBy: c.issuer, publicRecord: c.verifyUrl })),
        linkedin: settings.founderLinkedIn
      },
      howItDiffers: services.isntItems.map((i: any) => `${i.lead} ${i.text}`),
      services: services.areas.map((a: any) => a.name),
      pricing,
      freeIntroCall: {
        available: true,
        duration: '30 minutes',
        bookingUrl: `${SITE_URL}${bookingPath}`,
        description: contact.heroSub
      }
    }
  };

  const marker = '{} /* @@SITE_DATA@@ */';
  if (!template.includes(marker)) throw new Error('webmcp template is missing its data marker');
  const js = template.replace(marker, JSON.stringify(data, null, 2));

  return new Response(js, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
}

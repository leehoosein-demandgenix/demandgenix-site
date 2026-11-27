// Single source of truth for the draft copy.
// Used as (1) the fallback when the CMS has no document yet and (2) the seed for `scripts/seed-cms.mjs`.
// Keep field names identical to the Sanity schemas in sanity-studio/schemaTypes.

// --- Portable Text helpers -------------------------------------------------
// Write **bold** and [label](/path) inside a string; get Sanity block content back.
let keyCounter = 0
const nextKey = () => `k${(++keyCounter).toString(36)}`

function toBlock(text) {
  const markDefs = []
  const children = []
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g
  let last = 0
  let m
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) children.push({ _type: 'span', _key: nextKey(), text: text.slice(last, m.index), marks: [] })
    if (m[1] !== undefined) {
      children.push({ _type: 'span', _key: nextKey(), text: m[1], marks: ['strong'] })
    } else {
      const linkKey = nextKey()
      markDefs.push({ _type: 'link', _key: linkKey, href: m[3] })
      children.push({ _type: 'span', _key: nextKey(), text: m[2], marks: [linkKey] })
    }
    last = pattern.lastIndex
  }
  if (last < text.length) children.push({ _type: 'span', _key: nextKey(), text: text.slice(last), marks: [] })
  return { _type: 'block', _key: nextKey(), style: 'normal', markDefs, children }
}

export const rt = (...paragraphs) => paragraphs.map(toBlock)

// --- Site settings ---------------------------------------------------------
export const siteSettingsDefaults = {
  siteTitle: 'DemandGenix',
  siteDescription:
    'DemandGenix is a one-person marketing practice in Manchester run by Lee Hoosein. It takes on the ads, website and follow-up that are meant to bring in new business, and reports what they return and what can’t be tracked.',
  companyName: 'DemandGenix Limited',
  companyNumber: '16660290',
  vatNumber: '501 3963 18',
  linkedinUrl: 'https://www.linkedin.com/company/demandgenix/',

  ctaLabel: 'Book a free intro call',
  ctaNote: '30 minutes, free, to see whether I can help.',
  writeNote: 'Prefer to write? Send me a few lines about what you’re spending and what you’re seeing.',
  ctaHref: '/contact/',
  navLinks: [
    { _key: 'nav1', label: 'Services', href: '/services/' },
    { _key: 'nav2', label: 'About', href: '/#about' },
    { _key: 'nav3', label: 'Blog', href: '/blog/' },
    { _key: 'nav4', label: 'Contact', href: '/contact/' }
  ],

  tradingName: 'DemandGenix',
  email: 'hello@demandgenix.uk',
  locality: 'Manchester',
  region: 'Greater Manchester',
  country: 'GB',
  areaServed: ['United Kingdom', 'European Union', 'United States'],
  sameAs: ['https://www.linkedin.com/company/demandgenix/', 'https://twitter.com/demandgenix'],

  founderName: 'Lee Hoosein',
  founderJobTitle: 'Founder',
  founderBio:
    'Lee Hoosein has spent 20 years in marketing, including at Allianz Business Services, Aldermore, Sorted and Diffblue, and now runs DemandGenix on his own.',
  founderLinkedIn: 'https://www.linkedin.com/in/lee-hoosein/',
  founderCredentials: [
    {
      _key: 'cred1',
      name: 'Chartered Marketer',
      issuer: 'Chartered Institute of Marketing',
      issuerUrl: 'https://www.cim.co.uk/',
      verifyUrl: 'https://www.credly.com/badges/9d78d530-082e-4682-a515-c3f3604dfa01'
    }
  ],
  founderBadge: {
    url: '/images/cim-chartered-member-badge.png',
    alt: 'CIM Chartered Member (CMCIM) digital badge',
    width: 236,
    height: 280
  },
  founderKnowsAbout: [
    'Demand generation',
    'Paid advertising',
    'Website conversion',
    'Marketing measurement',
    'HubSpot'
  ],

  spendWidget: {
    _type: 'spendWidget',
    title: 'Where the money goes',
    footnote: 'Examples of the kind of thing I find. Every business is different.',
    areas: [
      {
        _key: 'w1',
        name: 'Ads',
        fixable: 'Spend going to audiences and search terms that were never going to buy.',
        untraceable: 'A colleague recommends you, and the enquiry arrives with no source at all.'
      },
      {
        _key: 'w2',
        name: 'Website',
        fixable: 'Forms that quietly fail, pages that don’t say what you sell, enquiries that go nowhere.',
        untraceable: 'Visitors sent by AI assistants, which usually land in your analytics as direct.'
      },
      {
        _key: 'w3',
        name: 'Follow-up',
        fixable: 'Enquiries that wait days for a reply, or never get logged at all.',
        untraceable: 'Whether the conversation that closed the deal started with your marketing.'
      }
    ]
  }
}

// --- Home page -------------------------------------------------------------
export const homePageDefaults = {
  heroKicker: 'Lee Hoosein, Manchester',
  heroHeadline: 'You’re spending on marketing and can’t say what it brings back.',
  heroSub: 'I run the ads, website and follow-up that bring in new business. First, I work out what’s happening.',

  offerHeading: 'What I take on',
  offerLede: 'The marketing that’s meant to bring in new business, run by me and judged on what it brings in.',
  offerItems: [
    { _key: 'o1', name: 'The ads', description: 'Whether the ads reach the right people and pay for themselves.' },
    { _key: 'o2', name: 'The website', description: 'Whether it’s clear what you sell and the forms work, so visitors know what to do next.' },
    { _key: 'o3', name: 'The follow-up', description: 'What happens after someone gets in touch, including how fast they hear back and whether anyone records where they came from.' }
  ],

  honestLabel: '',
  honestHeading: 'What can be fixed, and what can’t be tracked',
  honestBody: rt(
    'Most companies I start with are spending money and can’t tell what’s coming back from it, so I work that out first.',
    'Some problems turn out to be fixable: a form that stopped sending enquiries, ads aimed at the wrong people, enquiries left waiting. Others can’t be traced any more, like a recommendation in a private Slack group, and with a few dozen deals a quarter no test will settle it either.',
    'I’ll tell you early which is which, so you’re not paying for a report that claims more than the data shows.'
  ),

  startHeading: 'How we’d start',
  startBody: rt(
    'First there’s a free 30-minute call about what you’re spending and what you’re seeing. If it’s a fit, I agree a first piece of work with you in writing, and once it’s done you decide whether I carry on.',
    '[Here’s how working together starts.](/services/#how-we-would-start)'
  ),

  proofHeading: 'Work and feedback',
  caseStudyTitle: 'From spray and pray to 111% more pipeline value',
  caseStudyBody: 'Targeting 140 named accounts with intent data, rather than everyone, doubled pipeline value in a single quarter.',
  caseStudyMeasured: '',
  caseStudyLink: '/blog/case-study-how-we-doubled-pipeline-by-leveraging-intent-data/',
  feedbackHeading: 'Feedback from people I’ve worked with',

  aboutHeading: 'I’m Lee.',
  aboutBody: rt(
    'I’ve spent 20 years in marketing, including at Allianz Business Services, Aldermore, Sorted and Diffblue. DemandGenix is just me, on purpose, so the person you speak to is the person doing the work.',
    'I take on a small number of clients at a time, and I’ll tell you if I’m not the right fit.'
  ),

  closingHeading: 'Want to know where your marketing money goes?',
  closingNote: 'Thirty minutes, free.',

  faqs: [],

  seo: {
    _type: 'seo',
    metaTitle: 'Demand Generation Consultant, Manchester | DemandGenix',
    metaDescription:
      'Manchester demand generation consultant. I run the ads, website and follow-up that bring in new business, and say honestly what they return. Free intro call.',
    summary:
      'DemandGenix is a one-person marketing practice in Manchester run by Lee Hoosein. Lee takes on the ads, website and follow-up that are meant to bring in new business, starts by working out what is actually happening, and says plainly what can and cannot be tracked. First contact is a free 30-minute intro call.',
    searchIntent:
      'People looking for a marketing or demand generation consultant in Manchester, or asking why their marketing spend does not seem to produce customers. Home page title currently keeps "Demand Generation" and "Manchester" from the live title; check Search Console before changing it.'
  }
}

// --- Services page ---------------------------------------------------------
export const servicesPageDefaults = {
  heroKicker: 'Services',
  heroHeadline: 'I take on the marketing that’s meant to bring in new business.',
  heroSub: 'The ads, website and follow-up, run by me. First, I work out what’s happening.',
  familiarLabel: 'Sound familiar?',
  familiarQuote: 'We’re spending, leads arrive, sales says they’re rubbish, and nobody can settle the argument.',
  familiarNote: 'If that’s where you are, this page is for you.',

  whoHeading: 'Who this is for',
  whoPoints: [
    'You spend real money on getting new customers: ads, content, a half-configured CRM.',
    'You have a sales team, or you’re taking the calls yourself.',
    'You can’t tell which of that spend produced revenue.'
  ],
  whoTail: 'That can be a company in any sector.',

  areasHeading: 'What I take on',
  areas: [
    {
      _key: 'a1',
      name: 'The ads',
      searchName: 'Paid advertising management (search and social)',
      summary: 'Who they’re aimed at, what they say, and whether they’re paying for themselves.',
      whatIDo: rt('I run the paid ads. That means the targeting, the wording, the budget and the judgement about what to switch off. If something shouldn’t be running, I’ll switch it off or tell you why.'),
      lookFirst: [
        'What’s being spent, and where',
        'Which campaigns produce enquiries a salesperson wants',
        'Where the tracking is broken, or was never set up'
      ]
    },
    {
      _key: 'a2',
      name: 'The website',
      searchName: 'Website performance and enquiry conversion improvement',
      summary: 'Whether it says what you sell, and whether a visitor knows what to do next.',
      whatIDo: rt('I make sure the site does its job as the place people land: clear about what you offer, forms that work, and a next step that’s obvious.'),
      lookFirst: [
        'Whether enquiries from the form reach you',
        'Whether the page matches the ad that sent someone there',
        'What your analytics can and can’t tell you'
      ]
    },
    {
      _key: 'a3',
      name: 'The follow-up',
      searchName: 'Lead follow-up and CRM process improvement',
      summary: 'What happens after someone gets in touch.',
      whatIDo: rt('I look at how quickly enquiries get a reply, what they’re told, and whether anyone can see where they came from.'),
      lookFirst: [
        'How long an enquiry waits for a response',
        'What gets recorded in your CRM, and what doesn’t',
        'Whether marketing and sales agree on what a good lead is, which is usually where the argument starts'
      ]
    }
  ],

  honestLabel: '',
  honestHeading: 'What can and can’t be tracked',
  honestBody: rt(
    'Less of a buyer’s journey shows up in your analytics each year, so I’ll tell you early which problems can be fixed and which can’t be measured. Here’s the kind of thing I find in each area.'
  ),

  startHeading: 'How we’d start',
  startSteps: [
    { _key: 's1', title: 'A free intro call', body: rt('Thirty minutes. You tell me what you’re spending and what you’re seeing. I’ll tell you whether I can help.') },
    { _key: 's2', title: 'A first piece of work', body: rt('If it’s a fit, I go into your accounts and come back with what’s happening and what I’d do over the next 90 days. It’s scoped and agreed in writing first, and I talk you through the findings in a meeting. I’ll explain what it involves and costs on the intro call.') },
    { _key: 's3', title: 'Then you decide', body: rt('Take it from there yourselves, or ask me to carry on. No obligation either way.') }
  ],
  startNeed: rt('**What I’ll need from you:** access to the ad accounts, analytics and CRM you already have, and a little of your time. I’ll agree exactly which in writing before I start.'),

  isntHeading: 'What you get',
  isntBody: rt('Plain reporting on what can be measured, and a clear note on what can’t. If most of your marketing is working, I’ll tell you that too. And it’s me doing the work from start to finish.'),

  faqHeading: 'Questions people ask',
  faqs: [
    {
      _key: 'f1',
      _type: 'faqItem',
      question: 'What does a marketing consultant actually do?',
      answer: rt('I run the marketing that’s meant to bring in new business: the ads, the website, and the follow-up when someone gets in touch. I start by working out what’s happening, fix what I can, and tell you what can’t be tracked.')
    },
    {
      _key: 'f2',
      _type: 'faqItem',
      question: 'Can you measure what my marketing is actually returning?',
      answer: rt('Some of it, yes. Some of it can’t be tracked any more. Someone sees an ad, searches your name a week later, and it shows up as direct traffic. I’ll show you early which parts can be measured.')
    },
    {
      _key: 'f3',
      _type: 'faqItem',
      question: 'What does it cost?',
      answer: rt('It depends on what I find, so I don’t publish a price list. I’ll talk you through what the first piece of work involves and costs on the intro call, before you commit to anything.')
    },
    {
      _key: 'f4',
      _type: 'faqItem',
      question: 'How is this different from a marketing agency?',
      answer: rt('It’s me doing the work. DemandGenix is a one-person practice, so you won’t be handed to an account manager or a team you never meet.')
    },
    {
      _key: 'f5',
      _type: 'faqItem',
      question: 'What do you need from me?',
      answer: rt('Access to the ad accounts, analytics and CRM you already have, and a little of your time. I’ll agree exactly which in writing before I start.')
    },
    {
      _key: 'f6',
      _type: 'faqItem',
      question: 'Do you only work with software companies?',
      answer: rt('No. The situation matters more than the sector: you’re spending on marketing, you have people selling, and you can’t tell what’s working.')
    }
  ],

  closingHeading: 'Want to know where your marketing money goes?',
  closingNote: 'Thirty minutes, free.',

  seo: {
    _type: 'seo',
    metaTitle: 'Ads, Website & Follow-up Marketing Consultant | DemandGenix',
    metaDescription:
      'Manchester marketing consultant who runs your ads, website and follow-up, and tells you straight what works and what can’t be tracked. Free intro call.',
    summary:
      'Lee Hoosein runs paid advertising, website improvements and enquiry follow-up for companies that spend on marketing but cannot tell what it returns. Work starts with a free 30-minute intro call, then a scoped first piece of work, before any ongoing commitment.',
    searchIntent:
      'People searching for a marketing consultant, a PPC or Google Ads consultant, or asking how to tell whether marketing spend is working. FAQ questions are written the way people ask them so they can be quoted by AI assistants.'
  }
}

// --- Contact page ----------------------------------------------------------
export const contactPageDefaults = {
  heroKicker: 'Contact',
  heroHeadline: 'Let’s talk about where your marketing money goes.',
  heroSub: 'Book a free 30-minute intro call. You tell me what you’re spending and what you’re seeing, and I’ll tell you whether I can help.',

  formHeading: 'Book your free intro call',
  formIntro: 'Four details, and I’ll be in touch within 24 hours.',
  privacyNote: rt('By submitting this form you agree to the [privacy policy](/privacy-policy/). I’ll only use your details to reply to your enquiry and to send relevant updates.'),
  successMessage: 'Thanks, I’ve got your details and will reply within 24 hours.',
  errorMessage: 'Sorry, something went wrong sending that. Please email {email} and I’ll pick it up.',

  expectHeading: 'What to expect',
  expectBody: rt('I’ll reply within 24 hours, usually sooner during UK business hours. If it’s a fit after the call, I’ll set out in writing what a first piece of work involves and costs before you commit to anything.'),

  detailsHeading: 'Get in touch',
  responseTime: 'I reply within 24 hours, usually much faster during UK business hours.',
  locationNote: 'Based in Manchester. I work remotely with clients across the UK, EU and US.',

  seo: {
    _type: 'seo',
    metaTitle: 'Book a Free Intro Call | DemandGenix',
    metaDescription:
      'Book a free 30-minute intro call. Tell me what you spend on marketing and what you’re seeing, and I’ll tell you honestly whether I can help.',
    summary:
      'This is the contact page for DemandGenix, the Manchester marketing practice run by Lee Hoosein. A short form books a free 30-minute intro call, and Lee replies within 24 hours. The page also gives the email address and location.',
    searchIntent:
      'People ready to talk to a marketing consultant in Manchester, or who have been referred and want to book a call. Keep the form short; the page exists to get the call booked.'
  }
}

// --- Blog index and post footer --------------------------------------------
export const blogPageDefaults = {
  heroKicker: 'Blog',
  heroHeadline: 'Demand gen insights',
  heroSub: 'Practical thinking on demand generation, measurement, and getting marketing to bring in new business.',
  featuredHeading: 'Featured',
  allHeading: 'All articles',
  postCtaHeading: 'Want a straight answer on where your marketing money goes?',
  postCtaNote: 'Thirty minutes, free. If I can’t help, I’ll say so.',

  seo: {
    _type: 'seo',
    metaTitle: 'Blog - Demand Gen Insights & B2B Marketing Tips | DemandGenix',
    metaDescription:
      'Expert insights on B2B demand generation, conversion optimisation, and marketing growth strategies from DemandGenix.',
    summary:
      'The DemandGenix blog collects practical articles by Lee Hoosein on demand generation, measurement and conversion for B2B companies, including a case study from real client work. Articles are written for lean marketing teams and founders.',
    searchIntent:
      'People researching demand generation, lead generation, MQLs and B2B measurement. Each post targets one question; the index page should list them clearly and link to every one.'
  }
}

// --- 404 -------------------------------------------------------------------
// Kept in code rather than the CMS: it rarely changes, and a broken CMS must never break the 404 page.
export const notFoundDefaults = {
  headline: 'That page doesn’t exist.',
  text: 'The link may be old or mistyped. These are the places most people are looking for.',
  primaryLabel: 'Back to the home page',
  primaryHref: '/',
  secondaryLabel: 'See what I take on',
  secondaryHref: '/services/'
}

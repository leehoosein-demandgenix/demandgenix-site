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
    'DemandGenix is a one-person marketing practice in Manchester run by Lee Hoosein. It takes on the ads, website and follow-up that are meant to bring in new business, and says plainly what they return and what can’t be tracked.',
  companyName: 'DemandGenix Limited',
  companyNumber: '16660290',
  vatNumber: '501 3963 18',
  linkedinUrl: 'https://www.linkedin.com/company/demandgenix/',

  ctaLabel: 'Book a free intro call',
  ctaNote: '30 minutes. An honest read on whether I can help.',
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
        untraceable: 'Someone sees an ad, searches your name a week later, and it all shows up as direct.'
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
  heroKicker: 'Lee Hoosein · Manchester',
  heroHeadline: 'You’re spending on marketing and can’t say what it brings back.',
  heroSub: 'I run the ads, website and follow-up that bring in new business. First, I work out what’s actually happening.',

  offerHeading: 'What I take on',
  offerLede: 'The marketing that’s meant to bring in new business, often called demand generation. I run it, and I make it earn its keep.',
  offerItems: [
    { _key: 'o1', name: 'The ads', description: 'Who they’re aimed at, what they say, and whether they’re paying for themselves.' },
    { _key: 'o2', name: 'The website', description: 'Whether it says what you sell, whether the forms work, and whether a visitor knows what to do next.' },
    { _key: 'o3', name: 'The follow-up', description: 'What happens after someone gets in touch: how quickly, how well, and whether anyone can tell where it came from.' }
  ],

  honestLabel: 'The honest bit',
  honestHeading: 'Some of it can be fixed. Some of it can’t even be tracked.',
  honestBody: rt(
    'Most companies I start with are spending money and can’t tell what’s coming back from it. So I work that out first.',
    'Some of it turns out to be fixable: a form that quietly fails, ads aimed at the wrong people, enquiries left waiting. Some of it genuinely can’t be traced any more. Someone sees an ad, searches your name a week later, and it all shows up as direct. With a few dozen deals a quarter, no test will settle it either.',
    '**I’ll tell you which is which,** rather than sell you a dashboard that pretends otherwise.'
  ),

  startHeading: 'How we’d start',
  startSteps: [
    { _key: 's1', title: 'A free intro call', body: rt('Thirty minutes. You tell me what you’re spending and what you’re seeing. I tell you honestly whether I can help.') },
    { _key: 's2', title: 'A first piece of work', body: rt('If it’s a fit, I go into your accounts and come back with what’s actually happening and what I’d do over the next 90 days. Scoped and agreed in writing first.') },
    { _key: 's3', title: 'Then you decide', body: rt('Take it from there yourselves, or ask me to carry on. No obligation either way.') }
  ],

  proofHeading: 'What’s been said, and what’s been done',
  caseStudyTitle: 'From spray and pray to 111% more pipeline value',
  caseStudyBody: 'Targeting 140 named accounts with intent data, rather than everyone, doubled pipeline value in a single quarter.',
  caseStudyMeasured: '',
  caseStudyLink: '/blog/case-study-how-we-doubled-pipeline-by-leveraging-intent-data/',
  feedbackHeading: 'Feedback from people I’ve worked with',

  aboutHeading: 'I’m Lee.',
  aboutBody: rt(
    'I’ve spent 20 years in marketing, including at Allianz Business Services, Aldermore, Sorted and Diffblue. DemandGenix is just me, on purpose: you get me doing the work, not an account manager passing it on.',
    'I take on a small number of clients at a time, and I’ll tell you straight if I’m not the right fit.'
  ),

  closingHeading: 'Want a straight answer on where your marketing money goes?',
  closingNote: 'Thirty minutes, free. If I can’t help, I’ll say so.',

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
  heroSub: 'The ads, website and follow-up, run by me. First, I work out what’s actually happening.',
  familiarLabel: 'Sound familiar?',
  familiarQuote: 'We’re spending, leads arrive, sales says they’re rubbish, and nobody can settle the argument.',
  familiarNote: 'If that’s where you are, this page is for you.',

  whoHeading: 'Who this is for',
  whoPoints: [
    'You spend real money on getting new customers: ads, content, a half-configured CRM.',
    'You have a sales team, or you’re taking the calls yourself.',
    'You can’t tell which of that spend produced revenue.'
  ],
  whoTail: 'Sector doesn’t matter. The situation does.',

  areasHeading: 'What I take on',
  areas: [
    {
      _key: 'a1',
      name: 'The ads',
      searchName: 'Paid advertising management (search and social)',
      summary: 'Who they’re aimed at, what they say, and whether they’re paying for themselves.',
      whatIDo: rt('I run the paid ads. That means the targeting, the wording, the budget and the judgement about what to switch off. If something shouldn’t be running, I’ll say so.'),
      lookFirst: [
        'What’s being spent, and where',
        'Which campaigns produce enquiries a salesperson actually wants',
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
        'Whether the enquiry form actually reaches you',
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

  honestLabel: 'The honest bit',
  honestHeading: 'Some of it can be fixed. Some of it can’t even be tracked.',
  honestBody: rt(
    'The part of a buyer’s journey you can actually see is shrinking. So I tell you early which is which, **rather than sell you a dashboard that pretends otherwise.**',
    'Click through the three areas to see the kind of thing I mean.'
  ),

  startHeading: 'How we’d start',
  startSteps: [
    { _key: 's1', title: 'A free intro call', body: rt('Thirty minutes. You tell me what you’re spending and what you’re seeing. I tell you honestly whether I can help. If I can’t, I’ll say so.') },
    { _key: 's2', title: 'A first piece of work', body: rt('If it’s a fit, I go into your accounts and come back with what’s actually happening and what I’d do over the next 90 days. It’s scoped and agreed in writing first. I’ll talk you through what it involves and costs on the intro call.') },
    { _key: 's3', title: 'Then you decide', body: rt('Take it from there yourselves, or ask me to carry on. No obligation either way.') }
  ],
  startNeed: rt('**What I’ll need from you:** access to the ad accounts, analytics and CRM you already have, and a little of your time. I’ll agree exactly which in writing before I start.'),

  isntHeading: 'What this isn’t',
  isntItems: [
    { _key: 'i1', lead: 'It isn’t a dashboard.', text: 'If something can’t be tracked, I’ll say so rather than draw a chart that pretends it can.' },
    { _key: 'i2', lead: 'It isn’t a pitch for everything.', text: 'If your marketing is mostly working, I’ll tell you that too.' },
    { _key: 'i3', lead: 'It isn’t a team.', text: 'It’s me, doing the work, on purpose.' }
  ],

  faqHeading: 'Questions people ask',
  faqs: [
    {
      _key: 'f1',
      _type: 'faqItem',
      question: 'What does a marketing consultant actually do?',
      answer: rt('I run the marketing that’s meant to bring in new business: the ads, the website, and the follow-up when someone gets in touch. I start by working out what’s really happening, fix what can be fixed, and tell you plainly what can’t be tracked.')
    },
    {
      _key: 'f2',
      _type: 'faqItem',
      question: 'Can you measure what my marketing is actually returning?',
      answer: rt('Some of it, yes. Some of it genuinely can’t be tracked any more: someone sees an ad, searches your name later, and it shows up as direct. I’ll show you which is which, early, rather than draw a chart that pretends everything is measurable.')
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
      answer: rt('It’s me doing the work. DemandGenix is a one-person practice, on purpose, so you won’t be handed to an account manager or a team you never meet.')
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

  closingHeading: 'Want a straight answer on where your marketing money goes?',
  closingNote: 'Thirty minutes, free. If I can’t help, I’ll say so.',

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
  heroHeadline: 'Let’s have a straight conversation about where your marketing money goes.',
  heroSub: 'Book a free 30-minute intro call. You tell me what you’re spending and what you’re seeing, and I tell you honestly whether I can help.',

  formHeading: 'Book your free intro call',
  formIntro: 'Four details, and I’ll be in touch within 24 hours.',
  privacyNote: rt('By submitting this form you agree to the [privacy policy](/privacy-policy/). I’ll only use your details to reply to your enquiry and to send relevant updates.'),
  successMessage: 'Thanks, I’ve got your details and will reply within 24 hours.',
  errorMessage: 'Sorry, something went wrong sending that. Please email {email} and I’ll pick it up.',

  expectHeading: 'What to expect',
  expectSteps: [
    { _key: 'e1', title: 'A reply within 24 hours', body: rt('Usually much faster during UK business hours.') },
    { _key: 'e2', title: 'The intro call', body: rt('Thirty minutes. You tell me what you’re spending and what you’re seeing, and I tell you honestly whether I can help.') },
    { _key: 'e3', title: 'What happens next', body: rt('If it’s a fit, I’ll explain what a first piece of work involves and costs, in writing, before you commit to anything. If it isn’t, I’ll say so.') }
  ],

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

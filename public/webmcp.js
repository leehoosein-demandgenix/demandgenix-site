/**
 * WebMCP (Web Model Context Protocol) integration for DemandGenix
 *
 * Exposes structured tools to AI agents via navigator.modelContext,
 * enabling semantic interaction with the site instead of DOM scraping.
 *
 * Spec: https://webmachinelearning.github.io/webmcp/
 * Requires: Chrome 146+ with WebMCP enabled
 */
(function () {
  'use strict';

  // Feature detection — exit silently on unsupported browsers
  if (!navigator.modelContext) return;

  // ─── Tool: Get Programme Information ──────────────────────────
  navigator.modelContext.registerTool({
    name: 'getProgrammes',
    description:
      'Returns details about DemandGenix service programmes including Pipeline Diagnostic, Pipeline Turnaround sprints, and Fractional Demand Leadership. Use this to help users understand which programme fits their needs.',
    inputSchema: {
      type: 'object',
      properties: {
        programme: {
          type: 'string',
          enum: ['diagnostic', 'turnaround', 'leadership', 'all'],
          description:
            'Which programme to retrieve. Use "all" to get an overview of every programme.'
        }
      },
      required: ['programme']
    },
    annotations: { readOnlyHint: true },
    async execute({ programme }) {
      const programmes = {
        diagnostic: {
          title: 'Pipeline Diagnostic',
          duration: '3-4 weeks',
          investment: '\u00a33,500-\u00a35,000',
          bestFor:
            'Seed to Series B companies with \u00a330k-\u00a3200k marketing budget who need clarity before committing to execution.',
          description:
            'A full-funnel audit that gives you a clear, data-backed view of what\u2019s working and what\u2019s not, plus a prioritised 90-day roadmap.',
          deliverables: [
            'Full-funnel analysis with conversion benchmarks',
            'Prioritised 90-day execution roadmap',
            'Channel-specific recommendations',
            'Quick-win opportunities identified'
          ],
          process: [
            'Week 1: Kick-off and data access setup',
            'Week 2: Stakeholder interviews',
            'Week 3-4: Analysis, synthesis, and roadmap creation',
            'Week 4: Presentation of findings and next steps'
          ],
          ctaUrl: 'https://demandgenix.uk/contact'
        },
        turnaround: {
          title: 'Pipeline Turnaround',
          duration: '6-12 weeks',
          investment: '\u00a34,500-\u00a312,000 per sprint',
          bestFor:
            'Companies with identified pipeline issues who need targeted fixes delivered in 6-12 weeks.',
          description:
            'Fixed-scope execution sprints that solve specific pipeline problems with measurable outcomes.',
          sprints: [
            {
              name: 'Revenue Source of Truth',
              duration: '3-4 weeks',
              problem:
                'You can\u2019t trust your pipeline data. Marketing and Sales don\u2019t agree on what\u2019s working.',
              deliverables: [
                'Clean revenue attribution model',
                'Unified dashboard for Marketing and Sales',
                'Clear MQL/SQL/closed-won definitions',
                'Automated reporting setup'
              ]
            },
            {
              name: 'Paid Media Reset',
              duration: '4-6 weeks',
              problem:
                'Paid channels are burning budget without clear ROI. CAC is too high.',
              deliverables: [
                'Full audit of current campaigns',
                'Audience and messaging restructure',
                'Landing page optimisation',
                'Budget reallocation plan'
              ]
            },
            {
              name: 'Conversion Sprint',
              duration: '3-4 weeks',
              problem:
                'Traffic is there but conversions are weak. Your funnel is leaking.',
              deliverables: [
                'Conversion funnel analysis',
                'High-impact page optimisation',
                'A/B testing framework',
                'Lead nurture sequence setup'
              ]
            },
            {
              name: 'ABM Playbook & Pilot',
              duration: '3-4 weeks',
              problem:
                'You need to land enterprise accounts but your approach is too generic.',
              deliverables: [
                'Target account selection and research',
                'Personalised campaign playbook',
                'Multi-channel outreach sequence',
                'Pilot execution with 10-20 accounts'
              ]
            }
          ],
          ctaUrl: 'https://demandgenix.uk/contact'
        },
        leadership: {
          title: 'Fractional Demand Leadership',
          duration: 'Ongoing (rolling 90 days)',
          investment: 'From \u00a32,500/month',
          bestFor:
            'Growing companies who need senior demand gen leadership 1-2 days/week without a full-time hire.',
          description:
            'An embedded fractional leader who owns your pipeline number and works alongside your team.',
          tiers: [
            {
              name: 'Core',
              commitment: '1 day/week',
              investment: '\u00a32,500/month',
              includes: ['Strategy & Planning', 'Hands-on Execution']
            },
            {
              name: 'Plus',
              commitment: '2 days/week',
              investment: '\u00a34,500/month',
              includes: [
                'Strategy & Planning',
                'Hands-on Execution',
                'Team Coaching',
                'Agency/Vendor Oversight'
              ]
            },
            {
              name: 'Enterprise',
              commitment: 'Custom',
              investment: 'Custom',
              includes: [
                'Strategy & Planning',
                'Hands-on Execution',
                'Team Coaching',
                'Agency/Vendor Oversight',
                'Board Reporting',
                'Custom Integrations'
              ]
            }
          ],
          ctaUrl: 'https://demandgenix.uk/contact'
        }
      };

      if (programme === 'all') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  overview:
                    'DemandGenix offers three programmes tailored to different pipeline maturity stages.',
                  programmes: Object.values(programmes).map(function (p) {
                    return {
                      title: p.title,
                      duration: p.duration,
                      investment: p.investment,
                      bestFor: p.bestFor
                    };
                  }),
                  contactUrl: 'https://demandgenix.uk/contact'
                },
                null,
                2
              )
            }
          ]
        };
      }

      var data = programmes[programme];
      if (!data) {
        return {
          content: [
            {
              type: 'text',
              text: 'Programme not found. Valid options: diagnostic, turnaround, leadership, all'
            }
          ]
        };
      }

      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  });

  // ─── Tool: Get Blog Posts ─────────────────────────────────────
  navigator.modelContext.registerTool({
    name: 'getBlogPosts',
    description:
      'Returns a list of published blog posts from DemandGenix covering B2B demand generation, pipeline strategy, and marketing insights.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of posts to return (default 5, max 20)'
        }
      }
    },
    annotations: { readOnlyHint: true },
    async execute({ limit }) {
      var max = Math.min(limit || 5, 20);
      var posts = [];

      // Extract blog post data from the DOM (rendered at build time by Astro)
      var cards = document.querySelectorAll('article[data-blog-post]');
      cards.forEach(function (card) {
        if (posts.length >= max) return;
        var titleEl = card.querySelector('h2, h3');
        var linkEl = card.querySelector('a[href*="/blog/"]');
        var excerptEl = card.querySelector('[data-excerpt]');
        var categoryEl = card.querySelector('[data-category]');
        var dateEl = card.querySelector('time');

        posts.push({
          title: titleEl ? titleEl.textContent.trim() : '',
          url: linkEl ? 'https://demandgenix.uk' + linkEl.getAttribute('href') : '',
          excerpt: excerptEl ? excerptEl.textContent.trim() : '',
          category: categoryEl ? categoryEl.textContent.trim() : '',
          publishDate: dateEl ? dateEl.getAttribute('datetime') || dateEl.textContent.trim() : ''
        });
      });

      // If not on a blog page, return a pointer to the blog
      if (posts.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message:
                    'Blog post data is available at the blog listing page.',
                  blogUrl: 'https://demandgenix.uk/blog',
                  note: 'Navigate to the blog page to retrieve individual post details.'
                },
                null,
                2
              )
            }
          ]
        };
      }

      return { content: [{ type: 'text', text: JSON.stringify(posts, null, 2) }] };
    }
  });

  // ─── Tool: Get Testimonials ───────────────────────────────────
  navigator.modelContext.registerTool({
    name: 'getTestimonials',
    description:
      'Returns client testimonials and recommendations for DemandGenix services.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    annotations: { readOnlyHint: true },
    async execute() {
      var testimonials = [];

      // Extract testimonial data from the DOM
      var cards = document.querySelectorAll('[data-testimonial]');
      cards.forEach(function (card) {
        var nameEl = card.querySelector('[data-testimonial-name]');
        var titleEl = card.querySelector('[data-testimonial-title]');
        var textEl = card.querySelector('[data-testimonial-text]');
        var linkedinEl = card.querySelector('a[href*="linkedin.com"]');

        testimonials.push({
          name: nameEl ? nameEl.textContent.trim() : '',
          title: titleEl ? titleEl.textContent.trim() : '',
          recommendation: textEl ? textEl.textContent.trim() : '',
          linkedinUrl: linkedinEl ? linkedinEl.getAttribute('href') : ''
        });
      });

      if (testimonials.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message:
                    'Testimonials are displayed on the homepage and contact page.',
                  homepageUrl: 'https://demandgenix.uk',
                  contactUrl: 'https://demandgenix.uk/contact'
                },
                null,
                2
              )
            }
          ]
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(testimonials, null, 2) }]
      };
    }
  });

  // ─── Tool: Submit Contact Form ────────────────────────────────
  navigator.modelContext.registerTool({
    name: 'submitContactForm',
    description:
      'Submits a contact inquiry to DemandGenix to book a free 30-minute pipeline diagnostic call. Requires the user\u2019s first name, last name, email, and company name.',
    inputSchema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          description: 'The user\u2019s first name'
        },
        lastName: {
          type: 'string',
          description: 'The user\u2019s last name'
        },
        email: {
          type: 'string',
          description: 'The user\u2019s business email address',
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
        },
        company: {
          type: 'string',
          description: 'The user\u2019s company name'
        }
      },
      required: ['firstName', 'lastName', 'email', 'company']
    },
    async execute({ firstName, lastName, email, company }, client) {
      // Request explicit user confirmation before submitting personal data
      return client.requestUserInteraction(async function () {
        // Check for marketing consent cookie
        var marketingConsent = document.cookie
          .split('; ')
          .find(function (r) { return r.startsWith('marketing-consent='); });
        var hasConsent = marketingConsent && marketingConsent.split('=')[1] === 'true';

        if (!hasConsent) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    success: false,
                    reason: 'marketing_consent_required',
                    message:
                      'The user has not accepted marketing cookies. They can email hello@demandgenix.uk directly, or accept marketing cookies via the cookie banner and try again.',
                    fallbackEmail: 'hello@demandgenix.uk'
                  },
                  null,
                  2
                )
              }
            ]
          };
        }

        // Read HubSpot tracking cookie if present
        var hutkCookie = document.cookie
          .split('; ')
          .find(function (r) { return r.startsWith('hubspotutk='); });
        var hutk = hutkCookie ? hutkCookie.split('=')[1] : null;

        var payload = {
          fields: [
            { name: 'firstname', value: firstName },
            { name: 'lastname', value: lastName },
            { name: 'email', value: email },
            { name: 'company', value: company },
            { name: 'lead_source', value: 'WebMCP Agent' }
          ],
          context: {
            hutk: hutk,
            pageUri: window.location.href,
            pageName: document.title
          }
        };

        try {
          var response = await fetch(
            'https://api-eu1.hsforms.com/submissions/v3/integration/submit/146805802/2e5d9771-a003-488e-a7d3-87aeb942301c',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }
          );

          if (!response.ok) {
            var errText = await response.text();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      success: false,
                      reason: 'submission_failed',
                      message:
                        'Form submission failed. The user can try again or email hello@demandgenix.uk directly.',
                      error: errText
                    },
                    null,
                    2
                  )
                }
              ]
            };
          }

          // Fire GA4 event if available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
              event_category: 'Contact Form',
              event_label: 'WebMCP Agent Submission',
              value: 1
            });
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    success: true,
                    message:
                      'Contact form submitted successfully. DemandGenix will respond within 24 hours (usually much faster during UK business hours).',
                    nextSteps: [
                      'Expect a reply within 24 hours',
                      'A senior strategist will schedule a 30-minute diagnostic call',
                      'The call covers growth blockers and a recommended path forward'
                    ]
                  },
                  null,
                  2
                )
              }
            ]
          };
        } catch (err) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    success: false,
                    reason: 'network_error',
                    message:
                      'Could not reach the form submission endpoint. The user can email hello@demandgenix.uk directly.',
                    fallbackEmail: 'hello@demandgenix.uk'
                  },
                  null,
                  2
                )
              }
            ]
          };
        }
      });
    }
  });

  // ─── Tool: Navigate to Section ────────────────────────────────
  navigator.modelContext.registerTool({
    name: 'navigateToPage',
    description:
      'Navigates the user to a specific page or section on the DemandGenix website.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          enum: [
            'home',
            'programmes',
            'diagnostic',
            'turnaround',
            'leadership',
            'blog',
            'contact',
            'privacy-policy',
            'cookie-policy'
          ],
          description: 'The page or section to navigate to'
        }
      },
      required: ['destination']
    },
    async execute({ destination }) {
      var routes = {
        home: '/',
        programmes: '/programmes',
        diagnostic: '/programmes#diagnostic',
        turnaround: '/programmes#turnaround',
        leadership: '/programmes#leadership',
        blog: '/blog',
        contact: '/contact',
        'privacy-policy': '/privacy-policy',
        'cookie-policy': '/cookie-policy'
      };

      var path = routes[destination];
      if (!path) {
        return {
          content: [
            {
              type: 'text',
              text: 'Unknown destination. Valid options: ' + Object.keys(routes).join(', ')
            }
          ]
        };
      }

      window.location.href = path;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                navigated: true,
                destination: destination,
                url: 'https://demandgenix.uk' + path
              },
              null,
              2
            )
          }
        ]
      };
    }
  });

  // ─── Tool: Get Company Information ────────────────────────────
  navigator.modelContext.registerTool({
    name: 'getCompanyInfo',
    description:
      'Returns key information about DemandGenix including services overview, location, contact details, and what sets them apart.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    annotations: { readOnlyHint: true },
    async execute() {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                name: 'DemandGenix',
                legalName: 'DemandGenix Limited',
                location: 'Manchester, UK',
                servingRegions: ['UK', 'EU', 'US'],
                email: 'hello@demandgenix.uk',
                linkedin: 'https://www.linkedin.com/company/demandgenix/',
                website: 'https://demandgenix.uk',
                description:
                  'Manchester-based B2B demand generation consultancy helping growing companies scale pipeline efficiently through fixed-scope sprints, fractional leadership, and AI utilisation.',
                founder: 'Lee Hoosein',
                founderExperience: '20 years in B2B marketing and scale-up companies',
                keyDifferentiators: [
                  'Boutique agility, not agency overhead \u2014 direct access to a senior strategist',
                  'Structured experiments with adaptive execution \u2014 90-day plans with built-in flexibility',
                  'Practical over performative \u2014 results-first recommendations backed by data',
                  'Partnership, not vendor relationship \u2014 frank advice even if it means suggesting something we don\u2019t do'
                ],
                services: [
                  {
                    name: 'Pipeline Diagnostic',
                    duration: '3-4 weeks',
                    investment: '\u00a33,500-\u00a35,000'
                  },
                  {
                    name: 'Pipeline Turnaround',
                    duration: '6-12 weeks',
                    investment: '\u00a34,500-\u00a312,000 per sprint'
                  },
                  {
                    name: 'Fractional Demand Leadership',
                    duration: 'Ongoing (rolling 90 days)',
                    investment: 'From \u00a32,500/month'
                  }
                ],
                freeConsultation: {
                  available: true,
                  duration: '30 minutes',
                  bookingUrl: 'https://demandgenix.uk/contact',
                  description:
                    'A free diagnostic call with a senior strategist to identify growth blockers and recommend a path forward.'
                }
              },
              null,
              2
            )
          }
        ]
      };
    }
  });
})();

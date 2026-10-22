/**
 * WebMCP (Web Model Context Protocol) integration for DemandGenix
 *
 * Exposes structured tools to AI agents via navigator.modelContext,
 * enabling semantic interaction with the site instead of DOM scraping.
 *
 * Generated at build time from the CMS by src/pages/webmcp.js.ts. Edit this template
 * (src/lib/webmcp.template.js) for behaviour, and the content in Sanity Studio for facts.
 *
 * Spec: https://webmachinelearning.github.io/webmcp/
 * Requires: Chrome 146+ with WebMCP enabled
 */
(function () {
  'use strict';

  // Replaced at build time with content from the CMS.
  var SITE = {} /* @@SITE_DATA@@ */;

  // Feature detection: exit silently on unsupported browsers
  if (!navigator.modelContext) return;

  // ─── Tool: Get Services ───────────────────────────────────────
  navigator.modelContext.registerTool({
    name: 'getServices',
    description:
      'Returns what DemandGenix takes on (the ads, the website and the follow-up), how work starts, and answers to common questions. Use this to help a user understand whether DemandGenix is a fit.',
    inputSchema: {
      type: 'object',
      properties: {
        area: {
          type: 'string',
          description:
            'Optionally limit the answer to one area by name, for example "ads". Leave empty for everything.'
        }
      }
    },
    annotations: { readOnlyHint: true },
    async execute({ area }) {
      var wanted = (area || '').toLowerCase();
      var areas = SITE.services.filter(function (s) {
        return !wanted || s.name.toLowerCase().indexOf(wanted) !== -1;
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                voice: SITE.voice,
                overview: SITE.servicesOverview,
                whoItIsFor: SITE.whoItIsFor,
                areas: areas,
                howWorkStarts: SITE.howWorkStarts,
                pricing: SITE.pricing,
                questions: SITE.questions,
                servicesUrl: SITE.url + '/services/',
                bookingUrl: SITE.url + SITE.contactPath
              },
              null,
              2
            )
          }
        ]
      };
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
      'Submits a contact inquiry to DemandGenix to book a free 30-minute intro call. Requires the user\u2019s first name, last name, email, and company name.',
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
                      'The user has not accepted marketing cookies. They can email ' + SITE.email + ' directly, or accept marketing cookies via the cookie banner and try again.',
                    fallbackEmail: SITE.email
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
                        'Form submission failed. The user can try again or email ' + SITE.email + ' directly.',
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
                      'Contact form submitted successfully. ' + SITE.responseTime + '',
                    nextSteps: [
                      'Expect a reply within 24 hours',
                      'Lee will reply to arrange the free 30-minute intro call',
                      'The call covers what is being spent, what is being seen, and whether Lee can help'
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
                      'Could not reach the form submission endpoint. The user can email ' + SITE.email + ' directly.',
                    fallbackEmail: SITE.email
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
      'Navigates the user to a specific page on the DemandGenix website.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          enum: Object.keys(SITE.routes),
          description: 'The page to navigate to'
        }
      },
      required: ['destination']
    },
    async execute({ destination }) {
      var path = SITE.routes[destination];
      if (!path) {
        return {
          content: [
            {
              type: 'text',
              text: 'Unknown destination. Valid options: ' + Object.keys(SITE.routes).join(', ')
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
              { navigated: true, destination: destination, url: SITE.url + path },
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
      'Returns key information about DemandGenix: what it does, who runs it, where it is based, how to get in touch, and how work starts.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    annotations: { readOnlyHint: true },
    async execute() {
      return {
        content: [{ type: 'text', text: JSON.stringify(SITE.company, null, 2) }]
      };
    }
  });
})();

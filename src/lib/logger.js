const errors = []

export const logger = {
  error(context, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      context,
      message
    }
    errors.push(entry)
    console.error(`[Sanity] ${context}: ${message}`)
  },

  async flush() {
    const total = errors.length
    if (total === 0) {
      console.log('[Build] All Sanity queries succeeded — no fallbacks used.')
      return
    }

    console.warn(`[Build] ${total} Sanity query error(s) — fallback content used:`)
    for (const e of errors) {
      console.warn(`  - ${e.context}: ${e.message}`)
    }

    const webhookUrl = import.meta.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      console.warn('[Build] Set SLACK_WEBHOOK_URL to receive Slack alerts for Sanity errors.')
      return
    }

    const blocks = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `⚠️ DemandGenix Build: ${total} Sanity error(s)` }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `The site built with *fallback content* for ${total} query(s). Check Sanity Studio or API status.`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: errors.map(e => `• *${e.context}*: ${e.message}`).join('\n')
        }
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Build time: ${new Date().toISOString()}` }
        ]
      }
    ]

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks })
      })
      if (!res.ok) {
        console.error(`[Build] Slack webhook failed: ${res.status} ${res.statusText}`)
      }
    } catch (err) {
      console.error(`[Build] Could not send Slack notification: ${err.message}`)
    }
  }
}

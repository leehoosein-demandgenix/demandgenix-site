import { logger } from '../lib/logger.js'

export default function errorReporter() {
  return {
    name: 'error-reporter',
    hooks: {
      'astro:build:done': async () => {
        await logger.flush()
      }
    }
  }
}

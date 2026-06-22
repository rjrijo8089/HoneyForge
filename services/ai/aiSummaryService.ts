/**
 * AI Summary Service
 * Stub — in production this calls an AI provider (Anthropic, OpenAI, etc.)
 * to generate natural-language summaries of honeypot intelligence.
 * API keys are stored server-side only and never exposed to the browser.
 * Do not make real external API calls here.
 */
import type { AISummary, AIConfiguration } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getLatestSummary(): Promise<AISummary> {
  return MOCK_AI_INTELLIGENCE.summary
}

export async function getConfiguration(): Promise<AIConfiguration> {
  return MOCK_AI_INTELLIGENCE.configuration
}

export async function saveConfiguration(config: Partial<AIConfiguration>): Promise<AIConfiguration> {
  // Stub: merge and return. Real implementation persists server-side.
  return { ...MOCK_AI_INTELLIGENCE.configuration, ...config }
}

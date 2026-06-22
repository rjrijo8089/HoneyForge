/**
 * Event Correlation Service
 * Stub — in production this calls the AI backend to correlate events
 * across decoys by IP, ASN, user-agent, payload, and technique chains.
 * API keys are server-side only and never exposed to the browser.
 */
import type { CorrelationGroup } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getCorrelationGroups(): Promise<CorrelationGroup[]> {
  return MOCK_AI_INTELLIGENCE.correlationGroups
}

export async function correlateByIp(ip: string): Promise<CorrelationGroup | null> {
  return MOCK_AI_INTELLIGENCE.correlationGroups.find(
    (g) => g.type === 'ip_cluster' && g.matchValue.startsWith(ip.split('.').slice(0, 3).join('.'))
  ) ?? null
}

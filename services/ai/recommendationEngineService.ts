/**
 * Recommendation Engine Service
 * Stub — in production this uses AI to generate prioritised analyst
 * recommendations based on correlated events, campaign data, and decoy risk scores.
 * API keys are server-side only and never exposed to the browser.
 */
import type { TechnicalRecommendation } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getRecommendations(): Promise<TechnicalRecommendation[]> {
  return MOCK_AI_INTELLIGENCE.recommendations
}

export async function updateRecommendationStatus(
  id: string,
  status: TechnicalRecommendation['status'],
): Promise<TechnicalRecommendation | null> {
  const rec = MOCK_AI_INTELLIGENCE.recommendations.find((r) => r.id === id)
  if (!rec) return null
  return { ...rec, status }
}

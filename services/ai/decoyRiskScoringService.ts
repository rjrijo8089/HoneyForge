/**
 * Decoy Risk Scoring Service
 * Stub — in production this computes dynamic risk scores using the formula:
 *   Critical Events × 25 + High Events × 15 + Malware Attempts × 20 +
 *   Credential Attempts × 10 + Recent Activity Weight + Business Criticality + Exposure Weight
 * API keys are server-side only and never exposed to the browser.
 */
import type { DecoyRiskScore } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getDecoyRiskScores(): Promise<DecoyRiskScore[]> {
  return MOCK_AI_INTELLIGENCE.decoyRiskScores
}

export function computeRiskScore(params: {
  criticalEvents: number
  highEvents: number
  malwareAttempts: number
  credentialAttempts: number
  recentActivityWeight: number
  businessCriticalityWeight: number
  exposureWeight: number
}): number {
  return (
    params.criticalEvents       * 25 +
    params.highEvents           * 15 +
    params.malwareAttempts      * 20 +
    params.credentialAttempts   * 10 +
    params.recentActivityWeight      +
    params.businessCriticalityWeight +
    params.exposureWeight
  )
}

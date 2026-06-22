/**
 * Campaign Detection Service
 * Stub — in production this uses AI to identify coordinated attacker campaigns
 * from correlated event streams. No real API calls are made here.
 * API keys are stored server-side only and never exposed to the browser.
 */
import type { AttackerCampaign } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getCampaigns(): Promise<AttackerCampaign[]> {
  return MOCK_AI_INTELLIGENCE.campaigns
}

export async function getCampaignById(id: string): Promise<AttackerCampaign | null> {
  return MOCK_AI_INTELLIGENCE.campaigns.find((c) => c.id === id) ?? null
}

export async function getActiveCampaigns(): Promise<AttackerCampaign[]> {
  return MOCK_AI_INTELLIGENCE.campaigns.filter((c) => c.status === 'active')
}

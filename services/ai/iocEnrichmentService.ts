/**
 * IOC Enrichment Service
 * Stub — in production this queries external threat intelligence feeds:
 * MISP, AbuseIPDB, VirusTotal, OTX, GreyNoise, URLhaus, CISA KEV, NVD.
 * No real external API calls are made here.
 * API keys are stored server-side only and never exposed to the browser.
 */
import type { EnrichedIOC } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getEnrichedIOCs(): Promise<EnrichedIOC[]> {
  return MOCK_AI_INTELLIGENCE.enrichedIOCs
}

export async function enrichIOC(value: string): Promise<EnrichedIOC | null> {
  return MOCK_AI_INTELLIGENCE.enrichedIOCs.find((i) => i.value === value) ?? null
}

export const FEED_DISPLAY_NAMES: Record<string, string> = {
  MISP:      'MISP',
  AbuseIPDB: 'AbuseIPDB',
  VirusTotal:'VirusTotal',
  OTX:       'AlienVault OTX',
  GreyNoise: 'GreyNoise',
  URLhaus:   'URLhaus',
  CISA_KEV:  'CISA KEV',
  NVD:       'NVD',
}

/**
 * MITRE ATT&CK Mapping Service
 * Stub — in production this maps observed events to MITRE techniques
 * using AI-assisted classification and the ATT&CK knowledge base.
 * API keys are server-side only and never exposed to the browser.
 */
import type { MitreTechniqueEntry } from '@/types/ai-intelligence'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

export async function getMitreTechniques(): Promise<MitreTechniqueEntry[]> {
  return MOCK_AI_INTELLIGENCE.mitreTechniques
}

export async function getTechniqueById(id: string): Promise<MitreTechniqueEntry | null> {
  return MOCK_AI_INTELLIGENCE.mitreTechniques.find((t) => t.id === id) ?? null
}

export function groupByTactic(techniques: MitreTechniqueEntry[]): Record<string, MitreTechniqueEntry[]> {
  return techniques.reduce<Record<string, MitreTechniqueEntry[]>>((acc, t) => {
    if (!acc[t.tactic]) acc[t.tactic] = []
    acc[t.tactic].push(t)
    return acc
  }, {})
}

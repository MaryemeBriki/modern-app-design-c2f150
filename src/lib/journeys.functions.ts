import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { z } from 'zod'
import { conceptions, detectConcepts, getConception } from './conceptions'

const score = z.number().int().min(1).max(5)

const journeyInput = z.object({
  conceptionId: z.string().min(1).max(100),
  pseudo: z.string().trim().max(40).optional(),
  agreementBefore: score,
  agreementAfter: score,
  confidenceBefore: score,
  confidenceAfter: score,
  representationBefore: z.string().trim().min(3).max(2000),
  reformulation: z.string().trim().min(3).max(2000),
})

export const saveJourney = createServerFn({ method: 'POST' })
  .validator(journeyInput)
  .handler(async ({ data }) => {
    const conception = getConception(data.conceptionId)
    if (!conception) throw new Error('Conception inconnue')
    const { db } = await import('../../db/index.js')
    const { journeys } = await import('../../db/schema.js')
    const conceptsUsed = detectConcepts(data.reformulation, conception.keyConcepts).length
    const [row] = await db
      .insert(journeys)
      .values({ ...data, pseudo: data.pseudo || 'Anonyme', conceptsUsed })
      .returning({ id: journeys.id })
    return { id: row.id }
  })

export type ConceptionStats = {
  conceptionId: string
  count: number
  avgAgreementBefore: number
  avgAgreementAfter: number
  avgConfidenceBefore: number
  avgConfidenceAfter: number
  /** share of journeys whose agreement with the misconception decreased */
  shiftRate: number
  avgConcepts: number
}

export type RecentJourney = {
  id: number
  conceptionId: string
  pseudo: string
  agreementBefore: number
  agreementAfter: number
  representationBefore: string
  reformulation: string
  conceptsUsed: number
  createdAt: string
}

export const getStats = createServerFn({ method: 'GET' }).handler(async () => {
  const { db } = await import('../../db/index.js')
  const { journeys } = await import('../../db/schema.js')
  const rows = await db.select().from(journeys).orderBy(desc(journeys.createdAt)).limit(500)

  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

  const perConception: ConceptionStats[] = conceptions.map((c) => {
    const rs = rows.filter((r) => r.conceptionId === c.id)
    return {
      conceptionId: c.id,
      count: rs.length,
      avgAgreementBefore: avg(rs.map((r) => r.agreementBefore)),
      avgAgreementAfter: avg(rs.map((r) => r.agreementAfter)),
      avgConfidenceBefore: avg(rs.map((r) => r.confidenceBefore)),
      avgConfidenceAfter: avg(rs.map((r) => r.confidenceAfter)),
      shiftRate: rs.length ? rs.filter((r) => r.agreementAfter < r.agreementBefore).length / rs.length : 0,
      avgConcepts: avg(rs.map((r) => r.conceptsUsed)),
    }
  })

  const recent: RecentJourney[] = rows.slice(0, 12).map((r) => ({
    id: r.id,
    conceptionId: r.conceptionId,
    pseudo: r.pseudo,
    agreementBefore: r.agreementBefore,
    agreementAfter: r.agreementAfter,
    representationBefore: r.representationBefore,
    reformulation: r.reformulation,
    conceptsUsed: r.conceptsUsed,
    createdAt: r.createdAt.toISOString(),
  }))

  return {
    total: rows.length,
    shiftRate: rows.length ? rows.filter((r) => r.agreementAfter < r.agreementBefore).length / rows.length : 0,
    perConception,
    recent,
  }
})

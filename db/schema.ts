import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

/**
 * One row = one student journey "avant → confrontation → après"
 * on a given AI misconception.
 */
export const journeys = pgTable('journeys', {
  id: serial().primaryKey(),
  conceptionId: text('conception_id').notNull(),
  pseudo: text().notNull().default('Anonyme'),
  // Agreement with the misconception, 1 (pas du tout) → 5 (tout à fait)
  agreementBefore: integer('agreement_before').notNull(),
  agreementAfter: integer('agreement_after').notNull(),
  // Confidence in one's own answer, 1 → 5
  confidenceBefore: integer('confidence_before').notNull(),
  confidenceAfter: integer('confidence_after').notNull(),
  representationBefore: text('representation_before').notNull(),
  reformulation: text().notNull(),
  // Number of key concepts mobilised in the reformulation
  conceptsUsed: integer('concepts_used').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

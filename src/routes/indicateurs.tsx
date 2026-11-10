import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Brain, Gauge, Sparkles, Users } from 'lucide-react'
import { accentClasses, conceptions, getConception } from '@/lib/conceptions'
import { getStats } from '@/lib/journeys.functions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/indicateurs')({
  loader: () => getStats(),
  head: () => ({ meta: [{ title: 'Indicateurs d’évolution — Déclic IA' }] }),
  component: Dashboard,
})

const pct = (x: number) => `${Math.round(x * 100)} %`
const fmt = (x: number) => x.toFixed(1).replace('.', ',')

function Dashboard() {
  const stats = Route.useLoaderData()
  const active = stats.perConception.filter((p) => p.count > 0)
  const avgConcepts = active.length ? active.reduce((s, p) => s + p.avgConcepts * p.count, 0) / stats.total : 0
  const confGain = active.length
    ? active.reduce((s, p) => s + (p.avgConfidenceAfter - p.avgConfidenceBefore) * p.count, 0) / stats.total
    : 0

  return (
    <main className="mx-auto max-w-content px-5 pt-12">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">Tableau de bord</p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">Indicateurs d’évolution</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Comment les conceptions de la classe évoluent entre « avant » et « après » la confrontation.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Parcours réalisés" value={String(stats.total)} />
        <Kpi icon={Sparkles} label="Taux de changement conceptuel" value={pct(stats.shiftRate)} hint="adhésion en baisse" />
        <Kpi icon={Gauge} label="Évolution de la confiance" value={`${confGain >= 0 ? '+' : ''}${fmt(confGain)}`} hint="points sur 5" />
        <Kpi icon={Brain} label="Concepts mobilisés" value={fmt(avgConcepts)} hint="en moyenne par reformulation" />
      </div>

      {stats.total === 0 ? (
        <div className="glass mt-10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold">Aucun parcours pour l’instant</h2>
          <p className="mt-2 text-muted-foreground">Les indicateurs apparaîtront dès qu’un premier étudiant aura terminé un parcours.</p>
          <Link
            to="/parcours/$id"
            params={{ id: conceptions[0].id }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-110"
          >
            Lancer le premier parcours <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <>
          <section className="glass mt-10 rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-xl font-bold">Adhésion aux idées reçues · avant → après</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-muted-foreground/60" /> Avant</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-primary" /> Après</span>
              </div>
            </div>
            <div className="mt-6 space-y-6">
              {stats.perConception.map((p) => {
                const c = getConception(p.conceptionId)!
                const left = ((Math.min(p.avgAgreementBefore, p.avgAgreementAfter) - 1) / 4) * 100
                const right = ((Math.max(p.avgAgreementBefore, p.avgAgreementAfter) - 1) / 4) * 100
                return (
                  <div key={p.conceptionId} className="grid gap-3 md:grid-cols-[18rem_1fr_9rem] md:items-center">
                    <div className="flex items-center gap-2.5">
                      <span className={cn('size-2.5 shrink-0 rounded-full', accentClasses[c.accent].dot)} />
                      <span className="text-sm font-medium">{c.statement}</span>
                    </div>
                    {p.count === 0 ? (
                      <p className="text-sm text-muted-foreground">Pas encore de données</p>
                    ) : (
                      <div className="relative h-8">
                        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                        {[0, 25, 50, 75, 100].map((t) => (
                          <div key={t} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-border" style={{ left: `${t}%` }} />
                        ))}
                        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary/40" style={{ left: `${left}%`, width: `${right - left}%` }} />
                        <Dot pos={((p.avgAgreementBefore - 1) / 4) * 100} className="bg-muted-foreground" title={`Avant : ${fmt(p.avgAgreementBefore)}/5`} />
                        <Dot pos={((p.avgAgreementAfter - 1) / 4) * 100} className="bg-primary ring-4 ring-primary/25" title={`Après : ${fmt(p.avgAgreementAfter)}/5`} />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 text-sm md:justify-end">
                      <span className="text-muted-foreground">{p.count} parcours</span>
                      {p.count > 0 && (
                        <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 font-semibold text-emerald-300">{pct(p.shiftRate)}</span>
                      )}
                    </div>
                  </div>
                )
              })}
              <div className="hidden text-xs text-muted-foreground md:grid md:grid-cols-[18rem_1fr_9rem]">
                <span />
                <div className="flex justify-between">
                  <span>1 · Pas du tout</span>
                  <span>3</span>
                  <span>5 · Tout à fait</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Reformulations récentes</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {stats.recent.map((r) => {
                const c = getConception(r.conceptionId)
                const delta = r.agreementAfter - r.agreementBefore
                return (
                  <article key={r.id} className="glass rounded-3xl p-5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className={cn('rounded-full px-2.5 py-1 font-semibold', c ? accentClasses[c.accent].chip : 'bg-secondary')}>
                        {c?.axis ?? r.conceptionId}
                      </span>
                      <span className="text-muted-foreground">
                        {r.pseudo} · {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground line-through decoration-muted-foreground/40">{r.representationBefore}</p>
                    <p className="mt-2 leading-relaxed">{r.reformulation}</p>
                    <div className="mt-4 flex gap-2 text-xs">
                      <span className={cn('rounded-full px-2.5 py-1 font-semibold', delta < 0 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-secondary text-muted-foreground')}>
                        Adhésion {r.agreementBefore} → {r.agreementAfter}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-muted-foreground">{r.conceptsUsed} concept(s)</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </>
      )}
    </main>
  )
}

function Dot({ pos, className, title }: { pos: number; className: string; title: string }) {
  return (
    <div
      title={title}
      className={cn('absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background transition-all duration-700', className)}
      style={{ left: `${pos}%` }}
    />
  )
}

function Kpi({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint?: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-display text-4xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleCheck,
  CircleX,
  Loader2,
  MessageSquareQuote,
  RefreshCcw,
  Swords,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { accentClasses, detectConcepts, getConception, scaleLabels } from '@/lib/conceptions'
import type { Conception } from '@/lib/conceptions'
import { saveJourney } from '@/lib/journeys.functions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/parcours/$id')({
  loader: ({ params }) => {
    const conception = getConception(params.id)
    if (!conception) throw notFound()
    return { conceptionId: conception.id }
  },
  head: ({ params }) => ({
    meta: [{ title: `${getConception(params.id)?.statement ?? 'Parcours'} — Déclic IA` }],
  }),
  component: JourneyPage,
})

const stepMeta = [
  { label: 'Avant', icon: MessageSquareQuote },
  { label: 'Confrontation', icon: Swords },
  { label: 'Après', icon: RefreshCcw },
  { label: 'Bilan', icon: Trophy },
]

function JourneyPage() {
  const { conceptionId } = Route.useLoaderData()
  const conception = getConception(conceptionId)!
  // key resets state when switching conception
  return <Journey key={conception.id} conception={conception} />
}

function Journey({ conception }: { conception: Conception }) {
  const [step, setStep] = useState(0)
  const [representation, setRepresentation] = useState('')
  const [agreementBefore, setAgreementBefore] = useState<number | null>(null)
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(conception.counterExamples.map(() => null))
  const [agreementAfter, setAgreementAfter] = useState<number | null>(null)
  const [confidenceAfter, setConfidenceAfter] = useState<number | null>(null)
  const [reformulation, setReformulation] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [saving, setSaving] = useState(false)

  const a = accentClasses[conception.accent]
  const canLeaveBefore = representation.trim().length >= 3 && agreementBefore && confidenceBefore
  const canLeaveConfront = answers.every((x) => x !== null)
  const canSubmit = reformulation.trim().length >= 3 && agreementAfter && confidenceAfter
  const detected = detectConcepts(reformulation, conception.keyConcepts)

  const go = (n: number) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit() {
    if (!canSubmit || !agreementBefore || !confidenceBefore || !agreementAfter || !confidenceAfter) return
    setSaving(true)
    try {
      await saveJourney({
        data: {
          conceptionId: conception.id,
          pseudo: pseudo.trim() || undefined,
          agreementBefore,
          agreementAfter,
          confidenceBefore,
          confidenceAfter,
          representationBefore: representation.trim(),
          reformulation: reformulation.trim(),
        },
      })
      toast.success('Parcours enregistré', { description: 'Tes indicateurs ont été ajoutés au tableau de bord.' })
      go(3)
    } catch {
      toast.error('Enregistrement impossible', { description: 'Vérifie ta connexion puis réessaie.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pt-10">
      <Link to="/" hash="parcours" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Tous les parcours
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 min-w-12 place-items-center rounded-2xl bg-primary px-3 font-display text-lg font-extrabold text-primary-foreground">
            {conception.number}
          </span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', a.chip)}>{conception.axis}</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{conception.statement}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{conception.tagline}</p>
      </header>

      {/* Stepper */}
      <ol className="mt-8 grid grid-cols-4 gap-2">
        {stepMeta.map((s, i) => (
          <li key={s.label}>
            <div className={cn('h-1.5 rounded-full transition-colors duration-500', i <= step ? 'bg-primary' : 'bg-secondary')} />
            <div className={cn('mt-2 flex items-center gap-1.5 text-xs font-semibold sm:text-sm', i === step ? 'text-foreground' : 'text-muted-foreground')}>
              {i < step ? <Check className="size-3.5 text-primary" /> : <s.icon className="size-3.5" />}
              {s.label}
            </div>
          </li>
        ))}
      </ol>

      <div key={step} className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {step === 0 && (
          <Panel eyebrow="Étape 1 · Représentation initiale" title={conception.initialPrompt}>
            <Textarea
              value={representation}
              onChange={(e) => setRepresentation(e.target.value)}
              placeholder="Écris librement ce que tu penses, sans chercher la « bonne » réponse…"
              className="min-h-32 rounded-2xl bg-background/60 text-base"
              maxLength={2000}
            />
            <Scale
              label={`Es-tu d’accord avec l’affirmation ${conception.statement} ?`}
              value={agreementBefore}
              onChange={setAgreementBefore}
            />
            <Scale label="À quel point es-tu sûr·e de ta réponse ?" value={confidenceBefore} onChange={setConfidenceBefore} kind="confidence" />
            <NavRow>
              <span />
              <PrimaryButton disabled={!canLeaveBefore} onClick={() => go(1)}>
                Passer à la confrontation <ArrowRight className="size-4" />
              </PrimaryButton>
            </NavRow>
          </Panel>
        )}

        {step === 1 && (
          <div className="space-y-6">
            {conception.counterExamples.map((ce, idx) => {
              const chosen = answers[idx]
              return (
                <Panel key={ce.title} eyebrow={`Contre-exemple ${idx + 1}`} title={ce.title}>
                  <p className="rounded-2xl border-l-4 border-accent bg-accent/10 p-4 leading-relaxed">{ce.scenario}</p>
                  <p className="font-semibold">{ce.question}</p>
                  <div className="grid gap-2.5">
                    {ce.options.map((opt, oi) => {
                      const isChosen = chosen === oi
                      const isRight = oi === ce.answer
                      const revealed = chosen !== null
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={revealed}
                          onClick={() => setAnswers((prev) => prev.map((v, i) => (i === idx ? oi : v)))}
                          className={cn(
                            'flex items-start gap-3 rounded-2xl border p-4 text-left transition',
                            !revealed && 'border-border bg-background/40 hover:border-primary/60 hover:bg-primary/5',
                            revealed && isRight && 'border-emerald-400/60 bg-emerald-400/10',
                            revealed && isChosen && !isRight && 'border-rose-400/60 bg-rose-400/10',
                            revealed && !isChosen && !isRight && 'border-border/50 opacity-50',
                          )}
                        >
                          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border text-xs font-bold">
                            {revealed && isRight ? (
                              <CircleCheck className="size-5 text-emerald-400" />
                            ) : revealed && isChosen ? (
                              <CircleX className="size-5 text-rose-400" />
                            ) : (
                              String.fromCharCode(65 + oi)
                            )}
                          </span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {chosen !== null && (
                    <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl bg-primary/10 p-4 duration-500">
                      <p className="text-sm font-bold text-primary">
                        {chosen === ce.answer ? 'Bien vu !' : 'Pas tout à fait…'}
                      </p>
                      <p className="mt-1 leading-relaxed">{ce.reveal}</p>
                    </div>
                  )}
                </Panel>
              )
            })}

            {canLeaveConfront && (
              <div className="glass animate-in fade-in rounded-3xl p-6 duration-500">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent">
                  <BookOpenCheck className="size-4" /> Le modèle scientifique
                </div>
                <p className="mt-3 text-lg leading-relaxed">{conception.scientificModel}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {conception.keyConcepts.map((k) => (
                    <span key={k.label} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                      {k.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <NavRow>
              <GhostButton onClick={() => go(0)}>
                <ArrowLeft className="size-4" /> Retour
              </GhostButton>
              <PrimaryButton disabled={!canLeaveConfront} onClick={() => go(2)}>
                Reformuler <ArrowRight className="size-4" />
              </PrimaryButton>
            </NavRow>
          </div>
        )}

        {step === 2 && (
          <Panel eyebrow="Étape 3 · Reformulation" title="Avec tes propres mots, que dirais-tu maintenant ?">
            <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ce que tu pensais avant</p>
              <p className="mt-1 italic">« {representation} »</p>
            </div>
            <Textarea
              value={reformulation}
              onChange={(e) => setReformulation(e.target.value)}
              placeholder="Reformule en t’appuyant sur ce que tu viens de découvrir…"
              className="min-h-32 rounded-2xl bg-background/60 text-base"
              maxLength={2000}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Concepts mobilisés · {detected.length}/{conception.keyConcepts.length}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {conception.keyConcepts.map((k) => {
                  const on = detected.includes(k)
                  return (
                    <span
                      key={k.label}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition',
                        on ? 'bg-emerald-400/15 text-emerald-300' : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {on && <Check className="size-3" />} {k.label}
                    </span>
                  )
                })}
              </div>
            </div>
            <Scale label={`Es-tu toujours d’accord avec ${conception.statement} ?`} value={agreementAfter} onChange={setAgreementAfter} />
            <Scale label="À quel point es-tu sûr·e de ta réponse maintenant ?" value={confidenceAfter} onChange={setConfidenceAfter} kind="confidence" />
            <div>
              <label htmlFor="pseudo" className="text-sm font-medium">
                Pseudo <span className="text-muted-foreground">(facultatif)</span>
              </label>
              <Input id="pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} maxLength={40} placeholder="Anonyme" className="mt-2 h-11 rounded-xl bg-background/60" />
            </div>
            <NavRow>
              <GhostButton onClick={() => go(1)}>
                <ArrowLeft className="size-4" /> Retour
              </GhostButton>
              <PrimaryButton disabled={!canSubmit || saving} onClick={submit}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Valider mon parcours
              </PrimaryButton>
            </NavRow>
          </Panel>
        )}

        {step === 3 && agreementBefore && agreementAfter && confidenceBefore && confidenceAfter && (
          <Results
            conception={conception}
            agreement={[agreementBefore, agreementAfter]}
            confidence={[confidenceBefore, confidenceAfter]}
            concepts={detected.length}
            before={representation}
            after={reformulation}
          />
        )}
      </div>
    </main>
  )
}

function Results({
  conception,
  agreement,
  confidence,
  concepts,
  before,
  after,
}: {
  conception: Conception
  agreement: [number, number]
  confidence: [number, number]
  concepts: number
  before: string
  after: string
}) {
  const shift = agreement[0] - agreement[1]
  const verdict =
    shift >= 2
      ? { title: 'Changement conceptuel net', text: 'Ta représentation a fortement évolué après la confrontation.' }
      : shift === 1
        ? { title: 'Conception en évolution', text: 'Tu as commencé à remettre en question l’idée initiale.' }
        : agreement[1] <= 2
          ? { title: 'Conception déjà solide', text: 'Tu ne partageais pas cette idée reçue — et tu l’argumentes mieux maintenant.' }
          : { title: 'Conception résistante', text: 'L’idée initiale persiste : c’est normal, le changement conceptuel prend du temps.' }

  return (
    <div className="space-y-6">
      <div className="glass relative overflow-hidden rounded-3xl p-8 text-center">
        <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-72 rounded-full bg-primary/30 blur-3xl" />
        <Trophy className="relative mx-auto size-10 text-accent" />
        <h2 className="relative mt-4 text-3xl font-extrabold">{verdict.title}</h2>
        <p className="relative mt-2 text-muted-foreground">{verdict.text}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Adhésion à l’idée reçue" before={agreement[0]} after={agreement[1]} goodWhenLower />
        <Metric label="Confiance" before={confidence[0]} after={confidence[1]} />
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-muted-foreground">Concepts mobilisés</p>
          <p className="mt-2 font-display text-4xl font-extrabold">
            {concepts}
            <span className="text-xl text-muted-foreground">/{conception.keyConcepts.length}</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${(concepts / conception.keyConcepts.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-background/40 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avant</p>
          <p className="mt-2 leading-relaxed">{before}</p>
        </div>
        <div className="rounded-3xl border border-primary/40 bg-primary/10 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Après</p>
          <p className="mt-2 leading-relaxed">{after}</p>
        </div>
      </div>

      <NavRow>
        <Link to="/" hash="parcours" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-semibold hover:bg-secondary">
          Autre parcours
        </Link>
        <Link to="/indicateurs" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-110">
          Voir les indicateurs de la classe <ArrowRight className="size-4" />
        </Link>
      </NavRow>
    </div>
  )
}

function Metric({ label, before, after, goodWhenLower }: { label: string; before: number; after: number; goodWhenLower?: boolean }) {
  const delta = after - before
  const good = goodWhenLower ? delta < 0 : delta > 0
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-4xl font-extrabold">{after}</span>
        <span className="text-muted-foreground">/5</span>
        {delta !== 0 && (
          <span className={cn('ml-auto rounded-full px-2.5 py-0.5 text-sm font-bold', good ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300')}>
            {delta > 0 ? '+' : ''}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 space-y-1.5">
        <Bar value={before} className="bg-muted-foreground/40" tag="avant" />
        <Bar value={after} className="bg-primary" tag="après" />
      </div>
    </div>
  )
}

function Bar({ value, className, tag }: { value: number; className: string; tag: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-10">{tag}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className={cn('h-full rounded-full transition-all duration-700', className)} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  )
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="glass space-y-5 rounded-3xl p-6 md:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-bold leading-snug md:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Scale({
  label,
  value,
  onChange,
  kind = 'agreement',
}: {
  label: string
  value: number | null
  onChange: (v: number) => void
  kind?: 'agreement' | 'confidence'
}) {
  const labels = kind === 'agreement' ? scaleLabels : ['Pas sûr·e', 'Peu sûr·e', 'Moyen', 'Assez sûr·e', 'Certain·e']
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {labels.map((l, i) => {
          const v = i + 1
          const on = value === v
          return (
            <button
              key={l}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(v)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl border px-1 py-3 text-center transition',
                on ? 'border-primary bg-primary/15 text-foreground shadow-lg shadow-primary/10' : 'border-border bg-background/40 text-muted-foreground hover:border-primary/50',
              )}
            >
              <span className="font-display text-lg font-extrabold">{v}</span>
              <span className="text-[11px] leading-tight sm:text-xs">{l}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function NavRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 pt-2">{children}</div>
}

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      {children}
    </button>
  )
}

function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...props} className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground">
      {children}
    </button>
  )
}

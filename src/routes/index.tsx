import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Lightbulb, MessageSquareQuote, RefreshCcw, Swords, TrendingUp } from 'lucide-react'
import { accentClasses, conceptions } from '@/lib/conceptions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

const steps = [
  {
    icon: MessageSquareQuote,
    label: 'Avant',
    title: 'Représentation initiale',
    text: 'L’étudiant exprime ce qu’il pense vraiment, et à quel point il en est sûr.',
  },
  {
    icon: Swords,
    label: 'Confrontation',
    title: 'Contre-exemple',
    text: 'Un cas réel déstabilise la conception : il faut prédire, puis découvrir.',
  },
  {
    icon: RefreshCcw,
    label: 'Après',
    title: 'Reformulation',
    text: 'L’étudiant reformule avec ses mots en mobilisant les concepts scientifiques.',
  },
]

function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-content items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_1fr] md:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" />
              Axe psychologique · Fiche 11
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Faire évoluer les <span className="text-gradient">conceptions erronées</span> sur l’intelligence
              artificielle
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              « L’IA comprend comme un humain » ? Déclic IA guide les étudiants à travers un parcours court —
              représentation, contre-exemple, reformulation — et mesure l’évolution de leurs idées.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/parcours/$id"
                params={{ id: conceptions[0].id }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition hover:brightness-110"
              >
                Commencer un parcours
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/indicateurs"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-3.5 font-semibold transition hover:bg-secondary"
              >
                <TrendingUp className="size-4" /> Voir les indicateurs
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/20 blur-3xl" />
            <img
              src="/.netlify/images?url=/img/hero.png&w=1100&fm=webp"
              srcSet="/.netlify/images?url=/img/hero.png&w=700&fm=webp 700w, /.netlify/images?url=/img/hero.png&w=1100&fm=webp 1100w"
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="Tête translucide dont les fils emmêlés se transforment en connexions lumineuses"
              width={1376}
              height={768}
              className="relative w-full rounded-[2rem] border border-border/70 shadow-2xl"
            />
            <div className="glass absolute -bottom-6 left-4 right-4 rounded-2xl p-4 md:left-auto md:right-6 md:w-80">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Question directrice</p>
              <p className="mt-1.5 text-sm leading-snug">
                Comment aider les étudiants à revoir des idées telles que « l’IA comprend comme un humain » ?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-content px-5 pt-16">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.label} className="glass relative rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <s.icon className="size-5" />
                </span>
                <span className="font-display text-5xl font-extrabold text-foreground/10">0{i + 1}</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary">{s.label}</p>
              <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              {i < 2 && (
                <ArrowRight className="absolute -right-3.5 top-1/2 z-10 hidden size-7 -translate-y-1/2 rounded-full border border-border bg-background p-1.5 text-muted-foreground md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="parcours" className="mx-auto max-w-content scroll-mt-20 px-5 pt-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Les parcours</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Cinq idées reçues à déconstruire</h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Chaque parcours dure environ 5 minutes et produit des indicateurs d’évolution : adhésion, confiance,
            concepts mobilisés.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {conceptions.map((c) => {
            const a = accentClasses[c.accent]
            return (
              <Link
                key={c.id}
                to="/parcours/$id"
                params={{ id: c.id }}
                className="group glass relative flex flex-col overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50"
              >
                <div className={cn('pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition group-hover:opacity-100', a.ring)} />
                <div className="flex items-center justify-between">
                  <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', a.chip)}>{c.axis}</span>
                  <span className="font-display text-sm font-bold text-muted-foreground">{c.number}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug">{c.statement}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.tagline}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Démarrer <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
          <div className="flex flex-col justify-center rounded-3xl border border-dashed border-border p-6">
            <Lightbulb className="size-6 text-accent" />
            <p className="mt-3 font-semibold">Mots-clés du dispositif</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Changement conceptuel', 'Preuve', 'Appropriation'].map((k) => (
                <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

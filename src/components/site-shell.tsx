import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-sky-300 text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="size-4.5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Déclic<span className="text-primary">IA</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            hash="parcours"
            className="rounded-full px-4 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            Parcours
          </Link>
          <Link
            to="/indicateurs"
            className="rounded-full px-4 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            activeProps={{ className: 'bg-secondary text-foreground' }}
          >
            Indicateurs
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>ENS Rabat · Master Informatique · Fondements de la didactique</p>
        <p>Axe psychologique — Changement conceptuel · preuve · appropriation</p>
      </div>
    </footer>
  )
}

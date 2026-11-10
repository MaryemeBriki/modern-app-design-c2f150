# Déclic IA

Application pédagogique pour faire évoluer les **conceptions erronées sur l’intelligence artificielle** — « l’IA comprend comme un humain », « une IA est neutre », « si l’IA l’affirme, c’est vrai »…

Conçue pour le module *Fondements de la didactique* (ENS Rabat, Master Informatique, axe psychologique), elle met en œuvre la piste d’application : une séquence courte partant d’une **représentation initiale**, d’un **contre-exemple** et d’une **reformulation**, avec des **indicateurs d’évolution**.

## Fonctionnalités

- **Accueil** : présentation du dispositif et catalogue de 5 parcours.
- **Parcours** (`/parcours/:id`) : avant (représentation + échelles d’adhésion et de confiance) → confrontation (contre-exemples réels, prédiction puis révélation, modèle scientifique) → après (reformulation avec détection des concepts clés) → bilan personnel.
- **Indicateurs** (`/indicateurs`) : taux de changement conceptuel, évolution de la confiance, concepts mobilisés, comparaison avant/après par idée reçue, reformulations récentes.

## Technologies

TanStack Start (React 19), Tailwind CSS 4, shadcn/ui, Netlify Database (Postgres) avec Drizzle ORM, Netlify Image CDN.

## Lancer en local

```bash
pnpm install
netlify dev
```

Le schéma est dans `db/schema.ts` ; après modification, générer une migration avec `npx drizzle-kit generate --name <nom>`. Les migrations sont appliquées automatiquement par Netlify au déploiement.

## Ajouter une idée reçue

Ajouter une entrée dans `src/lib/conceptions.ts` (énoncé, contre-exemples, modèle scientifique, concepts clés). Elle apparaît automatiquement dans le catalogue, les parcours et le tableau de bord.

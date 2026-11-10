/**
 * Pedagogical content: the AI misconceptions students confront.
 * Each conception drives a full "avant → confrontation → après" journey.
 * Add a new entry here to add a new journey — no other code change needed.
 */

export type CounterExample = {
  title: string
  scenario: string
  question: string
  options: string[]
  /** index into options */
  answer: number
  reveal: string
}

export type KeyConcept = {
  label: string
  /** lowercase stems detected in the student's reformulation */
  stems: string[]
}

export type Conception = {
  id: string
  number: string
  axis: string
  statement: string
  tagline: string
  initialPrompt: string
  counterExamples: CounterExample[]
  scientificModel: string
  keyConcepts: KeyConcept[]
  accent: 'blue' | 'amber' | 'violet' | 'teal' | 'rose'
}

export const conceptions: Conception[] = [
  {
    id: 'ia-comprend-comme-humain',
    number: '01',
    axis: 'Compréhension',
    statement: '« L’IA comprend comme un humain »',
    tagline: 'Prédire le mot suivant n’est pas comprendre le monde.',
    initialPrompt:
      'Selon toi, que se passe-t-il « dans la tête » d’un assistant conversationnel quand il répond à ta question ?',
    counterExamples: [
      {
        title: 'Le problème des chaussettes',
        scenario:
          'On demande à un modèle de langage : « Si 5 chaussettes sèchent en 1 heure au soleil, combien de temps pour 30 chaussettes ? ». Plusieurs modèles ont répondu « 6 heures ».',
        question: 'Pourquoi un modèle peut-il produire cette réponse ?',
        options: [
          'Il a mal compris la question, comme un élève distrait',
          'Il reproduit un motif statistique fréquent (problèmes de proportionnalité) sans modèle physique du séchage',
          'Il manquait d’informations sur la météo',
        ],
        answer: 1,
        reveal:
          'Le modèle génère la suite de texte la plus probable selon ses données d’entraînement. Les énoncés « si X en Y, combien pour Z » sont presque toujours proportionnels : le motif l’emporte sur toute représentation du monde réel.',
      },
      {
        title: 'Une phrase, un mot changé',
        scenario:
          'Un classifieur d’images reconnaît un panda avec 58 % de confiance. On ajoute un bruit invisible à l’œil humain : il affirme alors « gibbon » à 99 %.',
        question: 'Que révèle cette expérience ?',
        options: [
          'Le modèle s’appuie sur des corrélations de pixels, pas sur le concept de « panda »',
          'Le modèle a une mauvaise vue',
          'Le bruit a réellement transformé l’image en gibbon',
        ],
        answer: 0,
        reveal:
          'Ces « exemples adverses » montrent que le réseau associe des motifs numériques à des étiquettes. Un humain, qui possède un concept de panda, ne serait jamais trompé.',
      },
    ],
    scientificModel:
      'Un modèle d’IA apprend des régularités statistiques dans des données. Il produit des sorties probables à partir de motifs, sans intentions, sans expérience du monde et sans compréhension au sens humain.',
    keyConcepts: [
      { label: 'Statistique / probabilité', stems: ['statisti', 'probab'] },
      { label: 'Données d’entraînement', stems: ['donnée', 'entraîn', 'entrain', 'corpus'] },
      { label: 'Motifs / corrélations', stems: ['motif', 'corrél', 'correl', 'régularit', 'pattern'] },
      { label: 'Prédiction', stems: ['prédi', 'predi', 'mot suivant', 'token'] },
      { label: 'Absence de sens / d’intention', stems: ['sans compr', 'pas de sens', 'intention', 'conscience', 'ne comprend pas'] },
    ],
    accent: 'blue',
  },
  {
    id: 'ia-objective',
    number: '02',
    axis: 'Biais',
    statement: '« Une IA est neutre et objective »',
    tagline: 'Un algorithme hérite des choix et des données qui l’ont façonné.',
    initialPrompt:
      'Une IA qui trie des CV peut-elle être plus juste qu’un recruteur humain ? Explique ton raisonnement.',
    counterExamples: [
      {
        title: 'Le recrutement automatisé',
        scenario:
          'Une grande entreprise a entraîné un outil de tri de CV sur 10 ans de recrutements passés, majoritairement masculins. L’outil s’est mis à pénaliser les CV contenant le mot « féminin » (ex. « capitaine du club d’échecs féminin »).',
        question: 'D’où vient ce comportement ?',
        options: [
          'Un développeur l’a programmé volontairement',
          'Le modèle a reproduit les déséquilibres présents dans ses données historiques',
          'C’est un bug aléatoire',
        ],
        answer: 1,
        reveal:
          'Aucune règle explicite n’a été écrite : le modèle a appris que les profils retenus étaient surtout masculins. Les biais des données deviennent des biais du modèle.',
      },
    ],
    scientificModel:
      'Une IA n’est pas neutre : elle reflète les biais de ses données, les choix de ses concepteurs (variables, objectifs, métriques) et le contexte de son usage. L’objectivité doit être évaluée et contrôlée.',
    keyConcepts: [
      { label: 'Biais', stems: ['biais', 'bias'] },
      { label: 'Données historiques', stems: ['donnée', 'historique', 'passé'] },
      { label: 'Choix des concepteurs', stems: ['concepteur', 'développeur', 'developpeur', 'choix', 'humain'] },
      { label: 'Évaluation / contrôle', stems: ['évalu', 'evalu', 'contrôl', 'control', 'audit', 'vérifi'] },
    ],
    accent: 'amber',
  },
  {
    id: 'plus-de-donnees',
    number: '03',
    axis: 'Données',
    statement: '« Plus de données = toujours de meilleurs résultats »',
    tagline: 'La qualité et la représentativité comptent autant que la quantité.',
    initialPrompt:
      'Pour améliorer un modèle qui détecte des maladies de peau, que ferais-tu en priorité ? Pourquoi ?',
    counterExamples: [
      {
        title: 'Le détecteur de mélanomes',
        scenario:
          'Un modèle entraîné sur des milliers d’images de lésions obtient d’excellents scores. En clinique, il échoue fortement sur les peaux foncées, presque absentes du jeu de données.',
        question: 'Qu’aurait-il fallu améliorer ?',
        options: [
          'Ajouter encore plus d’images du même type',
          'La représentativité du jeu de données',
          'La vitesse de calcul',
        ],
        answer: 1,
        reveal:
          'Des millions d’exemples peu variés n’apprennent pas au modèle à généraliser. Un jeu plus petit mais représentatif et bien annoté est souvent plus utile.',
      },
    ],
    scientificModel:
      'La performance d’un modèle dépend de la qualité, de la diversité et de la représentativité des données, de l’annotation et de l’évaluation hors échantillon — pas seulement de leur volume.',
    keyConcepts: [
      { label: 'Qualité', stems: ['qualit'] },
      { label: 'Représentativité / diversité', stems: ['représent', 'represent', 'divers', 'variét'] },
      { label: 'Généralisation', stems: ['généralis', 'generalis', 'surapprent', 'overfit'] },
      { label: 'Annotation', stems: ['annot', 'étiquet', 'label'] },
    ],
    accent: 'teal',
  },
  {
    id: 'assurance-verite',
    number: '04',
    axis: 'Fiabilité',
    statement: '« Si l’IA l’affirme avec assurance, c’est vrai »',
    tagline: 'Un ton confiant n’est pas une preuve.',
    initialPrompt:
      'Comment sais-tu si une réponse donnée par un chatbot est fiable ? Décris ta démarche.',
    counterExamples: [
      {
        title: 'Les références inventées',
        scenario:
          'Un avocat a soumis à un tribunal un mémoire rédigé avec un chatbot. Six jurisprudences citées, avec numéros et extraits, n’avaient jamais existé.',
        question: 'Pourquoi le chatbot a-t-il inventé ces références ?',
        options: [
          'Il a menti intentionnellement',
          'Il génère un texte plausible, sans mécanisme intrinsèque de vérification des faits',
          'Les références ont été supprimées depuis',
        ],
        answer: 1,
        reveal:
          'On parle d’« hallucination » : le modèle produit une forme vraisemblable (format de citation, ton juridique) sans accès garanti à la vérité. La preuve doit venir de sources vérifiables.',
      },
    ],
    scientificModel:
      'Un modèle génératif peut produire des contenus faux mais plausibles (hallucinations). La fiabilité se vérifie par la confrontation à des sources, la preuve et l’esprit critique, indépendamment du ton employé.',
    keyConcepts: [
      { label: 'Hallucination', stems: ['halluc', 'invent'] },
      { label: 'Vérification des sources', stems: ['source', 'vérifi', 'verifi', 'recoup'] },
      { label: 'Preuve', stems: ['preuve', 'prouv'] },
      { label: 'Plausibilité', stems: ['plausib', 'vraisembl'] },
      { label: 'Esprit critique', stems: ['critique', 'doute'] },
    ],
    accent: 'rose',
  },
  {
    id: 'apprend-seule',
    number: '05',
    axis: 'Apprentissage',
    statement: '« L’IA apprend toute seule, sans humains »',
    tagline: 'Derrière chaque modèle : des humains qui collectent, annotent, corrigent.',
    initialPrompt:
      'Qui intervient, selon toi, dans la création d’un assistant comme ChatGPT ? Décris les étapes.',
    counterExamples: [
      {
        title: 'Les petites mains de l’IA',
        scenario:
          'Pour rendre un chatbot poli et utile, des milliers d’annotateurs ont classé et noté des réponses, une par une, afin d’entraîner le modèle par renforcement à partir de retours humains (RLHF).',
        question: 'Que montre cet exemple ?',
        options: [
          'L’apprentissage repose sur un important travail humain (données, annotation, objectifs)',
          'Les humains servent seulement à allumer les serveurs',
          'Le chatbot a appris la politesse en lisant Internet seul',
        ],
        answer: 0,
        reveal:
          'Choix des données, annotation, définition de l’objectif, évaluation, correction : l’« apprentissage automatique » est un processus socio-technique profondément humain.',
      },
    ],
    scientificModel:
      'L’apprentissage automatique ajuste des paramètres pour optimiser un objectif défini par des humains, à partir de données sélectionnées et souvent annotées par des humains, puis évaluées et corrigées par eux.',
    keyConcepts: [
      { label: 'Annotation humaine', stems: ['annot', 'étiquet', 'label'] },
      { label: 'Objectif / fonction de coût', stems: ['objectif', 'coût', 'cout', 'optimis'] },
      { label: 'Paramètres', stems: ['paramètre', 'parametre', 'poids'] },
      { label: 'Retours humains', stems: ['retour', 'feedback', 'rlhf', 'correct'] },
    ],
    accent: 'violet',
  },
]

export function getConception(id: string) {
  return conceptions.find((c) => c.id === id)
}

/** Which key concepts appear in a free-text reformulation. */
export function detectConcepts(text: string, concepts: KeyConcept[]) {
  const t = text.toLowerCase()
  return concepts.filter((c) => c.stems.some((s) => t.includes(s)))
}

export const accentClasses: Record<Conception['accent'], { chip: string; dot: string; ring: string }> = {
  blue: { chip: 'bg-sky-500/15 text-sky-300', dot: 'bg-sky-400', ring: 'from-sky-400/40' },
  amber: { chip: 'bg-amber-500/15 text-amber-300', dot: 'bg-amber-400', ring: 'from-amber-400/40' },
  teal: { chip: 'bg-teal-500/15 text-teal-300', dot: 'bg-teal-400', ring: 'from-teal-400/40' },
  rose: { chip: 'bg-rose-500/15 text-rose-300', dot: 'bg-rose-400', ring: 'from-rose-400/40' },
  violet: { chip: 'bg-violet-500/15 text-violet-300', dot: 'bg-violet-400', ring: 'from-violet-400/40' },
}

export const scaleLabels = ['Pas du tout', 'Plutôt non', 'Hésitant·e', 'Plutôt oui', 'Tout à fait']

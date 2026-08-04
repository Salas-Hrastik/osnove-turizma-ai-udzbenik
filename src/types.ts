export type Mode = 'Razgovaraj' | 'Prouči' | 'Gledaj i slušaj' | 'Vježbaj' | 'Provjeri'

export interface ChapterSummary {
  id: number
  title: string
  pages: string
  outcome: string
  status: 'pilot' | 'planned' | 'assessment'
}

export interface LearningStep {
  title: string
  body: string
  source: string
}

export interface Flashcard {
  term: string
  definition: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface PilotChapter extends ChapterSummary {
  summary: string
  keywords: Flashcard[]
  steps: LearningStep[]
  questions: QuizQuestion[]
}

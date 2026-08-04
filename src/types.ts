export type Mode = 'Razgovaraj' | 'Prouči' | 'Gledaj i slušaj' | 'Vježbaj' | 'Provjeri'

export interface ChapterSummary {
  id: number
  title: string
  pages: string
  outcome: string
  status: 'available' | 'planned' | 'assessment'
}

export interface LearningStep {
  title: string
  body: string
  points: string[]
  takeaway: string
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

export interface DataPoint {
  label: string
  value: string
  change?: string
}

export interface AppliedActivity {
  title: string
  intro: string
  tasks: string[]
  note: string
}

export interface EditorialUpdate {
  title: string
  checkedAt: string
  body: string
  implications: string[]
}

export interface SourceLink {
  label: string
  detail: string
  url?: string
}

export interface MediaFile {
  title: string
  fileName: string
  url: string
  duration: string
  description: string
}

export interface PresentationSlide {
  number: number
  title: string
  image: string
  interpretation: string
}

export interface PresentationFile {
  title: string
  fileName: string
  url: string
  description: string
  slides: PresentationSlide[]
}

export interface ChapterMedia {
  audio: MediaFile
  video: MediaFile & { poster: string }
  presentation: PresentationFile
}

export interface ChapterContent extends ChapterSummary {
  summary: string
  outcomes: string[]
  keywords: Flashcard[]
  steps: LearningStep[]
  dataSnapshot: DataPoint[]
  appliedActivity: AppliedActivity
  editorialUpdate: EditorialUpdate
  sources: SourceLink[]
  questions: QuizQuestion[]
  media?: ChapterMedia
}

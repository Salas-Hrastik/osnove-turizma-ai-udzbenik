import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, CheckCircle2, LockKeyhole, Mic, RotateCcw, Sparkles, Square } from 'lucide-react'
import { chapterContents } from './data/book'
import type { ChapterContent } from './types'

const QUESTION_COUNT = 5
const HELP_PAUSE_MS = 5000
const COMPLETION_PAUSE_MS = 12000
const CONFIRMATION_REMINDER_MS = 8000

type ExamPhase = 'intro' | 'connecting' | 'asking' | 'answering' | 'evaluating' | 'feedback' | 'confirming' | 'finishing' | 'complete' | 'error'
type SpokenKind = 'question' | 'hint' | 'confirmation' | 'continue' | 'final'

type OralQuestion = {
  id: string
  chapterId: number
  chapterTitle: string
  question: string
  expectedAnswer: string
  explanation: string
  hintTerms: string[]
}

type AnswerEvaluation = {
  score: number
  complete: boolean
  level: string
  strengths: string
  omissions: string
  feedback: string
  hint: string
}

type ExamRecord = {
  question: OralQuestion
  answer: string
  hint?: string
  evaluation: AnswerEvaluation
}

type FinalAssessment = {
  total: number
  grade: number
  gradeLabel: string
  summary: string
  strengths: string
  recommendations: string
}

type RealtimeEvent = {
  type?: string
  transcript?: string
  error?: { message?: string }
  response?: {
    status?: string
    status_details?: { reason?: string }
    metadata?: { exam_kind?: SpokenKind }
  }
}

function secureShuffle<T>(items: T[]) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const random = new Uint32Array(1)
    crypto.getRandomValues(random)
    const target = random[0] % (index + 1)
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  return shuffled
}

function selectQuestions() {
  const sourceChapters = Object.values(chapterContents)
    .filter((chapter): chapter is ChapterContent => chapter !== undefined && chapter.id <= 11 && chapter.questions.length > 0)
  return secureShuffle(sourceChapters).slice(0, QUESTION_COUNT).map((chapter) => {
    const question = secureShuffle(chapter.questions)[0]
    const expected = question.options[question.correct]
    return {
      id: `${chapter.id}-${question.question}`,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      question: question.question,
      expectedAnswer: `${expected}. ${question.explanation}`,
      explanation: question.explanation,
      hintTerms: secureShuffle(chapter.keywords.map((keyword) => keyword.term)).slice(0, 3),
    }
  })
}

function gradeFromTotal(total: number) {
  if (total >= 89) return { grade: 5, label: 'izvrstan' }
  if (total >= 75) return { grade: 4, label: 'vrlo dobar' }
  if (total >= 63) return { grade: 3, label: 'dobar' }
  if (total >= 50) return { grade: 2, label: 'dovoljan' }
  return { grade: 1, label: 'nedovoljan' }
}

function cleanAnswer(value: string) {
  return value
    .replace(/\b(gotov(?:a)? sam|to je sve|završio sam|završila sam)\b[.!]?/giu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function isAffirmative(value: string) {
  return /\b(da|jesam|dovršio sam|dovršila sam|gotov sam|gotova sam|završio sam|završila sam)\b/iu.test(value)
}

function isNegative(value: string) {
  return /\b(ne|nisam|još nisam|želim nastaviti|nastavio bih|nastavila bih)\b/iu.test(value)
}

function spokenQuestion(question: OralQuestion, index: number) {
  return `Tema je ${question.chapterTitle}. Pitanje ${index + 1}: ${question.question}`
}

export function FinalOralExam() {
  const [phase, setPhase] = useState<ExamPhase>('intro')
  const [questions, setQuestions] = useState<OralQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [records, setRecords] = useState<ExamRecord[]>([])
  const [currentHint, setCurrentHint] = useState('')
  const [error, setError] = useState('')
  const [finalAssessment, setFinalAssessment] = useState<FinalAssessment | null>(null)

  const peerRef = useRef<RTCPeerConnection | null>(null)
  const channelRef = useRef<RTCDataChannel | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const disconnectTimerRef = useRef<number | null>(null)
  const pauseTimerRef = useRef<number | null>(null)
  const responseActiveRef = useRef(false)
  const phaseRef = useRef<ExamPhase>('intro')
  const answerSegmentsRef = useRef<string[]>([])
  const hintUsedRef = useRef(false)
  const hintTextRef = useRef('')
  const evaluatingRef = useRef(false)
  const questionsRef = useRef<OralQuestion[]>([])
  const questionIndexRef = useRef(0)
  const recordsRef = useRef<ExamRecord[]>([])
  const pendingSpokenRef = useRef<SpokenKind | null>(null)
  const confirmationReminderUsedRef = useRef(false)
  const pauseGenerationRef = useRef(0)
  const studentHasSpokenRef = useRef(false)
  const lastSpeechStoppedAtRef = useRef(0)

  const currentQuestion = questions[questionIndex]

  function clearPauseTimer() {
    pauseGenerationRef.current += 1
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current)
      pauseTimerRef.current = null
    }
  }

  function changePhase(nextPhase: ExamPhase) {
    phaseRef.current = nextPhase
    setPhase(nextPhase)
  }

  function closeConnection() {
    clearPauseTimer()
    if (disconnectTimerRef.current !== null) {
      window.clearTimeout(disconnectTimerRef.current)
      disconnectTimerRef.current = null
    }
    responseActiveRef.current = false
    pendingSpokenRef.current = null
    const channel = channelRef.current
    channelRef.current = null
    channel?.close()
    const peer = peerRef.current
    peerRef.current = null
    peer?.close()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.srcObject = null
    }
    audioRef.current = null
  }

  function sendSpoken(text: string, kind: SpokenKind) {
    const channel = channelRef.current
    if (!channel || channel.readyState !== 'open') {
      throw new Error('Glasovna veza nije spremna za nastavak ispita.')
    }
    pendingSpokenRef.current = kind
    responseActiveRef.current = true
    channel.send(JSON.stringify({
      type: 'response.create',
      response: {
        conversation: 'none',
        output_modalities: ['audio'],
        metadata: { exam_kind: kind },
        instructions: `Ne odgovaraj na sadržaj i ne dodaj komentar. Izgovori prirodno na hrvatskom isključivo tekst između oznaka <govor> i </govor>, a zatim odmah prestani govoriti.\n<govor>${text}</govor>`,
      },
    }))
  }

  function askQuestion(index: number) {
    clearPauseTimer()
    questionIndexRef.current = index
    setQuestionIndex(index)
    answerSegmentsRef.current = []
    studentHasSpokenRef.current = false
    lastSpeechStoppedAtRef.current = 0
    hintUsedRef.current = false
    hintTextRef.current = ''
    setCurrentHint('')
    confirmationReminderUsedRef.current = false
    changePhase('asking')
    sendSpoken(spokenQuestion(questionsRef.current[index], index), 'question')
  }

  function giveHint(hint: string) {
    clearPauseTimer()
    hintUsedRef.current = true
    hintTextRef.current = hint
    setCurrentHint(hint)
    changePhase('feedback')
    sendSpoken(hint, 'hint')
  }

  function scheduleCompletionPause(wait = COMPLETION_PAUSE_MS) {
    clearPauseTimer()
    if (!studentHasSpokenRef.current) return
    const generation = pauseGenerationRef.current
    pauseTimerRef.current = window.setTimeout(() => {
      if (generation !== pauseGenerationRef.current || phaseRef.current !== 'answering' || responseActiveRef.current || evaluatingRef.current) return
      askForCompletion()
    }, wait)
  }

  async function considerPausedAnswer(generation: number) {
    const question = questionsRef.current[questionIndexRef.current]
    const answer = cleanAnswer(answerSegmentsRef.current.join(' '))
    if (!question || !answer || generation !== pauseGenerationRef.current || phaseRef.current !== 'answering') return
    try {
      const evaluation = await requestEvaluation(question, answer, true)
      if (generation !== pauseGenerationRef.current || phaseRef.current !== 'answering' || responseActiveRef.current) return
      if (!evaluation.complete) {
        giveHint(evaluation.hint || `Možete li odgovor povezati s pojmovima ${question.hintTerms.join(', ')}?`)
        return
      }
      const silentFor = Math.max(0, Date.now() - lastSpeechStoppedAtRef.current)
      scheduleCompletionPause(Math.max(1200, COMPLETION_PAUSE_MS - silentFor))
    } catch {
      if (generation !== pauseGenerationRef.current || phaseRef.current !== 'answering' || responseActiveRef.current) return
      giveHint(`Možete li odgovor povezati s pojmovima ${question.hintTerms.join(', ')}?`)
    }
  }

  function scheduleListeningPause() {
    clearPauseTimer()
    if (!studentHasSpokenRef.current) return
    if (hintUsedRef.current) {
      scheduleCompletionPause()
      return
    }
    const generation = pauseGenerationRef.current
    pauseTimerRef.current = window.setTimeout(() => {
      if (generation !== pauseGenerationRef.current || phaseRef.current !== 'answering' || responseActiveRef.current || evaluatingRef.current) return
      void considerPausedAnswer(generation)
    }, HELP_PAUSE_MS)
  }

  function scheduleConfirmationReminder() {
    clearPauseTimer()
    if (confirmationReminderUsedRef.current) return
    pauseTimerRef.current = window.setTimeout(() => {
      if (phaseRef.current !== 'confirming' || responseActiveRef.current) return
      confirmationReminderUsedRef.current = true
      sendSpoken('Recite da ako ste dovršili odgovor ili ne ako želite nastaviti.', 'confirmation')
    }, CONFIRMATION_REMINDER_MS)
  }

  function askForCompletion() {
    if (responseActiveRef.current || evaluatingRef.current) return
    clearPauseTimer()
    confirmationReminderUsedRef.current = false
    changePhase('confirming')
    sendSpoken('Jeste li dovršili odgovor? Recite da ili ne.', 'confirmation')
  }

  async function requestEvaluation(question: OralQuestion, answer: string, provisional = false) {
    const response = await fetch('/api/oral-exam', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode: 'answer',
        provisional,
        question: question.question,
        chapterId: question.chapterId,
        chapterTitle: question.chapterTitle,
        expectedAnswer: question.expectedAnswer,
        explanation: question.explanation,
        hintTerms: question.hintTerms,
        answer,
        hintUsed: hintUsedRef.current,
      }),
    })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload?.error || 'Odgovor nije moguće vrednovati.')
    return payload as AnswerEvaluation
  }

  async function finalizeCurrentAnswer() {
    if (evaluatingRef.current) return
    const question = questionsRef.current[questionIndexRef.current]
    const answer = cleanAnswer(answerSegmentsRef.current.join(' '))
    if (!question || !answer) {
      const hint = `Još nisam zabilježio sadržaj odgovora. Koji biste od pojmova ${question?.hintTerms.join(', ') || 'iz postavljenoga pitanja'} najprije povezali s pitanjem?`
      giveHint(hint)
      return
    }
    evaluatingRef.current = true
    clearPauseTimer()
    changePhase('evaluating')
    setError('')
    try {
      const evaluation = await requestEvaluation(question, answer)

      const record = { question, answer, hint: hintTextRef.current || undefined, evaluation }
      const nextRecords = [...recordsRef.current, record]
      recordsRef.current = nextRecords
      setRecords(nextRecords)
      evaluatingRef.current = false
      const nextIndex = questionIndexRef.current + 1
      if (nextIndex < QUESTION_COUNT) askQuestion(nextIndex)
      else void finishExam()
    } catch (evaluationError) {
      evaluatingRef.current = false
      setError(evaluationError instanceof Error ? evaluationError.message : 'Vrednovanje trenutačno nije dostupno.')
      changePhase('error')
    }
  }

  async function finishExam() {
    changePhase('finishing')
    const total = recordsRef.current.reduce((sum, record) => sum + record.evaluation.score, 0)
    const mapped = gradeFromTotal(total)
    let summary = 'Odgovori su vrednovani prema očekivanim pojmovima i obrazloženjima iz odabranih cjelina.'
    let strengths = recordsRef.current.map((record) => record.evaluation.strengths).filter(Boolean).join(' ')
    let recommendations = recordsRef.current.map((record) => record.evaluation.omissions).filter(Boolean).join(' ')
    try {
      const response = await fetch('/api/oral-exam', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'final', total, grade: mapped.grade, records: recordsRef.current }),
      })
      const payload = await response.json()
      if (response.ok) {
        summary = String(payload.summary || summary)
        strengths = String(payload.strengths || strengths)
        recommendations = String(payload.recommendations || recommendations)
      }
    } catch {
      // Pojedinačna vrednovanja i algoritamski izračun ostaju dovoljni za izvješće.
    }
    const finalResult = { total, grade: mapped.grade, gradeLabel: mapped.label, summary, strengths, recommendations }
    setFinalAssessment(finalResult)
    const spoken = `Završna provjera je dovršena. Ostvarili ste ${total} od 100 bodova. Algoritamski prijedlog ocjene je ${mapped.grade}, ${mapped.label}. ${summary} Ovaj je zaključak neobvezujuće algoritamsko mišljenje; konačnu ocjenu može donijeti samo nastavnik.`
    sendSpoken(spoken, 'final')
  }

  function handleSpokenDone(kind: SpokenKind) {
    responseActiveRef.current = false
    pendingSpokenRef.current = null
    if (kind === 'question') {
      if (phaseRef.current !== 'asking') return
      changePhase('answering')
      return
    }
    if (kind === 'hint') {
      if (phaseRef.current !== 'feedback') return
      changePhase('answering')
      scheduleListeningPause()
      return
    }
    if (kind === 'confirmation') {
      if (phaseRef.current !== 'confirming') return
      scheduleConfirmationReminder()
      return
    }
    if (kind === 'continue') {
      changePhase('answering')
      scheduleListeningPause()
      return
    }
    if (kind === 'final') {
      closeConnection()
      changePhase('complete')
    }
  }

  function handleRealtimeEvent(raw: string) {
    let event: RealtimeEvent
    try {
      event = JSON.parse(raw)
    } catch {
      return
    }
    switch (event.type) {
      case 'input_audio_buffer.speech_started':
        if (!['asking', 'answering', 'feedback', 'confirming'].includes(phaseRef.current)) break
        clearPauseTimer()
        if (responseActiveRef.current) {
          channelRef.current?.send(JSON.stringify({ type: 'response.cancel' }))
          channelRef.current?.send(JSON.stringify({ type: 'output_audio_buffer.clear' }))
          responseActiveRef.current = false
          pendingSpokenRef.current = null
        }
        if (phaseRef.current !== 'confirming') changePhase('answering')
        break
      case 'input_audio_buffer.speech_stopped':
        if (phaseRef.current === 'answering') lastSpeechStoppedAtRef.current = Date.now()
        break
      case 'conversation.item.input_audio_transcription.completed': {
        if (!['asking', 'answering', 'feedback', 'confirming'].includes(phaseRef.current)) break
        const rawTranscript = String(event.transcript || '')
        if (phaseRef.current === 'confirming') {
          clearPauseTimer()
          if (isNegative(rawTranscript)) {
            changePhase('answering')
            sendSpoken('U redu, slušam.', 'continue')
            break
          }
          if (isAffirmative(rawTranscript)) {
            void finalizeCurrentAnswer()
            break
          }
          sendSpoken('Nisam razumio potvrdu. Jeste li dovršili odgovor? Recite da ili ne.', 'confirmation')
          break
        }
        const segment = cleanAnswer(rawTranscript)
        if (segment) {
          answerSegmentsRef.current.push(segment)
          studentHasSpokenRef.current = true
          if (!lastSpeechStoppedAtRef.current) lastSpeechStoppedAtRef.current = Date.now()
        }
        changePhase('answering')
        scheduleListeningPause()
        break
      }
      case 'response.created':
        responseActiveRef.current = true
        break
      case 'response.done': {
        const kind = event.response?.metadata?.exam_kind || pendingSpokenRef.current
        if (event.response?.status === 'incomplete' && event.response.status_details?.reason === 'max_output_tokens' && kind) {
          setError('Govorni izlaz nije dovršen. Možete nastaviti ispit ponovnim pokretanjem.')
          changePhase('error')
          return
        }
        if (event.response?.status && event.response.status !== 'completed') {
          responseActiveRef.current = false
          pendingSpokenRef.current = null
          return
        }
        if (kind) handleSpokenDone(kind)
        break
      }
      case 'error':
        setError(event.error?.message || 'Došlo je do pogreške u glasovnoj sesiji.')
        changePhase('error')
        break
    }
  }

  async function startExam() {
    if (phase !== 'intro' && phase !== 'complete' && phase !== 'error') return
    closeConnection()
    const selected = selectQuestions()
    if (selected.length !== QUESTION_COUNT) {
      setError('U prethodnim cjelinama nema dovoljno pitanja za završnu provjeru.')
      changePhase('error')
      return
    }
    questionsRef.current = selected
    questionIndexRef.current = 0
    recordsRef.current = []
    answerSegmentsRef.current = []
    studentHasSpokenRef.current = false
    lastSpeechStoppedAtRef.current = 0
    hintUsedRef.current = false
    confirmationReminderUsedRef.current = false
    setQuestions(selected)
    setQuestionIndex(0)
    setRecords([])
    setCurrentHint('')
    setFinalAssessment(null)
    setError('')
    changePhase('connecting')

    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
        throw new Error('Ovaj preglednik ne podržava izravnu usmenu završnu provjeru.')
      }
      const peer = new RTCPeerConnection()
      peerRef.current = peer
      const audio = document.createElement('audio')
      audio.autoplay = true
      audio.setAttribute('playsinline', '')
      audioRef.current = audio
      peer.ontrack = (event) => {
        audio.srcObject = event.streams[0] ?? new MediaStream([event.track])
        void audio.play().catch(() => undefined)
      }
      peer.onconnectionstatechange = () => {
        if (peerRef.current !== peer) return
        if (peer.connectionState === 'connected' && disconnectTimerRef.current !== null) {
          window.clearTimeout(disconnectTimerRef.current)
          disconnectTimerRef.current = null
        }
        if (peer.connectionState === 'disconnected' && disconnectTimerRef.current === null) {
          disconnectTimerRef.current = window.setTimeout(() => {
            disconnectTimerRef.current = null
            if (peerRef.current === peer && peer.connectionState === 'disconnected') {
              setError('Glasovna veza nije se uspjela obnoviti. Ponovno pokrenite završnu provjeru.')
              changePhase('error')
              closeConnection()
            }
          }, 8000)
        }
        if (peer.connectionState === 'failed') {
          setError('Glasovna veza je prekinuta. Ponovno pokrenite završnu provjeru.')
          changePhase('error')
          closeConnection()
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
      streamRef.current = stream
      stream.getTracks().forEach((track) => peer.addTrack(track, stream))
      const channel = peer.createDataChannel('oai-events')
      channelRef.current = channel
      channel.onmessage = (event) => handleRealtimeEvent(event.data)
      channel.onerror = () => setError('Pojavila se poteškoća u vezi, ali ispit pokušava ostati aktivan.')
      channel.onclose = () => {
        if (channelRef.current === channel && phaseRef.current !== 'complete') {
          setError('Veza s AI ispitivačem je zatvorena.')
          changePhase('error')
        }
      }

      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      if (!offer.sdp) throw new Error('Preglednik nije stvorio valjanu glasovnu vezu.')
      const context = 'Glasovni kanal završne provjere služi samo izgovoru pojedinačnih rečenica koje mu šalje upravljačka aplikacija.'
      const response = await fetch('/api/realtime-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sdp: offer.sdp, context, scopeLabel: 'Završna provjera · pet pitanja', examMode: true }),
      })
      if (!response.ok) {
        const raw = await response.text()
        let message = 'Završnu glasovnu provjeru trenutačno nije moguće pokrenuti.'
        try {
          const payload = JSON.parse(raw)
          if (typeof payload?.error === 'string') message = payload.error
        } catch {
          if (raw.trim()) message = raw.replace(/\s+/g, ' ').slice(0, 180)
        }
        throw new Error(message)
      }
      await peer.setRemoteDescription({ type: 'answer', sdp: await response.text() })
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error('Podatkovni kanal glasovne provjere nije se otvorio na vrijeme.')), 10000)
        if (channel.readyState === 'open') {
          window.clearTimeout(timer)
          resolve()
          return
        }
        channel.addEventListener('open', () => { window.clearTimeout(timer); resolve() }, { once: true })
      })
      askQuestion(0)
    } catch (startError) {
      closeConnection()
      setError(startError instanceof Error ? startError.message : 'Završnu provjeru nije bilo moguće pokrenuti.')
      changePhase('error')
    }
  }

  function stopExam() {
    closeConnection()
    changePhase('intro')
    setQuestions([])
    setRecords([])
    setFinalAssessment(null)
    setCurrentHint('')
    setError('')
  }

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => () => closeConnection(), [])

  const active = !['intro', 'complete', 'error'].includes(phase)
  const showQuestion = Boolean(currentQuestion) && !['intro', 'connecting', 'finishing', 'complete', 'error'].includes(phase)

  return <>
    <section className="final-exam" aria-labelledby="final-exam-title">
      <header className="final-exam-heading">
        <div><span className="eyebrow">ZAVRŠNI USMENI RAZGOVOR</span><h2 id="final-exam-title">Pet pitanja, jedno po jedno</h2><p>Odgovorite svojim riječima. Ako zastanete, dobit ćete pomoć. Novo pitanje slijedi tek kada potvrdite da ste završili odgovor.</p></div>
      </header>

      {phase === 'intro' && <div className="exam-start"><div className="exam-start-icon"><Mic /></div><div><h3>Spremni?</h3><p>Poslušajte pitanje, odgovorite i na kraju potvrdite je li odgovor dovršen.</p></div><button type="button" className="primary-button" onClick={() => void startExam()}><Mic /> Pokreni razgovor</button></div>}

      {active && <div className="exam-simple-session" aria-live="polite"><span><Mic />{phase === 'connecting' ? 'Pripremam prvo pitanje…' : phase === 'finishing' ? 'Pripremam završni osvrt…' : 'Usmeni razgovor je u tijeku'}</span><button type="button" onClick={stopExam}><Square /> Prekini</button></div>}

      {error && <div className="exam-error"><LockKeyhole /><span><strong>Provjera nije dovršena.</strong>{error}</span><button type="button" onClick={() => void startExam()}><RotateCcw /> Pokušaj ponovno</button></div>}

      {phase === 'complete' && finalAssessment && <ExamReport records={records} assessment={finalAssessment} onRestart={() => void startExam()} />}

      <p className="exam-privacy"><LockKeyhole /> Zapis razgovora ostaje skriven do završnoga osvrta i ne sprema se na poslužitelj.</p>
    </section>

    {showQuestion && currentQuestion && <QuestionPopup question={currentQuestion} index={questionIndex} hint={currentHint} phase={phase} />}
  </>
}

function QuestionPopup({ question, index, hint, phase }: { question: OralQuestion; index: number; hint: string; phase: ExamPhase }) {
  return createPortal(<div className="exam-question-layer"><aside className="exam-question-popup" role="dialog" aria-live="polite" aria-label={`Pitanje ${index + 1} od ${QUESTION_COUNT}`}>
    <div><span>PITANJE {index + 1} OD {QUESTION_COUNT}</span><small>Cjelina {question.chapterId}</small></div>
    <p>{question.question}</p>
    {hint && <div className="exam-popup-hint"><Sparkles /><span><strong>Pomoć</strong>{hint}</span></div>}
    {phase === 'confirming' && <div className="exam-popup-confirmation"><CheckCircle2 /><span><strong>Jeste li dovršili odgovor?</strong>Recite „da” ili „ne”.</span></div>}
    <footer><Mic />{phase === 'asking' ? 'Poslušajte pitanje' : phase === 'evaluating' ? 'Provjeravam odgovor…' : phase === 'confirming' ? 'Čekam Vašu potvrdu' : 'Odgovorite usmeno'}</footer>
  </aside></div>, document.body)
}

function ExamReport({ records, assessment, onRestart }: { records: ExamRecord[]; assessment: FinalAssessment; onRestart: () => void }) {
  return <section className="exam-report" aria-labelledby="exam-report-title">
    <div className="exam-result-hero"><div><span className="eyebrow">ZAVRŠNI ALGORITAMSKI SUD</span><h3 id="exam-report-title">Prijedlog ocjene: {assessment.grade} ({assessment.gradeLabel})</h3><p>{assessment.summary}</p></div><div className="exam-total"><strong>{assessment.total}</strong><span>/ 100 bodova</span></div></div>
    <div className="exam-final-notes"><article><CheckCircle2 /><span><strong>Uočene snage</strong>{assessment.strengths}</span></article><article><BookOpen /><span><strong>Preporuka za učenje</strong>{assessment.recommendations}</span></article></div>
    <div className="exam-disclaimer"><LockKeyhole /><p><strong>Važna napomena o ocjeni</strong>Ovo je algoritamski zaključak i neobvezujuće mišljenje u simulaciji hipotetičkoga ispita. Ne obuhvaća sve sadržajne, argumentacijske, komunikacijske i situacijske elemente odgovora. Njih može cjelovito prosuditi jedino nastavnik, koji samostalno donosi konačnu ocjenu.</p></div>
    <div className="exam-transcript"><div className="section-heading"><span className="eyebrow">ZAPISNIK ZAVRŠNOGA RAZGOVORA</span><h3>Transkript i podloga vrednovanja</h3><p>Zapisnik je tijekom razgovora bio skriven. Sada prikazuje svih pet pitanja, odgovore, eventualnu pomoć i pojedinačna obrazloženja.</p></div>{records.map((record, index) => <article key={record.question.id}><header><span>{index + 1}</span><div><small>Cjelina {record.question.chapterId}</small><h4>{record.question.question}</h4></div><strong>{record.evaluation.score} / 20</strong></header><dl><div><dt>Odgovor studenta</dt><dd>{record.answer}</dd></div>{record.hint && <div className="transcript-hint"><dt>Sugestivna pomoć</dt><dd>{record.hint}</dd></div>}<div><dt>Vrednovanje</dt><dd>{record.evaluation.feedback}</dd></div><div><dt>Uočene praznine</dt><dd>{record.evaluation.omissions || 'Nisu utvrđene bitne praznine u odnosu na očekivanu osnovu.'}</dd></div></dl></article>)}</div>
    <button type="button" className="primary-button exam-restart" onClick={onRestart}><RotateCcw /> Nova nasumična provjera</button>
  </section>
}

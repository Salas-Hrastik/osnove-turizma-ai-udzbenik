import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, CheckCircle2, LockKeyhole, Mic, RotateCcw, Sparkles, Square } from 'lucide-react'
import { chapterContents } from './data/book'
import type { ChapterContent } from './types'

const QUESTION_COUNT = 5
const FINAL_AUDIO_DRAIN_MS = 30000

type ExamStatus = 'idle' | 'connecting' | 'ready' | 'listening' | 'thinking' | 'speaking' | 'completed' | 'error'
type JsonRecord = Record<string, unknown>
type PendingResponse = 'continue-exam' | 'finish-exam' | 'final-spoken-summary'

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
  strengths: string
  omissions: string
  feedback: string
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

const STATUS_TEXT: Record<ExamStatus, string> = {
  idle: 'Završni razgovor još nije pokrenut',
  connecting: 'Povezujem mikrofon i pripremam profesora…',
  ready: 'AI profesor čeka Vaš odgovor',
  listening: 'Slušam Vaš odgovor…',
  thinking: 'Profesor prati odgovor i priprema nastavak…',
  speaking: 'AI profesor govori…',
  completed: 'Završni razgovor je dovršen',
  error: 'Razgovor je prekinut zbog pogreške',
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

export function FinalOralExam() {
  const [status, setStatus] = useState<ExamStatus>('idle')
  const [questions, setQuestions] = useState<OralQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [records, setRecords] = useState<ExamRecord[]>([])
  const [assistantText, setAssistantText] = useState('')
  const [professorPrompt, setProfessorPrompt] = useState('')
  const [error, setError] = useState('')
  const [finalAssessment, setFinalAssessment] = useState<FinalAssessment | null>(null)

  const peerRef = useRef<RTCPeerConnection | null>(null)
  const channelRef = useRef<RTCDataChannel | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const disconnectTimerRef = useRef<number | null>(null)
  const finalAudioTimerRef = useRef<number | null>(null)
  const questionsRef = useRef<OralQuestion[]>([])
  const recordsRef = useRef<ExamRecord[]>([])
  const assistantTextRef = useRef('')
  const completionRef = useRef(false)
  const pendingResponseRef = useRef<PendingResponse | null>(null)
  const awaitingFinishResponseRef = useRef(false)

  const currentQuestion = questions[questionIndex]
  const progress = Math.min(QUESTION_COUNT, records.length)
  const active = ['connecting', 'ready', 'listening', 'thinking', 'speaking'].includes(status)
  const showQuestion = Boolean(currentQuestion) && !['idle', 'connecting', 'completed', 'error'].includes(status)

  function closeConnection() {
    if (disconnectTimerRef.current !== null) {
      window.clearTimeout(disconnectTimerRef.current)
      disconnectTimerRef.current = null
    }
    if (finalAudioTimerRef.current !== null) {
      window.clearTimeout(finalAudioTimerRef.current)
      finalAudioTimerRef.current = null
    }
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

  function send(channel: RTCDataChannel, payload: JsonRecord) {
    if (channel.readyState === 'open') channel.send(JSON.stringify(payload))
  }

  function answerTool(channel: RTCDataChannel, callId: string, output: JsonRecord, nextResponse: PendingResponse) {
    send(channel, {
      type: 'conversation.item.create',
      item: { type: 'function_call_output', call_id: callId, output: JSON.stringify(output) },
    })
    pendingResponseRef.current = nextResponse
  }

  function createPendingResponse(channel: RTCDataChannel, pending: PendingResponse) {
    if (pending === 'continue-exam') {
      send(channel, { type: 'response.create' })
      return
    }
    if (pending === 'finish-exam') {
      awaitingFinishResponseRef.current = true
      send(channel, {
        type: 'response.create',
        response: {
          tool_choice: { type: 'function', name: 'finish_exam' },
          instructions: 'Svih pet odgovora je spremljeno. Sada obvezno pozovi finish_exam i ne stvaraj novo pitanje.',
        },
      })
      return
    }
    send(channel, {
      type: 'response.create',
      response: {
        tool_choice: 'none',
        instructions: 'Izgovori kratak završni osvrt, aproksimativnu ocjenu i jednu preporuku. Ponovi da konačnu ocjenu donosi nastavnik.',
      },
    })
  }

  function completeWithRecordedAssessment() {
    if (!completionRef.current) setFinalAssessment(buildFinalAssessment(recordsRef.current))
    completionRef.current = true
    awaitingFinishResponseRef.current = false
    setStatus('completed')
    window.setTimeout(closeConnection, 250)
  }

  function completeAfterFinalNarration() {
    completionRef.current = true
    awaitingFinishResponseRef.current = false
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = false
    })
    setStatus('completed')
    if (finalAudioTimerRef.current !== null) window.clearTimeout(finalAudioTimerRef.current)
    finalAudioTimerRef.current = window.setTimeout(() => {
      finalAudioTimerRef.current = null
      closeConnection()
    }, FINAL_AUDIO_DRAIN_MS)
  }

  function handleTool(event: JsonRecord, channel: RTCDataChannel) {
    if (typeof event.call_id !== 'string' || typeof event.name !== 'string') return
    setStatus('thinking')
    const args = readArguments(event.arguments)

    if (event.name === 'record_exam_iteration') {
      const iteration = numberValue(args.iteration)
      const sourceQuestion = questionsRef.current[iteration - 1]
      if (!Number.isInteger(iteration) || iteration < 1 || iteration > QUESTION_COUNT || !sourceQuestion) {
        answerTool(channel, event.call_id, { recorded: false, error: 'Nevaljana ispitna iteracija.' }, 'continue-exam')
        return
      }
      const existingIteration = recordsRef.current[iteration - 1]
      if (!existingIteration && iteration !== recordsRef.current.length + 1) {
        answerTool(channel, event.call_id, { recorded: false, error: 'Pitanja treba dovršavati zadanim redoslijedom.' }, 'continue-exam')
        return
      }
      const item: ExamRecord = {
        question: sourceQuestion,
        answer: stringValue(args.answer_summary) || 'Odgovor nije dovoljno jasno zabilježen.',
        hint: stringValue(args.help_given) || undefined,
        evaluation: {
          score: Math.max(0, Math.min(20, Math.round(numberValue(args.score)))),
          strengths: stringValue(args.strengths),
          omissions: stringValue(args.omissions),
          feedback: stringValue(args.feedback),
        },
      }
      const updated = [...recordsRef.current.filter((_, index) => index !== iteration - 1)]
      updated[iteration - 1] = item
      const compact = updated.filter(Boolean).slice(0, QUESTION_COUNT)
      recordsRef.current = compact
      setRecords(compact)
      setQuestionIndex(Math.min(compact.length, QUESTION_COUNT - 1))
      setProfessorPrompt('')
      answerTool(
        channel,
        event.call_id,
        { recorded: true, completed: compact.length, remaining: QUESTION_COUNT - compact.length },
        compact.length === QUESTION_COUNT ? 'finish-exam' : 'continue-exam',
      )
      return
    }

    if (event.name === 'finish_exam') {
      if (recordsRef.current.length !== QUESTION_COUNT) {
        answerTool(channel, event.call_id, { completed: false, error: 'Najprije treba dovršiti svih pet pitanja.' }, 'continue-exam')
        return
      }
      const result = buildFinalAssessment(recordsRef.current, args)
      setFinalAssessment(result)
      completionRef.current = true
      awaitingFinishResponseRef.current = false
      answerTool(channel, event.call_id, {
        completed: true,
        total: result.total,
        approximate_grade: result.grade,
        reminder: 'Ocjena je samo neobvezujuće algoritamsko mišljenje; konačnu ocjenu donosi nastavnik.',
      }, 'final-spoken-summary')
    }
  }

  function handleRealtimeEvent(raw: unknown, channel: RTCDataChannel) {
    if (typeof raw !== 'string') return
    let event: JsonRecord
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!isRecord(parsed) || typeof parsed.type !== 'string') return
      event = parsed
    } catch {
      return
    }

    switch (event.type) {
      case 'input_audio_buffer.speech_started':
        setStatus('listening')
        setError('')
        setProfessorPrompt('')
        break
      case 'input_audio_buffer.speech_stopped':
      case 'input_audio_buffer.timeout_triggered':
      case 'response.created':
        setStatus('thinking')
        break
      case 'response.output_audio.delta':
      case 'response.audio.delta':
        setStatus('speaking')
        break
      case 'response.output_audio_transcript.delta':
      case 'response.audio_transcript.delta':
        if (typeof event.delta === 'string') {
          assistantTextRef.current += event.delta
          setAssistantText(assistantTextRef.current)
        }
        break
      case 'response.function_call_arguments.done':
        handleTool(event, channel)
        break
      case 'response.done': {
        const spoken = assistantTextRef.current.trim()
        assistantTextRef.current = ''
        setAssistantText('')
        if (spoken && !containsMainQuestion(spoken, questionsRef.current)) setProfessorPrompt(spoken)
        else if (containsMainQuestion(spoken, questionsRef.current)) setProfessorPrompt('')
        const pending = pendingResponseRef.current
        if (pending) {
          pendingResponseRef.current = null
          setStatus('thinking')
          createPendingResponse(channel, pending)
          break
        }
        if (awaitingFinishResponseRef.current && recordsRef.current.length === QUESTION_COUNT) {
          completeWithRecordedAssessment()
          break
        }
        if (completionRef.current) {
          completeAfterFinalNarration()
        } else {
          setStatus('ready')
        }
        break
      }
      case 'error':
        if (recordsRef.current.length === QUESTION_COUNT) {
          completeWithRecordedAssessment()
          break
        }
        setError(readError(event))
        setStatus('error')
        break
    }
  }

  async function startExam() {
    if (!['idle', 'completed', 'error'].includes(status)) return
    closeConnection()
    const selected = selectQuestions()
    if (selected.length !== QUESTION_COUNT) {
      setError('U prethodnim cjelinama nema dovoljno pitanja za završnu provjeru.')
      setStatus('error')
      return
    }
    questionsRef.current = selected
    recordsRef.current = []
    assistantTextRef.current = ''
    completionRef.current = false
    pendingResponseRef.current = null
    awaitingFinishResponseRef.current = false
    setQuestions(selected)
    setQuestionIndex(0)
    setRecords([])
    setAssistantText('')
    setProfessorPrompt('')
    setFinalAssessment(null)
    setError('')
    setStatus('connecting')

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
              setError('Glasovna veza nije se uspjela obnoviti. Ponovno pokrenite završni razgovor.')
              setStatus('error')
              closeConnection()
            }
          }, 8000)
        }
        if (peer.connectionState === 'failed') {
          setError('Glasovna veza je prekinuta. Ponovno pokrenite završni razgovor.')
          setStatus('error')
          closeConnection()
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      streamRef.current = stream
      stream.getTracks().forEach((track) => peer.addTrack(track, stream))

      const channel = peer.createDataChannel('oai-events')
      channelRef.current = channel
      channel.onopen = () => {
        setStatus('ready')
        send(channel, { type: 'response.create' })
      }
      channel.onmessage = (event) => handleRealtimeEvent(event.data, channel)
      channel.onerror = () => {
        setError('Veza s AI profesorom je prekinuta.')
        setStatus('error')
      }
      channel.onclose = () => {
        if (channelRef.current === channel) channelRef.current = null
        if (!completionRef.current && peerRef.current) {
          setError('Veza s AI profesorom je zatvorena.')
          setStatus('error')
        }
      }

      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      if (!offer.sdp) throw new Error('Preglednik nije stvorio valjanu glasovnu vezu.')

      const response = await fetch('/api/final-exam-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sdp: offer.sdp, questions: selected }),
      })
      if (!response.ok) {
        const raw = await response.text()
        let message = 'Završni glasovni razgovor trenutačno nije moguće pokrenuti.'
        try {
          const payload: unknown = JSON.parse(raw)
          if (isRecord(payload) && typeof payload.error === 'string') {
            message = payload.error
            if (typeof payload.detail === 'string' && payload.detail.trim()) message += ` ${payload.detail}`
          }
        } catch {
          if (raw.trim()) message = raw.replace(/\s+/g, ' ').slice(0, 180)
        }
        throw new Error(message)
      }
      await peer.setRemoteDescription({ type: 'answer', sdp: await response.text() })
    } catch (caught) {
      closeConnection()
      setError(caught instanceof Error ? caught.message : 'Završni razgovor nije bilo moguće pokrenuti.')
      setStatus('error')
    }
  }

  function stopExam() {
    completionRef.current = true
    closeConnection()
    setStatus('idle')
    setQuestions([])
    setQuestionIndex(0)
    setRecords([])
    setAssistantText('')
    setProfessorPrompt('')
    setFinalAssessment(null)
    setError('')
  }

  useEffect(() => () => closeConnection(), [])

  return <>
    <section className="final-exam" aria-labelledby="final-exam-title">
      <header className="final-exam-heading">
        <div><span className="eyebrow">ZAVRŠNI USMENI RAZGOVOR</span><h2 id="final-exam-title">Pet pitanja, jedno po jedno</h2><p>AI profesor postavlja pitanje, sluša odgovor i uključuje se tek kada procijeni da je pomoć korisna ili da je nastala dulja stanka.</p></div>
      </header>

      {status === 'idle' && <div className="exam-start"><div className="exam-start-icon"><Mic /></div><div><h3>Spremni?</h3><p>Odgovarajte prirodno. Profesor će voditi razgovor kao u usmenoj ispitnoj situaciji.</p></div><button type="button" className="primary-button" onClick={() => void startExam()}><Mic /> Pokreni razgovor</button></div>}

      {active && <div className="exam-simple-session" aria-live="polite"><span><Mic />{STATUS_TEXT[status]} · {progress}/{QUESTION_COUNT} dovršeno</span><button type="button" onClick={stopExam}><Square /> Prekini</button></div>}

      {error && <div className="exam-error"><LockKeyhole /><span><strong>Provjera nije dovršena.</strong>{error}</span><button type="button" onClick={() => void startExam()}><RotateCcw /> Pokušaj ponovno</button></div>}

      {status === 'completed' && finalAssessment && <ExamReport records={records} assessment={finalAssessment} onRestart={() => void startExam()} />}

      <p className="exam-privacy"><LockKeyhole /> Zvuk se ne pohranjuje. Tijekom razgovora skriven je zapisnik; prikazuje se tek u završnom osvrtu.</p>
    </section>

    {showQuestion && currentQuestion && <QuestionPopup question={currentQuestion} index={questionIndex} status={status} professorText={assistantText || professorPrompt} />}
  </>
}

function QuestionPopup({ question, index, status, professorText }: { question: OralQuestion; index: number; status: ExamStatus; professorText: string }) {
  return createPortal(<div className="exam-question-layer"><aside className="exam-question-popup" role="dialog" aria-live="polite" aria-label={`Pitanje ${index + 1} od ${QUESTION_COUNT}`}>
    <div><span>PITANJE {index + 1} OD {QUESTION_COUNT}</span><small>Cjelina {question.chapterId} · {question.chapterTitle}</small></div>
    <p>{question.question}</p>
    {professorText && <div className="exam-popup-hint"><Sparkles /><span><strong>AI profesor</strong>{professorText}</span></div>}
    <footer><Mic />{status === 'listening' ? 'Slušam Vaš odgovor' : status === 'thinking' ? 'Pratim odgovor…' : status === 'speaking' ? 'AI profesor govori' : 'Odgovorite usmeno'}</footer>
  </aside></div>, document.body)
}

function ExamReport({ records, assessment, onRestart }: { records: ExamRecord[]; assessment: FinalAssessment; onRestart: () => void }) {
  return <section className="exam-report" aria-labelledby="exam-report-title">
    <div className="exam-result-hero"><div><span className="eyebrow">ZAVRŠNI ALGORITAMSKI SUD</span><h3 id="exam-report-title">Prijedlog ocjene: {assessment.grade} ({assessment.gradeLabel})</h3><p>{assessment.summary}</p></div><div className="exam-total"><strong>{assessment.total}</strong><span>/ 100 bodova</span></div></div>
    <div className="exam-final-notes"><article><CheckCircle2 /><span><strong>Uočene snage</strong>{assessment.strengths}</span></article><article><BookOpen /><span><strong>Preporuka za učenje</strong>{assessment.recommendations}</span></article></div>
    <div className="exam-disclaimer"><LockKeyhole /><p><strong>Važna napomena o ocjeni</strong>Ovo je algoritamski zaključak i neobvezujuće mišljenje u simulaciji hipotetičkoga ispita. Konačnu ocjenu samostalno donosi nastavnik.</p></div>
    <div className="exam-transcript"><div className="section-heading"><span className="eyebrow">ZAPISNIK ZAVRŠNOGA RAZGOVORA</span><h3>Sažetak i podloga vrednovanja</h3><p>Zapisnik je tijekom razgovora bio skriven. Sada prikazuje svih pet pitanja, sažetke odgovora, eventualnu pomoć i pojedinačna obrazloženja.</p></div>{records.map((record, index) => <article key={record.question.id}><header><span>{index + 1}</span><div><small>Cjelina {record.question.chapterId}</small><h4>{record.question.question}</h4></div><strong>{record.evaluation.score} / 20</strong></header><dl><div><dt>Sažetak odgovora</dt><dd>{record.answer}</dd></div>{record.hint && <div className="transcript-hint"><dt>Pružena pomoć</dt><dd>{record.hint}</dd></div>}<div><dt>Vrednovanje</dt><dd>{record.evaluation.feedback}</dd></div><div><dt>Uočene praznine</dt><dd>{record.evaluation.omissions || 'Nisu utvrđene bitne praznine u odnosu na očekivanu osnovu.'}</dd></div></dl></article>)}</div>
    <button type="button" className="primary-button exam-restart" onClick={onRestart}><RotateCcw /> Nova nasumična provjera</button>
  </section>
}

function buildFinalAssessment(records: ExamRecord[], args: JsonRecord = {}): FinalAssessment {
  const total = records.reduce((sum, record) => sum + record.evaluation.score, 0)
  const mapped = gradeFromTotal(total)
  const recordedStrengths = distinctText(records.map((record) => record.evaluation.strengths)).slice(0, 3).join(' ')
  const recordedRecommendations = distinctText(records.map((record) => record.evaluation.omissions || record.evaluation.feedback)).slice(0, 3).join(' ')
  return {
    total,
    grade: mapped.grade,
    gradeLabel: mapped.label,
    summary: stringValue(args.overall_assessment) || `Procjena je izvedena iz svih pet odgovora. Ostvareno je ${total} od 100 bodova, što odgovara neobvezujućem prijedlogu ocjene ${mapped.grade} (${mapped.label}).`,
    strengths: stringValue(args.main_strengths) || recordedStrengths || 'Odgovori su dovršeni i mogu poslužiti kao podloga za daljnje ciljano učenje.',
    recommendations: stringValue(args.recommendations) || recordedRecommendations || 'Nastavite povezivati temeljne pojmove iz različitih cjelina i obrazlagati ih vlastitim primjerima.',
  }
}

function distinctText(values: string[]) {
  const seen = new Set<string>()
  return values.map((value) => value.trim()).filter((value) => {
    const normalized = value.toLocaleLowerCase('hr-HR')
    if (!value || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function readArguments(value: unknown): JsonRecord {
  if (typeof value !== 'string') return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeText(value: string) {
  return value.toLocaleLowerCase('hr-HR').replace(/[^a-zčćđšž0-9]+/giu, ' ').replace(/\s+/g, ' ').trim()
}

function containsMainQuestion(spoken: string, questions: OralQuestion[]) {
  const normalizedSpoken = normalizeText(spoken)
  return questions.some((question) => {
    const normalizedQuestion = normalizeText(question.question)
    return normalizedQuestion.length > 24 && normalizedSpoken.includes(normalizedQuestion)
  })
}

function readError(event: JsonRecord) {
  const nested = event.error
  return isRecord(nested) && typeof nested.message === 'string' ? nested.message : 'Došlo je do pogreške u glasovnom razgovoru.'
}

import { useMemo, useState } from 'react'
import { BookOpen, Bot, ChevronLeft, ChevronRight, CircleHelp, Headphones, Menu, MessageCircle, PlayCircle, RotateCcw, Sparkles, X } from 'lucide-react'
import { book, chapters, pilot } from './data/book'
import type { Mode } from './types'

const modes: Array<{ name: Mode; icon: typeof MessageCircle }> = [
  { name: 'Razgovaraj', icon: MessageCircle },
  { name: 'Prouči', icon: BookOpen },
  { name: 'Gledaj i slušaj', icon: Headphones },
  { name: 'Vježbaj', icon: RotateCcw },
  { name: 'Provjeri', icon: CircleHelp },
]

function App() {
  const [chapterId, setChapterId] = useState(1)
  const [mode, setMode] = useState<Mode>('Prouči')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0]
  const isPilot = chapterId === 1

  const selectChapter = (id: number) => {
    setChapterId(id)
    setMode('Prouči')
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Otvori sadržaj"><Menu /></button>
        <div className="brand-mark"><BookOpen /></div>
        <div className="brand-copy">
          <span className="eyebrow">AI UDŽBENIK</span>
          <strong>{book.title}</strong>
        </div>
        <div className="source-badge"><span>Kanonski izvor</span><strong>v{book.canonicalVersion}</strong></div>
      </header>

      <div className="workspace">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div><span className="eyebrow">SADRŽAJ</span><h2>Nastavne cjeline</h2></div>
            <button className="icon-button mobile-only" onClick={() => setSidebarOpen(false)} aria-label="Zatvori sadržaj"><X /></button>
          </div>
          <nav aria-label="Nastavne cjeline">
            {chapters.map((item) => (
              <button key={item.id} className={`chapter-link ${item.id === chapterId ? 'active' : ''}`} onClick={() => selectChapter(item.id)}>
                <span className="chapter-number">{item.id}</span>
                <span><strong>{item.title}</strong><small>{item.status === 'pilot' ? 'Pilot dostupan' : item.status === 'assessment' ? 'Završna provjera' : `Str. ${item.pages}`}</small></span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer"><span>Autor</span><strong>{book.author}</strong><small>{book.publisher}</small></div>
        </aside>
        {sidebarOpen && <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Zatvori izbornik" />}

        <main className="main-panel">
          <section className="chapter-hero">
            <div>
              <span className="eyebrow">CJELINA {chapter.id} · {chapter.status === 'assessment' ? chapter.pages : `STRANICE ${chapter.pages}`}</span>
              <h1>{chapter.title}</h1>
              <p>{chapter.outcome}</p>
            </div>
            <button className="summary-button" onClick={() => setSummaryOpen(true)}><Sparkles /> Sažetak cjeline</button>
          </section>

          <nav className="mode-tabs" aria-label="Načini rada">
            {modes.map(({ name, icon: Icon }) => (
              <button key={name} className={mode === name ? 'active' : ''} onClick={() => setMode(name)} disabled={!isPilot && name !== 'Prouči'}>
                <Icon /><span>{name}</span>
              </button>
            ))}
          </nav>

          <div className="content-grid">
            <section className="learning-area">
              {!isPilot ? <PlannedChapter title={chapter.title} outcome={chapter.outcome} /> : <PilotMode mode={mode} />}
            </section>
            <aside className="guide-card">
              <div className="guide-avatar"><Bot /></div>
              <span className="eyebrow">STALNI VODIČ</span>
              <h3>Kako učiti ovu cjelinu?</h3>
              <p>{guideText(mode, isPilot)}</p>
              <div className="guide-source"><BookOpen /><span><strong>Izvor odgovora</strong>Kanonski tekst 1.0</span></div>
            </aside>
          </div>

          <div className="chapter-pager">
            <button disabled={chapterId === 1} onClick={() => selectChapter(chapterId - 1)}><ChevronLeft /> Prethodna</button>
            <span>{chapterId} / {chapters.length}</span>
            <button disabled={chapterId === chapters.length} onClick={() => selectChapter(chapterId + 1)}>Sljedeća <ChevronRight /></button>
          </div>
        </main>
      </div>

      {summaryOpen && <SummaryModal isPilot={isPilot} title={chapter.title} summary={isPilot ? pilot.summary : chapter.outcome} onClose={() => setSummaryOpen(false)} />}
    </div>
  )
}

function PilotMode({ mode }: { mode: Mode }) {
  if (mode === 'Prouči') return <Study />
  if (mode === 'Vježbaj') return <Flashcards />
  if (mode === 'Provjeri') return <Quiz />
  if (mode === 'Razgovaraj') return <ComingSoon icon={<MessageCircle />} title="Razgovor prema provjerenim izvorima" text="Sučelje je pripremljeno, ali AI usluga još nije povezana. Razgovor će se aktivirati tek kada budu potvrđeni model, registar izvora i pravila citiranja." />
  return <ComingSoon icon={<PlayCircle />} title="Multimedijski sadržaji u pripremi" text="Mjesta za audio, video i prezentaciju postoje u sadržajnoj shemi. Mediji će se dodati u zasebno spremište tek nakon uredničke provjere." />
}

function Study() {
  return <>
    <div className="section-heading"><span className="eyebrow">PROUČI</span><h2>Četiri koraka do razumijevanja</h2><p>{pilot.summary}</p></div>
    <div className="steps">
      {pilot.steps.map((step, index) => <article className="step-card" key={step.title}>
        <span className="step-index">{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p><small>{step.source}</small></div>
      </article>)}
    </div>
    <div className="editorial-note"><Sparkles /><div><span className="eyebrow">NAPOMENA O IZVORU</span><h3>Kanonski sadržaj ostaje zaključan</h3><p>Statistički podaci mogu se poslije aktualizirati samo kao jasno označen urednički sloj s datumom provjere i službenim izvorom.</p></div></div>
  </>
}

function Flashcards() {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (index: number) => setOpen((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])
  return <>
    <div className="section-heading"><span className="eyebrow">VJEŽBAJ · 10 KARTICA</span><h2>Ključni pojmovi</h2><p>Svi pojmovi ostaju istodobno dostupni. Otvorite karticu za definiciju.</p></div>
    <div className="flashcard-grid">{pilot.keywords.map((card, index) => <button className={`flashcard ${open.includes(index) ? 'open' : ''}`} key={card.term} onClick={() => toggle(index)} aria-expanded={open.includes(index)}><span>{index + 1}</span><strong>{card.term}</strong><p>{open.includes(index) ? card.definition : 'Kliknite za definiciju'}</p></button>)}</div>
  </>
}

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = useMemo(() => pilot.questions.filter((q, i) => answers[i] === q.correct).length, [answers])
  const reset = () => { setAnswers({}); setSubmitted(false) }
  return <>
    <div className="section-heading"><span className="eyebrow">PROVJERI · 5 PITANJA</span><h2>Samoprovjera cjeline</h2><p>Odaberite odgovor na svako pitanje. Nakon predaje dobit ćete objašnjenje, ne samo rezultat.</p></div>
    <div className="quiz-list">{pilot.questions.map((q, qIndex) => <article className="quiz-card" key={q.question}><div className="quiz-title"><span>{qIndex + 1}</span><h3>{q.question}</h3></div><div className="answers">{q.options.map((option, optionIndex) => <label key={option} className={submitted ? optionIndex === q.correct ? 'correct' : answers[qIndex] === optionIndex ? 'wrong' : '' : ''}><input type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === optionIndex} onChange={() => !submitted && setAnswers((current) => ({ ...current, [qIndex]: optionIndex }))} />{option}</label>)}</div>{submitted && <p className="explanation"><strong>Objašnjenje:</strong> {q.explanation}</p>}</article>)}</div>
    <div className="quiz-actions">{submitted ? <><div className="score"><strong>{score} / {pilot.questions.length}</strong><span>{score >= 4 ? 'Vrlo dobro razumijevanje cjeline.' : 'Preporuka: vratite se na korake koje treba ponoviti.'}</span></div><button className="primary-button" onClick={reset}><RotateCcw /> Ponovi</button></> : <button className="primary-button" disabled={Object.keys(answers).length !== pilot.questions.length} onClick={() => setSubmitted(true)}>Predaj odgovore</button>}</div>
  </>
}

function PlannedChapter({ title, outcome }: { title: string; outcome: string }) {
  return <ComingSoon icon={<BookOpen />} title={`${title} — sadržaj je planiran`} text={`Potvrđeni ishod: ${outcome} Programska osnova namjerno prvo provjerava cjelinu 1; ostali sadržaji dodaju se tek nakon potvrde pilota.`} />
}

function ComingSoon({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="coming-soon"><div className="coming-icon">{icon}</div><span className="eyebrow">PRIPREMLJENA FUNKCIJA</span><h2>{title}</h2><p>{text}</p></div>
}

function SummaryModal({ title, summary, isPilot, onClose }: { title: string; summary: string; isPilot: boolean; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={onClose} aria-label="Zatvori sažetak"><X /></button><span className="eyebrow">SAŽETAK CJELINE</span><h2 id="summary-title">{title}</h2><p>{summary}</p><div className="modal-meta"><BookOpen /><span><strong>{isPilot ? 'Kanonski izvor 1.0' : 'Potvrđena matrica cjelina'}</strong>{isPilot ? 'Stranice 6–11' : 'Sadržaj još nije prenesen u pilot'}</span></div></section></div>
}

function guideText(mode: Mode, isPilot: boolean) {
  if (!isPilot) return 'Ova je cjelina u potvrđenoj matrici, ali sadržaj još nije prenesen. Vratite se na cjelinu 1 kako biste pregledali funkcionalni pilot.'
  const copy: Record<Mode, string> = {
    'Razgovaraj': 'Razgovor će odgovarati iz kanonskog teksta i jasno označenih izvora. Trenutačno nije aktiviran.',
    'Prouči': 'Prođite četiri koraka redom. Svaki izravno upućuje na pripadajući dio kanonskog izvora.',
    'Gledaj i slušaj': 'Audio, video i prezentacija bit će tri ravnopravna izbora, svaki s provjerenim podrijetlom.',
    'Vježbaj': 'Otvarajte kartice vlastitim redoslijedom. Svi su pojmovi uvijek vidljivi i dostupni.',
    'Provjeri': 'Odgovorite na svih pet pitanja. Objašnjenja će pokazati što treba ponoviti.',
  }
  return copy[mode]
}

export default App

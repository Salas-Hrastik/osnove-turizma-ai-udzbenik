import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, BookOpen, Bot, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, FileAudio, FileVideo, Headphones, LockKeyhole, Menu, MessageCircle, Presentation, RotateCcw, Send, Sparkles, X } from 'lucide-react'
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
      <a className="skip-link" href="#glavni-sadrzaj">Preskoči na glavni sadržaj</a>
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

        <main className="main-panel" id="glavni-sadrzaj">
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

      {summaryOpen && <SummaryModal isPilot={isPilot} title={chapter.title} summary={isPilot ? pilot.summary : chapter.outcome} outcomes={isPilot ? pilot.outcomes : []} onClose={() => setSummaryOpen(false)} />}
    </div>
  )
}

function PilotMode({ mode }: { mode: Mode }) {
  if (mode === 'Prouči') return <Study />
  if (mode === 'Vježbaj') return <Flashcards />
  if (mode === 'Provjeri') return <Quiz />
  if (mode === 'Razgovaraj') return <ConversationPreview />
  return <MediaPreview />
}

function Study() {
  return <>
    <div className="section-heading"><span className="eyebrow">PROUČI · KANONSKI IZVOR 1.0</span><h2>Četiri koraka do razumijevanja</h2><p>{pilot.summary}</p></div>
    <section className="outcome-panel" aria-labelledby="outcomes-title">
      <div><span className="eyebrow">ISHODI UČENJA</span><h3 id="outcomes-title">Nakon ove cjeline moći ćete</h3></div>
      <ul>{pilot.outcomes.map((outcome) => <li key={outcome}><CheckCircle2 />{outcome}</li>)}</ul>
    </section>
    <div className="steps">
      {pilot.steps.map((step, index) => <article className="step-card" key={step.title}>
        <span className="step-index">{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p><ul>{step.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="step-takeaway"><strong>Zapamtite:</strong> {step.takeaway}</p><small>{step.source}</small></div>
      </article>)}
    </div>
    <section className="data-section" aria-labelledby="data-title">
      <div className="subsection-heading"><span className="eyebrow">SLUŽBENI PODACI · HRVATSKA 2025.</span><h3 id="data-title">Veličina prometa nije cijela slika</h3><p>Podaci se odnose na komercijalni smještaj. Dolasci nisu broj jedinstvenih osoba, a nekomercijalni promet prati se odvojeno.</p></div>
      <div className="data-grid">{pilot.dataSnapshot.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong>{item.change && <small>{item.change} prema 2024.</small>}</article>)}</div>
    </section>
    <section className="activity-card" aria-labelledby="activity-title">
      <div className="activity-label"><span>PRIMIJENI</span><strong>01</strong></div>
      <div><h3 id="activity-title">{pilot.appliedActivity.title}</h3><p>{pilot.appliedActivity.intro}</p><ol>{pilot.appliedActivity.tasks.map((task) => <li key={task}>{task}</li>)}</ol><small>{pilot.appliedActivity.note}</small></div>
    </section>
    <section className="editorial-update" aria-labelledby="editorial-title">
      <Sparkles />
      <div><span className="eyebrow">UREDNIČKI DODATAK · PROVJERENO {pilot.editorialUpdate.checkedAt.toUpperCase()}</span><h3 id="editorial-title">{pilot.editorialUpdate.title}</h3><p>{pilot.editorialUpdate.body}</p><ul>{pilot.editorialUpdate.implications.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </section>
    <section className="sources-panel" aria-labelledby="sources-title">
      <span className="eyebrow">IZVORI I PODRIJETLO</span><h3 id="sources-title">Provjerljiva osnova cjeline</h3>
      <div>{pilot.sources.map((source) => source.url ? <a key={source.label} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.label}</strong><small>{source.detail}</small></span><ArrowUpRight /></a> : <article key={source.label}><span><strong>{source.label}</strong><small>{source.detail}</small></span><LockKeyhole /></article>)}</div>
    </section>
  </>
}

function Flashcards() {
  return <>
    <div className="section-heading"><span className="eyebrow">VJEŽBAJ · 10 KARTICA</span><h2>Ključni pojmovi</h2><p>Svih deset pojmova i definicija istodobno je vidljivo. Povežite svaki pojam s primjerom iz vlastitog iskustva.</p></div>
    <div className="flashcard-grid">{pilot.keywords.map((card, index) => <article className="flashcard open" key={card.term}><span>{String(index + 1).padStart(2, '0')}</span><strong>{card.term}</strong><p>{card.definition}</p></article>)}</div>
    <div className="practice-prompt"><MessageCircle /><div><span className="eyebrow">BRZA VJEŽBA</span><p>Odaberite tri pojma i objasnite njihovu međusobnu vezu u jednoj rečenici. Primjer: <strong>turist – destinacija – lanac vrijednosti</strong>.</p></div></div>
  </>
}

function ConversationPreview() {
  const prompts = [
    'Objasni razliku između turista i izletnika na novom primjeru.',
    'Prikaži Leiperov model na putovanju iz Zagreba u Dubrovnik.',
    'Zašto broj noćenja nije dovoljan pokazatelj uspjeha?',
  ]
  return <>
    <div className="section-heading"><span className="eyebrow">RAZGOVARAJ · PRIPREMLJENO SUČELJE</span><h2>Razgovor u granicama provjerenih izvora</h2><p>Pisani i glasovni razgovor aktivirat će se nakon zasebnog odobrenja AI konfiguracije. Već sada je definirano što će vodič smjeti koristiti i kako će označavati podrijetlo odgovora.</p></div>
    <div className="conversation-layout">
      <section className="conversation-rules"><div className="conversation-icon"><Bot /></div><span className="eyebrow">PRAVILA ODGOVORA</span><h3>Vodič neće nagađati</h3><ul><li><CheckCircle2 />Najprije odgovara iz kanonskog izvora 1.0.</li><li><CheckCircle2 />Urednički sloj označava datumom i izvorom.</li><li><CheckCircle2 />Kada nema pouzdane osnove, to jasno kaže.</li></ul></section>
      <section className="prompt-preview"><span className="eyebrow">PRIMJERI PITANJA</span><div>{prompts.map((prompt) => <button key={prompt} disabled><MessageCircle />{prompt}</button>)}</div><label htmlFor="pilot-question">Vaše pitanje</label><div className="disabled-composer"><input id="pilot-question" value="AI usluga još nije povezana" disabled /><button disabled aria-label="Pošalji pitanje"><Send /></button></div><small>Aktivacija slijedi tek nakon potvrde modela, izvora, citiranja i zaštite podataka.</small></section>
    </div>
  </>
}

function MediaPreview() {
  const media = [
    { icon: FileAudio, title: 'Audioizvedenica', detail: 'Slušanje cjeline uz jasan zapis trajanja i podrijetla.' },
    { icon: FileVideo, title: 'Videoizvedenica', detail: 'Video s titlovima i provjerenim sadržajnim uporištem.' },
    { icon: Presentation, title: 'Prezentacija', detail: 'Slajdovi sa stručnom interpretacijom svakoga prikaza.' },
  ]
  return <>
    <div className="section-heading"><span className="eyebrow">GLEDAJ I SLUŠAJ · MEDIJSKA MJESTA</span><h2>Tri ravnopravna načina praćenja</h2><p>Raspored i ponašanje medijskog prostora spremni su za autorske datoteke. Nijedna privremena ili tuđa poveznica nije ugrađena.</p></div>
    <div className="media-grid">{media.map(({ icon: Icon, title, detail }, index) => <article key={title}><div><Icon /></div><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{detail}</p><small>Čeka urednički provjerenu datoteku</small></article>)}</div>
    <div className="media-note"><LockKeyhole /><div><strong>Samostalna medijska infrastruktura</strong><p>Datoteke će se povezati tek nakon stvaranja zasebnoga spremišta za ovaj projekt i vašeg izričitog odobrenja.</p></div></div>
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

function SummaryModal({ title, summary, outcomes, isPilot, onClose }: { title: string; summary: string; outcomes: string[]; isPilot: boolean; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={onClose} aria-label="Zatvori sažetak"><X /></button><span className="eyebrow">SAŽETAK CJELINE</span><h2 id="summary-title">{title}</h2><p>{summary}</p>{outcomes.length > 0 && <ul className="modal-outcomes">{outcomes.map((outcome) => <li key={outcome}><CheckCircle2 />{outcome}</li>)}</ul>}<div className="modal-meta"><BookOpen /><span><strong>{isPilot ? 'Kanonski izvor 1.0' : 'Potvrđena matrica cjelina'}</strong>{isPilot ? 'Stranice 6–11' : 'Sadržaj još nije prenesen u pilot'}</span></div></section></div>
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

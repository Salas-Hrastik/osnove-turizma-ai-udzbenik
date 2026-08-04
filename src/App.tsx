import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, BookOpen, Bot, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, FileAudio, FileVideo, Headphones, Keyboard, LockKeyhole, Maximize2, Menu, MessageCircle, Mic, Presentation, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { baltazarHeaderArtwork } from './assets/baltazarHeaderArtwork'
import { book, chapterOne, chapters } from './data/book'
import type { Mode } from './types'

const modes: Array<{ name: Mode; label: string; icon: typeof MessageCircle }> = [
  { name: 'Prouči', label: 'Prouči', icon: BookOpen },
  { name: 'Gledaj i slušaj', label: 'Gledaj i slušaj', icon: Headphones },
  { name: 'Razgovaraj', label: 'Razgovaraj', icon: MessageCircle },
  { name: 'Vježbaj', label: 'Vježba', icon: RotateCcw },
  { name: 'Provjeri', label: 'Provjeri', icon: CircleHelp },
]

function App() {
  const [chapterId, setChapterId] = useState(1)
  const [mode, setMode] = useState<Mode>('Prouči')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0]
  const hasContent = chapterId === 1

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
        <div className="baltazar-logo" aria-hidden="true"><img src={baltazarHeaderArtwork} alt="" /></div>
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
                <span><strong>{item.title}</strong><small>{item.status === 'available' ? `Str. ${item.pages} · dostupno` : item.status === 'assessment' ? 'Završna provjera' : `Str. ${item.pages}`}</small></span>
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
            {modes.map(({ name, label, icon: Icon }) => (
              <button key={name} className={mode === name ? 'active' : ''} onClick={() => setMode(name)} disabled={!hasContent && name !== 'Prouči'}>
                <Icon /><span>{label}</span>
              </button>
            ))}
          </nav>

          <div className={`content-grid ${mode !== 'Prouči' ? 'without-guide' : ''}`}>
            <section className="learning-area">
              {!hasContent ? <PlannedChapter title={chapter.title} outcome={chapter.outcome} /> : <ChapterMode mode={mode} />}
            </section>
            {mode === 'Prouči' && <aside className="guide-card">
              <div className="guide-avatar"><Bot /></div>
              <span className="eyebrow">STALNI VODIČ</span>
              <h3>Kako učiti ovu cjelinu?</h3>
              <p>{guideText(mode, hasContent)}</p>
              <div className="guide-source"><BookOpen /><span><strong>Izvor odgovora</strong>Kanonski tekst 1.0</span></div>
            </aside>}
          </div>

          <div className="chapter-pager">
            <button disabled={chapterId === 1} onClick={() => selectChapter(chapterId - 1)}><ChevronLeft /> Prethodna</button>
            <span>{chapterId} / {chapters.length}</span>
            <button disabled={chapterId === chapters.length} onClick={() => selectChapter(chapterId + 1)}>Sljedeća <ChevronRight /></button>
          </div>
        </main>
      </div>

      {summaryOpen && <SummaryModal hasContent={hasContent} title={chapter.title} summary={hasContent ? chapterOne.summary : chapter.outcome} outcomes={hasContent ? chapterOne.outcomes : []} onClose={() => setSummaryOpen(false)} />}
    </div>
  )
}

function ChapterMode({ mode }: { mode: Mode }) {
  if (mode === 'Prouči') return <Study />
  if (mode === 'Vježbaj') return <Flashcards />
  if (mode === 'Provjeri') return <Quiz />
  if (mode === 'Razgovaraj') return <ConversationPreview />
  return <MediaViewer />
}

function Study() {
  return <>
    <div className="section-heading"><span className="eyebrow">PROUČI · KANONSKI IZVOR 1.0</span><h2>Četiri koraka do razumijevanja</h2><p>{chapterOne.summary}</p></div>
    <section className="outcome-panel" aria-labelledby="outcomes-title">
      <div><span className="eyebrow">ISHODI UČENJA</span><h3 id="outcomes-title">Nakon ove cjeline moći ćete</h3></div>
      <ul>{chapterOne.outcomes.map((outcome) => <li key={outcome}><CheckCircle2 />{outcome}</li>)}</ul>
    </section>
    <div className="steps">
      {chapterOne.steps.map((step, index) => <article className="step-card" key={step.title}>
        <span className="step-index">{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p><ul>{step.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="step-takeaway"><strong>Zapamtite:</strong> {step.takeaway}</p><small>{step.source}</small></div>
      </article>)}
    </div>
    <section className="data-section" aria-labelledby="data-title">
      <div className="subsection-heading"><span className="eyebrow">SLUŽBENI PODACI · HRVATSKA 2025.</span><h3 id="data-title">Veličina prometa nije cijela slika</h3><p>Podaci se odnose na komercijalni smještaj. Dolasci nisu broj jedinstvenih osoba, a nekomercijalni promet prati se odvojeno.</p></div>
      <div className="data-grid">{chapterOne.dataSnapshot.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong>{item.change && <small>{item.change} prema 2024.</small>}</article>)}</div>
    </section>
    <section className="activity-card" aria-labelledby="activity-title">
      <div className="activity-label"><span>PRIMIJENI</span><strong>01</strong></div>
      <div><h3 id="activity-title">{chapterOne.appliedActivity.title}</h3><p>{chapterOne.appliedActivity.intro}</p><ol>{chapterOne.appliedActivity.tasks.map((task) => <li key={task}>{task}</li>)}</ol><small>{chapterOne.appliedActivity.note}</small></div>
    </section>
    <section className="editorial-update" aria-labelledby="editorial-title">
      <Sparkles />
      <div><span className="eyebrow">UREDNIČKI DODATAK · PROVJERENO {chapterOne.editorialUpdate.checkedAt.toUpperCase()}</span><h3 id="editorial-title">{chapterOne.editorialUpdate.title}</h3><p>{chapterOne.editorialUpdate.body}</p><ul>{chapterOne.editorialUpdate.implications.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </section>
    <section className="sources-panel" aria-labelledby="sources-title">
      <span className="eyebrow">IZVORI I PODRIJETLO</span><h3 id="sources-title">Provjerljiva osnova cjeline</h3>
      <div>{chapterOne.sources.map((source) => source.url ? <a key={source.label} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.label}</strong><small>{source.detail}</small></span><ArrowUpRight /></a> : <article key={source.label}><span><strong>{source.label}</strong><small>{source.detail}</small></span><LockKeyhole /></article>)}</div>
    </section>
  </>
}

function Flashcards() {
  return <>
    <div className="section-heading"><span className="eyebrow">VJEŽBAJ · 10 KARTICA</span><h2>Ključni pojmovi</h2><p>Svih deset pojmova i definicija istodobno je vidljivo. Povežite svaki pojam s primjerom iz vlastitog iskustva.</p></div>
    <div className="flashcard-grid">{chapterOne.keywords.map((card, index) => <article className="flashcard open" key={card.term}><span>{String(index + 1).padStart(2, '0')}</span><strong>{card.term}</strong><p>{card.definition}</p></article>)}</div>
    <div className="practice-prompt"><MessageCircle /><div><span className="eyebrow">BRZA VJEŽBA</span><p>Odaberite tri pojma i objasnite njihovu međusobnu vezu u jednoj rečenici. Primjer: <strong>turist – destinacija – lanac vrijednosti</strong>.</p></div></div>
  </>
}

function ConversationPreview() {
  const [conversationType, setConversationType] = useState<'written' | 'voice'>('written')
  const [voiceScope, setVoiceScope] = useState<'topic' | 'chapter' | 'book'>('topic')
  const prompts = [
    'Objasni razliku između turista i izletnika na novom primjeru.',
    'Prikaži Leiperov model na putovanju iz Zagreba u Dubrovnik.',
    'Zašto broj noćenja nije dovoljan pokazatelj uspjeha?',
  ]
  const voiceScopes = [
    {
      key: 'topic' as const,
      label: 'Odabrana tema',
      title: 'Pitanje u užem kontekstu',
      description: 'Vodič koristi aktualnu temu, pripadajuće pojmove i neposredno povezane odlomke.',
      source: 'Najprecizniji i najbrži odgovor',
    },
    {
      key: 'chapter' as const,
      label: 'Cijela cjelina',
      title: 'Uvod u turizam i ugostiteljstvo',
      description: 'Vodič povezuje sva četiri nastavna koraka, pojmove, podatke i urednički dodatak cjeline 1.',
      source: 'Kanonski izvor 1.0 · str. 6–11',
    },
    {
      key: 'book' as const,
      label: 'Cijeli udžbenik',
      title: 'Svih 10 nastavnih cjelina',
      description: 'Vodič traži poveznice u cijelom kanonskom tekstu te u jasno označenim uredničkim dodatcima.',
      source: 'Najširi unutarnji izvor znanja',
    },
  ]
  const selectedScope = voiceScopes.find((scope) => scope.key === voiceScope) ?? voiceScopes[0]

  return <>
    <div className="section-heading"><span className="eyebrow">RAZGOVARAJ · ODABERITE NAČIN</span><h2>Pismeni ili usmeni razgovor</h2><p>Oba načina poštuju istu hijerarhiju provjerenih izvora. U usmenom razgovoru možete proširiti opseg od odabrane teme do cijeloga udžbenika.</p></div>

    <div className="conversation-mode-selector" role="tablist" aria-label="Odaberite način razgovora">
      <button className={conversationType === 'written' ? 'active' : ''} onClick={() => setConversationType('written')} role="tab" aria-selected={conversationType === 'written'} aria-controls="written-conversation">
        <span className="conversation-mode-icon"><Keyboard /></span><span><strong>Pismeni razgovor</strong><small>Upišite pitanje i primite strukturiran odgovor s oznakom izvora.</small></span>
      </button>
      <button className={conversationType === 'voice' ? 'active' : ''} onClick={() => setConversationType('voice')} role="tab" aria-selected={conversationType === 'voice'} aria-controls="voice-conversation">
        <span className="conversation-mode-icon"><Mic /></span><span><strong>Usmeni razgovor</strong><small>Razgovarajte prirodnim glasom i unaprijed odaberite širinu izvora.</small></span>
      </button>
    </div>

    {conversationType === 'written' ? <div className="conversation-layout" id="written-conversation" role="tabpanel">
      <section className="conversation-rules"><div className="conversation-icon"><Bot /></div><span className="eyebrow">PISMENI RAZGOVOR · PRAVILA</span><h3>Vodič neće nagađati</h3><ul><li><CheckCircle2 />Najprije odgovara iz kanonskog izvora 1.0.</li><li><CheckCircle2 />Urednički sloj označava datumom i izvorom.</li><li><CheckCircle2 />Kada nema pouzdane osnove, to jasno kaže.</li></ul><div className="conversation-source-summary"><BookOpen /><span><small>Početni opseg</small><strong>Cijela cjelina 1</strong></span></div></section>
      <section className="prompt-preview"><span className="eyebrow">PRIMJERI PITANJA</span><div>{prompts.map((prompt) => <button key={prompt} disabled><MessageCircle />{prompt}</button>)}</div><label htmlFor="chapter-question">Vaše pitanje</label><div className="disabled-composer"><input id="chapter-question" value="AI usluga još nije povezana" disabled /><button disabled aria-label="Pošalji pitanje"><Send /></button></div><small>Sučelje je prototipski dovršeno. AI usluga aktivirat će se nakon zasebne potvrde modela, citiranja i zaštite podataka.</small></section>
    </div> : <section className="voice-conversation" id="voice-conversation" role="tabpanel">
      <div className="voice-heading"><div><span className="eyebrow">USMENI RAZGOVOR · OPSEG IZVORA</span><h3>Koliko široko vodič smije tražiti odgovor?</h3><p>Odabir možete promijeniti prije svakoga razgovora. Širi opseg omogućuje povezivanje više dijelova knjige, ali odgovor i dalje mora pokazati iz kojega je sloja izveden.</p></div><div className="voice-status"><Mic /><span><small>Status veze</small><strong>Još nije aktivirana</strong></span></div></div>

      <div className="voice-scope-selector" role="radiogroup" aria-label="Odaberite opseg izvora za usmeni razgovor">
        {voiceScopes.map((scope, index) => <button key={scope.key} className={voiceScope === scope.key ? 'active' : ''} onClick={() => setVoiceScope(scope.key)} role="radio" aria-checked={voiceScope === scope.key}>
          <span className="scope-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{scope.label}</strong><em>{scope.title}</em><small>{scope.description}</small><b>{scope.source}</b></span><CheckCircle2 />
        </button>)}
      </div>

      <div className="voice-console">
        <div className="voice-orb"><Mic /></div>
        <div className="voice-console-copy"><span className="eyebrow">ODABRANI OPSEG</span><h3>{selectedScope.label}</h3><p>{selectedScope.description}</p><div className="voice-source-layers"><span><BookOpen />Kanonski tekst 1.0</span><span><Sparkles />Datirani urednički dodatci</span></div></div>
        <div className="voice-action"><button disabled><Mic /> Pokreni usmeni razgovor</button><small>Glasovna veza OpenAI Realtime/WebRTC bit će uključena nakon tehničke i podatkovne konfiguracije.</small></div>
      </div>

      <div className="voice-state-preview" aria-label="Predviđena stanja usmenog razgovora"><span><i>1</i>Slušam</span><ChevronRight /><span><i>2</i>Razmišljam</span><ChevronRight /><span><i>3</i>Govorim</span></div>
      <p className="conversation-boundary"><LockKeyhole /><span><strong>Granica odgovora ostaje vidljiva.</strong> Vanjski izvori ne uključuju se automatski. Ako vlastiti izvori nisu dovoljni, vodič to mora jasno reći i zatražiti dopuštenje prije vanjskog pretraživanja.</span></p>
    </section>}
  </>
}

function MediaViewer() {
  const [selection, setSelection] = useState<'audio' | 'video' | 'presentation'>('audio')
  const [slideIndex, setSlideIndex] = useState(0)
  const [expandedMedia, setExpandedMedia] = useState<'video' | 'presentation' | null>(null)
  const inlineVideoRef = useRef<HTMLVideoElement>(null)
  const { audio, video, presentation } = chapterOne.media
  const slide = presentation.slides[slideIndex]
  const media = [
    { key: 'audio' as const, icon: FileAudio, title: 'Audio', detail: audio.title, meta: audio.duration },
    { key: 'video' as const, icon: FileVideo, title: 'Video', detail: video.title, meta: video.duration },
    { key: 'presentation' as const, icon: Presentation, title: 'Prezentacija', detail: presentation.title, meta: `${presentation.slides.length} slajdova` },
  ]

  return <>
    <div className="section-heading"><span className="eyebrow">GLEDAJ I SLUŠAJ · CJELINA 1</span><h2>Odaberite medij</h2><p>Audio, video i prezentacija povezani su s izdvojenim spremnikom ovoga AI udžbenika. Izvorne datoteke ostaju dostupne uz svaki prikaz.</p></div>
    <div className="media-selector" role="group" aria-label="Odaberite vrstu medija">
      {media.map(({ key, icon: Icon, title, detail, meta }, index) => <button key={key} className={selection === key ? 'active' : ''} onClick={() => setSelection(key)} aria-pressed={selection === key}>
        <span className="media-icon"><Icon /></span><span className="media-number">{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><small>{detail}</small><em>{meta}</em>
      </button>)}
    </div>

    {selection === 'audio' && <section className="media-player" aria-labelledby="audio-title">
      <div className="media-player-heading"><div className="media-player-icon"><FileAudio /></div><div><span className="eyebrow">AUDIO · {audio.duration}</span><h3 id="audio-title">{audio.title}</h3><p>{audio.description}</p></div></div>
      <audio controls preload="metadata" src={audio.url}>Vaš preglednik ne podržava reprodukciju zvuka.</audio>
      <a className="source-link" href={audio.url} target="_blank" rel="noreferrer">Otvori izvornu audiodatoteku <ArrowUpRight /></a>
    </section>}

    {selection === 'video' && <section className="media-player" aria-labelledby="video-title">
      <div className="media-player-heading"><div className="media-player-icon"><FileVideo /></div><div><span className="eyebrow">VIDEO · {video.duration}</span><h3 id="video-title">{video.title}</h3><p>{video.description}</p></div></div>
      <video ref={inlineVideoRef} controls preload="metadata" poster={video.poster} src={video.url}>Vaš preglednik ne podržava reprodukciju videa.</video>
      <div className="media-actions"><button className="expand-button" onClick={() => { inlineVideoRef.current?.pause(); setExpandedMedia('video') }} aria-haspopup="dialog"><Maximize2 /> Otvori veliki prikaz</button><a className="source-link" href={video.url} target="_blank" rel="noreferrer">Otvori izvornu videodatoteku <ArrowUpRight /></a></div>
    </section>}

    {selection === 'presentation' && <section className="presentation-viewer" aria-labelledby="presentation-title">
      <div className="presentation-heading"><div><span className="eyebrow">PREZENTACIJA · {presentation.slides.length} SLAJDOVA</span><h3 id="presentation-title">{presentation.title}</h3><p>{presentation.description}</p></div><button className="expand-button" onClick={() => setExpandedMedia('presentation')} aria-haspopup="dialog"><Maximize2 /> Otvori veliki prikaz</button></div>
      <button className="slide-stage-button" onClick={() => setExpandedMedia('presentation')} aria-label={`Otvori slajd ${slide.number} u velikom prikazu`} aria-haspopup="dialog"><SlideStage slide={slide} slideCount={presentation.slides.length} /></button>
      <SlideControls slideIndex={slideIndex} slideCount={presentation.slides.length} onChange={setSlideIndex} />
      <article className="slide-interpretation"><span className="eyebrow">STRUČNA INTERPRETACIJA SLAJDA {slide.number}</span><h4>{slide.title}</h4><p>{slide.interpretation}</p></article>
      <a className="source-link presentation-source" href={presentation.url} target="_blank" rel="noreferrer">Otvori izvorni PPTX <ArrowUpRight /></a>
    </section>}

    <div className="media-note"><CheckCircle2 /><div><strong>Samostalna medijska infrastruktura</strong><p>Sve tri izvorne datoteke učitavaju se iz javnog spremnika <code>otu-aiu-media/cjelina-01</code>; slike slajdova optimizirane su za čitljiv prikaz u udžbeniku.</p></div></div>

    {expandedMedia === 'video' && <MediaModal title={video.title} label={`VIDEO · ${video.duration}`} onClose={() => setExpandedMedia(null)}>
      <div className="expanded-video"><p>{video.description}</p><video controls autoPlay preload="metadata" poster={video.poster} src={video.url}>Vaš preglednik ne podržava reprodukciju videa.</video><a className="source-link" href={video.url} target="_blank" rel="noreferrer">Otvori izvornu videodatoteku <ArrowUpRight /></a></div>
    </MediaModal>}

    {expandedMedia === 'presentation' && <PresentationModal slideIndex={slideIndex} onSlideChange={setSlideIndex} onClose={() => setExpandedMedia(null)} />}
  </>
}

function SlideStage({ slide, slideCount }: { slide: typeof chapterOne.media.presentation.slides[number]; slideCount: number }) {
  return <figure className="slide-stage"><img src={slide.image} alt={`Slajd ${slide.number}: ${slide.title}`} /><figcaption>Slajd {slide.number} od {slideCount}</figcaption></figure>
}

function SlideControls({ slideIndex, slideCount, onChange }: { slideIndex: number; slideCount: number; onChange: (index: number) => void }) {
  return <div className="slide-controls">
    <button onClick={() => onChange(Math.max(0, slideIndex - 1))} disabled={slideIndex === 0}><ChevronLeft /> Prethodni</button>
    <div className="slide-dots" aria-label="Odaberite slajd">{Array.from({ length: slideCount }, (_, index) => <button key={index} className={index === slideIndex ? 'active' : ''} onClick={() => onChange(index)} aria-label={`Prikaži slajd ${index + 1}`} aria-current={index === slideIndex ? 'true' : undefined}>{index + 1}</button>)}</div>
    <button onClick={() => onChange(Math.min(slideCount - 1, slideIndex + 1))} disabled={slideIndex === slideCount - 1}>Sljedeći <ChevronRight /></button>
  </div>
}

function MediaModal({ title, label, onClose, children }: { title: string; label: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  return <div className="modal-backdrop media-modal-backdrop" role="presentation" onMouseDown={onClose}><section className="media-modal" role="dialog" aria-modal="true" aria-labelledby="media-modal-title" onMouseDown={(event) => event.stopPropagation()}><header className="media-modal-header"><div><span className="eyebrow">{label}</span><h2 id="media-modal-title">{title}</h2></div><button className="icon-button media-modal-close" onClick={onClose} aria-label="Zatvori veliki prikaz" autoFocus><X /></button></header>{children}</section></div>
}

function PresentationModal({ slideIndex, onSlideChange, onClose }: { slideIndex: number; onSlideChange: (index: number) => void; onClose: () => void }) {
  const { presentation } = chapterOne.media
  const slide = presentation.slides[slideIndex]

  useEffect(() => {
    const navigateSlides = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') onSlideChange(Math.max(0, slideIndex - 1))
      if (event.key === 'ArrowRight') onSlideChange(Math.min(presentation.slides.length - 1, slideIndex + 1))
    }
    window.addEventListener('keydown', navigateSlides)
    return () => window.removeEventListener('keydown', navigateSlides)
  }, [onSlideChange, presentation.slides.length, slideIndex])

  return <MediaModal title={presentation.title} label={`PREZENTACIJA · ${presentation.slides.length} SLAJDOVA`} onClose={onClose}>
    <div className="expanded-presentation">
      <div className="expanded-slide-column"><SlideStage slide={slide} slideCount={presentation.slides.length} /><SlideControls slideIndex={slideIndex} slideCount={presentation.slides.length} onChange={onSlideChange} /></div>
      <article className="slide-interpretation expanded-interpretation"><span className="eyebrow">STRUČNA INTERPRETACIJA SLAJDA {slide.number}</span><h4>{slide.title}</h4><p>{slide.interpretation}</p><a className="source-link" href={presentation.url} target="_blank" rel="noreferrer">Otvori izvorni PPTX <ArrowUpRight /></a></article>
    </div>
  </MediaModal>
}

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = useMemo(() => chapterOne.questions.filter((q, i) => answers[i] === q.correct).length, [answers])
  const reset = () => { setAnswers({}); setSubmitted(false) }
  return <>
    <div className="section-heading"><span className="eyebrow">PROVJERI · 5 PITANJA</span><h2>Samoprovjera cjeline</h2><p>Odaberite odgovor na svako pitanje. Nakon predaje dobit ćete objašnjenje, ne samo rezultat.</p></div>
    <div className="quiz-list">{chapterOne.questions.map((q, qIndex) => <article className="quiz-card" key={q.question}><div className="quiz-title"><span>{qIndex + 1}</span><h3>{q.question}</h3></div><div className="answers">{q.options.map((option, optionIndex) => <label key={option} className={submitted ? optionIndex === q.correct ? 'correct' : answers[qIndex] === optionIndex ? 'wrong' : '' : ''}><input type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === optionIndex} onChange={() => !submitted && setAnswers((current) => ({ ...current, [qIndex]: optionIndex }))} />{option}</label>)}</div>{submitted && <p className="explanation"><strong>Objašnjenje:</strong> {q.explanation}</p>}</article>)}</div>
    <div className="quiz-actions">{submitted ? <><div className="score"><strong>{score} / {chapterOne.questions.length}</strong><span>{score >= 4 ? 'Vrlo dobro razumijevanje cjeline.' : 'Preporuka: vratite se na korake koje treba ponoviti.'}</span></div><button className="primary-button" onClick={reset}><RotateCcw /> Ponovi</button></> : <button className="primary-button" disabled={Object.keys(answers).length !== chapterOne.questions.length} onClick={() => setSubmitted(true)}>Predaj odgovore</button>}</div>
  </>
}

function PlannedChapter({ title, outcome }: { title: string; outcome: string }) {
  return <ComingSoon icon={<BookOpen />} title={`${title} — sadržaj je planiran`} text={`Potvrđeni ishod: ${outcome} Ova je cjelina dio integralnog projekta i bit će obrađena prema istom potvrđenom obrascu kao cjelina 1.`} />
}

function ComingSoon({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="coming-soon"><div className="coming-icon">{icon}</div><span className="eyebrow">PRIPREMLJENA FUNKCIJA</span><h2>{title}</h2><p>{text}</p></div>
}

function SummaryModal({ title, summary, outcomes, hasContent, onClose }: { title: string; summary: string; outcomes: string[]; hasContent: boolean; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={onClose} aria-label="Zatvori sažetak"><X /></button><span className="eyebrow">SAŽETAK CJELINE</span><h2 id="summary-title">{title}</h2><p>{summary}</p>{outcomes.length > 0 && <ul className="modal-outcomes">{outcomes.map((outcome) => <li key={outcome}><CheckCircle2 />{outcome}</li>)}</ul>}<div className="modal-meta"><BookOpen /><span><strong>{hasContent ? 'Kanonski izvor 1.0' : 'Potvrđena matrica cjelina'}</strong>{hasContent ? 'Stranice 6–11' : 'Sadržaj cjeline u pripremi'}</span></div></section></div>
}

function guideText(mode: Mode, hasContent: boolean) {
  if (!hasContent) return 'Ova je cjelina dio potvrđene integralne matrice. Njezin puni sadržaj bit će dodan prema obrascu cjeline 1.'
  const copy: Record<Mode, string> = {
    'Razgovaraj': 'Razgovor će odgovarati iz kanonskog teksta i jasno označenih izvora. Trenutačno nije aktiviran.',
    'Prouči': 'Prođite četiri koraka redom. Svaki izravno upućuje na pripadajući dio kanonskog izvora.',
    'Gledaj i slušaj': 'Odaberite audio, video ili prezentaciju. Uz svaki je medij prikazano trajanje, podrijetlo i izvorna datoteka.',
    'Vježbaj': 'Otvarajte kartice vlastitim redoslijedom. Svi su pojmovi uvijek vidljivi i dostupni.',
    'Provjeri': 'Odgovorite na svih pet pitanja. Objašnjenja će pokazati što treba ponoviti.',
  }
  return copy[mode]
}

export default App

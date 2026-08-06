import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, BookOpen, Bot, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, FileAudio, FileVideo, Headphones, Keyboard, LockKeyhole, Menu, MessageCircle, Mic, Presentation, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { baltazarHeaderArtwork } from './assets/baltazarHeaderArtwork'
import { book, chapterContents, chapters } from './data/book'
import type { ChapterContent, Mode, PresentationFile, PresentationSlide } from './types'

type MediaKind = 'audio' | 'video' | 'presentation'

const modes: Array<{ name: Mode; label: string; icon: typeof MessageCircle }> = [
  { name: 'Prouči', label: 'Prouči', icon: BookOpen },
  { name: 'Gledaj i slušaj', label: 'Gledaj i slušaj', icon: Headphones },
  { name: 'Razgovaraj', label: 'Razgovaraj', icon: MessageCircle },
  { name: 'Vježbaj', label: 'Vježba', icon: RotateCcw },
  { name: 'Provjeri', label: 'Provjeri', icon: CircleHelp },
]

function App() {
  const [showCover, setShowCover] = useState(true)
  const [chapterId, setChapterId] = useState(1)
  const [mode, setMode] = useState<Mode>('Prouči')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaKind | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const mainBodyRef = useRef<HTMLDivElement>(null)
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0]
  const chapterContent = chapterContents[chapterId]
  const hasContent = Boolean(chapterContent)

  const selectChapter = (id: number) => {
    setShowCover(false)
    setChapterId(id)
    setMode('Prouči')
    setSelectedMedia(null)
    setSlideIndex(0)
    setSidebarOpen(false)
    mainBodyRef.current?.scrollTo({ top: 0 })
  }

  const selectMode = (nextMode: Mode) => {
    setMode(nextMode)
    setSelectedMedia(null)
    mainBodyRef.current?.scrollTo({ top: 0 })
  }

  const openMedia = (media: MediaKind) => {
    if (media === 'presentation') setSlideIndex(0)
    setSelectedMedia(media)
  }

  const openBook = () => {
    setShowCover(false)
    setChapterId(1)
    setMode('Prouči')
    setSelectedMedia(null)
    setSlideIndex(0)
    setSidebarOpen(false)
    setSummaryOpen(false)
    mainBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToCover = () => {
    setShowCover(true)
    setSelectedMedia(null)
    setSidebarOpen(false)
    setSummaryOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showCover) return <BookCover onOpen={openBook} />

  return (
    <div className="app-shell">
      <a className="skip-link" href="#glavni-sadrzaj">Preskoči na glavni sadržaj</a>
      <header className="topbar">
        <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Otvori sadržaj"><Menu /></button>
        <a className="brand-home" href="/" onClick={(event) => { event.preventDefault(); goToCover() }} aria-label="Povratak na korice AI udžbenika" title="Povratak na korice AI udžbenika">
          <span className="baltazar-logo" aria-hidden="true"><img src={baltazarHeaderArtwork} alt="" /></span>
          <span className="brand-copy">
            <span className="eyebrow">AI UDŽBENIK</span>
            <strong>{book.title}</strong>
          </span>
        </a>
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
          <div className={`chapter-controls ${mode === 'Gledaj i slušaj' ? 'media-mode-controls' : ''}`}>
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
                <button key={name} className={mode === name ? 'active' : ''} aria-pressed={mode === name} onClick={() => selectMode(name)} disabled={!hasContent && name !== 'Prouči'}>
                  <Icon /><span>{label}</span>
                </button>
              ))}
            </nav>
            {mode === 'Gledaj i slušaj' && chapterContent?.media && <>
              <MediaOverview content={chapterContent} />
              <MediaSubmenu content={chapterContent} onSelect={openMedia} />
            </>}
          </div>

          <div className="main-body-scroll" ref={mainBodyRef}>
            <div className={`content-grid ${mode !== 'Prouči' ? 'without-guide' : ''}`}>
              <section className={`learning-area ${mode === 'Gledaj i slušaj' ? 'media-learning-area' : ''}`}>
                {!chapterContent ? <PlannedChapter title={chapter.title} outcome={chapter.outcome} /> : <ChapterMode key={chapter.id} mode={mode} content={chapterContent} />}
              </section>
              {mode === 'Prouči' && <aside className="guide-card">
                <div className="guide-avatar"><Bot /></div>
                <span className="eyebrow">STALNI VODIČ</span>
                <h3>Kako pručiti ovu cjelinu?</h3>
                <p>{guideText(mode, hasContent)}</p>
                <div className="guide-source"><BookOpen /><span><strong>Izvor odgovora</strong>Kanonski tekst 1.0</span></div>
              </aside>}
            </div>

            <div className="chapter-pager">
              <button disabled={chapterId === 1} onClick={() => selectChapter(chapterId - 1)}><ChevronLeft /> Prethodna</button>
              <span>{chapterId} / {chapters.length}</span>
              <button disabled={chapterId === chapters.length} onClick={() => selectChapter(chapterId + 1)}>Sljedeća <ChevronRight /></button>
            </div>
          </div>
        </main>
      </div>

      {summaryOpen && <SummaryModal title={chapter.title} pages={chapter.pages} summary={chapterContent?.summary ?? chapter.outcome} outcomes={chapterContent?.outcomes ?? []} hasContent={hasContent} onClose={() => setSummaryOpen(false)} />}
      {selectedMedia && chapterContent?.media && <SelectedMediaModal media={selectedMedia} content={chapterContent} slideIndex={slideIndex} onSlideChange={setSlideIndex} onClose={() => setSelectedMedia(null)} />}
    </div>
  )
}

function BookCover({ onOpen }: { onOpen: () => void }) {
  return <main className="book-cover-page" id="glavni-sadrzaj">
    <section className="book-cover" aria-labelledby="book-cover-title">
      <div className="book-cover-brand">
        <span className="book-cover-logo" aria-hidden="true"><img src={baltazarHeaderArtwork} alt="" /></span>
        <span><strong>Veleučilište Baltazar</strong><small>AI udžbenik</small></span>
      </div>
      <div className="book-cover-title">
        <span>AI UDŽBENIK · KANONSKI IZVOR v{book.canonicalVersion}</span>
        <h1 id="book-cover-title">{book.title}</h1>
        <p>Interaktivni prostor za proučavanje, gledanje i slušanje, razgovor, vježbu i samoprovjeru znanja.</p>
      </div>
      <div className="book-cover-footer">
        <div><span>Autor</span><strong>{book.author}</strong></div>
        <div><span>Izdavač</span><strong>{book.publisher}</strong></div>
        <button type="button" className="cover-open-button" onClick={onOpen}><BookOpen /> Otvori udžbenik</button>
      </div>
    </section>
  </main>
}

function ChapterMode({ mode, content }: { mode: Mode; content: ChapterContent }) {
  if (mode === 'Prouči') return <Study content={content} />
  if (mode === 'Vježbaj') return <Flashcards content={content} />
  if (mode === 'Provjeri') return <Quiz content={content} />
  if (mode === 'Razgovaraj') return <ConversationPreview content={content} />
  return <MediaViewer content={content} />
}

function Study({ content }: { content: ChapterContent }) {
  const dataPresentation = content.id === 2
    ? {
        eyebrow: 'RAZVOJNE PREKRETNICE',
        title: 'Od privilegije do dostupnog putovanja',
        description: 'Odabrane godine označuju promjene u organizaciji, dostupnosti i posredovanju koje su širile turističko tržište.',
        appendComparison: false,
      }
    : content.id === 3
      ? {
          eyebrow: 'ANALITIČKI MODELI',
          title: 'Četiri pogleda na ponašanje potražnje',
          description: 'Svaki okvir odgovara na drugo pitanje: koja se potreba aktivira, što pokreće putovanje, kakav rizik turist prihvaća i kako donosi konačnu odluku.',
          appendComparison: false,
        }
      : content.id === 6
        ? {
            eyebrow: 'OPERATIVNI PRIMJER',
            title: 'Pokazatelji jednoga hotelskog dana',
            description: 'Svi su pokazatelji izračunani na istom didaktičkom primjeru: 120 raspoloživih soba, 90 prodanih soba, 13 500 € prihoda od smještaja i 4 800 € bruto operativne dobiti.',
            appendComparison: false,
          }
        : content.id === 7
          ? {
              eyebrow: 'UČINCI I POKAZATELJI',
              title: 'Od gospodarskog doprinosa do turističkog opterećenja',
              description: 'Prva dva pokazatelja potječu iz ispravljenoga službenog satelitskog računa za 2022.; druga dva rezultat su didaktičkog primjera i služe učenju turističkog intenziteta i gustoće.',
              appendComparison: false,
            }
      : {
          eyebrow: 'SLUŽBENI PODACI · HRVATSKA 2025.',
          title: 'Veličina prometa nije cijela slika',
          description: 'Podaci se odnose na komercijalni smještaj. Dolasci nisu broj jedinstvenih osoba, a nekomercijalni promet prati se odvojeno.',
          appendComparison: true,
        }
  return <>
    <div className="section-heading"><span className="eyebrow">PROUČI · KANONSKI IZVOR 1.0</span><h2>Četiri koraka do razumijevanja</h2><p>{content.summary}</p></div>
    <section className="outcome-panel" aria-labelledby="outcomes-title">
      <div><span className="eyebrow">ISHODI UČENJA</span><h3 id="outcomes-title">Nakon ove cjeline moći ćete</h3></div>
      <ul>{content.outcomes.map((outcome) => <li key={outcome}><CheckCircle2 />{outcome}</li>)}</ul>
    </section>
    <div className="steps">
      {content.steps.map((step, index) => <article className="step-card" key={step.title}>
        <span className="step-index">{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p><ul>{step.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="step-takeaway"><strong>Zapamtite:</strong> {step.takeaway}</p><small>{step.source}</small></div>
      </article>)}
    </div>
    <section className="data-section" aria-labelledby="data-title">
      <div className="subsection-heading"><span className="eyebrow">{dataPresentation.eyebrow}</span><h3 id="data-title">{dataPresentation.title}</h3><p>{dataPresentation.description}</p></div>
      <div className="data-grid">{content.dataSnapshot.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong>{item.change && <small>{item.change}{dataPresentation.appendComparison ? ' prema 2024.' : ''}</small>}</article>)}</div>
    </section>
    <section className="activity-card" aria-labelledby="activity-title">
      <div className="activity-label"><span>PRIMIJENI</span><strong>01</strong></div>
      <div><h3 id="activity-title">{content.appliedActivity.title}</h3><p>{content.appliedActivity.intro}</p><ol>{content.appliedActivity.tasks.map((task) => <li key={task}>{task}</li>)}</ol><small>{content.appliedActivity.note}</small></div>
    </section>
    <section className="editorial-update" aria-labelledby="editorial-title">
      <Sparkles />
      <div><span className="eyebrow">UREDNIČKI DODATAK · PROVJERENO {content.editorialUpdate.checkedAt.toUpperCase()}</span><h3 id="editorial-title">{content.editorialUpdate.title}</h3><p>{content.editorialUpdate.body}</p><ul>{content.editorialUpdate.implications.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </section>
    <section className="sources-panel" aria-labelledby="sources-title">
      <span className="eyebrow">IZVORI I PODRIJETLO</span><h3 id="sources-title">Provjerljiva osnova cjeline</h3>
      <div>{content.sources.map((source) => source.url ? <a key={source.label} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.label}</strong><small>{source.detail}</small></span><ArrowUpRight /></a> : <article key={source.label}><span><strong>{source.label}</strong><small>{source.detail}</small></span><LockKeyhole /></article>)}</div>
    </section>
  </>
}

function Flashcards({ content }: { content: ChapterContent }) {
  const [openCards, setOpenCards] = useState<Set<string>>(new Set())

  const toggleCard = (term: string) => {
    setOpenCards((current) => {
      const next = new Set(current)
      if (next.has(term)) next.delete(term)
      else next.add(term)
      return next
    })
  }

  return <>
    <div className="section-heading"><span className="eyebrow">VJEŽBAJ · 10 KARTICA</span><h2>Ključni pojmovi</h2><p><strong>Pritisnite željeni pojam kako biste prikazali njegovo objašnjenje.</strong> Ponovnim pritiskom objašnjenje možete sakriti.</p></div>
    <div className="flashcard-grid">{content.keywords.map((card, index) => {
      const isOpen = openCards.has(card.term)
      const definitionId = `definition-${index + 1}`
      return <button className={`flashcard ${isOpen ? 'open' : ''}`} key={card.term} type="button" aria-expanded={isOpen} aria-controls={definitionId} onClick={() => toggleCard(card.term)}>
        <span className="flashcard-number">{String(index + 1).padStart(2, '0')}</span>
        <strong>{card.term}</strong>
        {isOpen ? <span className="flashcard-definition" id={definitionId}>{card.definition}</span> : <small>Pritisnite za objašnjenje</small>}
      </button>
    })}</div>
  </>
}

function ConversationPreview({ content }: { content: ChapterContent }) {
  const [conversationType, setConversationType] = useState<'written' | 'voice' | null>(null)
  const [voiceScope, setVoiceScope] = useState<'topic' | 'chapter' | 'book'>('topic')
  const prompts = content.id === 2
    ? [
        'Zašto slobodno vrijeme bez prometne infrastrukture nije dovoljno za razvoj turizma?',
        'Usporedi Grand Tour i suvremeni Erasmus+ program.',
        'Kako bi Opatija mogla suvremeno koristiti svoj lječilišni identitet?',
      ]
    : content.id === 3
      ? [
          'Objasni razliku između push i pull faktora na primjeru odmora u Baranji.',
          'Kako se psihocentrični i alocentrični turist razlikuju pri izboru odredišta?',
          'Zašto pretjerano obećanje može stvoriti nezadovoljstvo i kod dobre usluge?',
        ]
      : content.id === 6
        ? [
            'Izračunaj OCC, ADR i RevPAR za hotel sa 120 soba, 90 prodanih soba i 13 500 € prihoda.',
            'Usporedi neovisni hotel, franšizu i ugovor o upravljanju.',
            'Kako oporavak usluge i tehnologija mogu zajedno smanjiti trud gosta?',
          ]
        : content.id === 7
          ? [
              'Objasni put turističkog eura kroz izravne, neizravne i inducirane učinke.',
              'Kako zajedno primijeniti Doxeyev i Butlerov model na destinaciju u konsolidaciji?',
              'Izračunaj turistički intenzitet i gustoću za zadani primjer te protumači ograničenja rezultata.',
            ]
        : content.id === 8
          ? [
              'Kako razlikovati pokazatelj, izvješće, certifikat i marketinšku oznaku održivosti?',
              'Pretvori jedan cilj hrvatske Strategije do 2030. u SMART cilj, pokazatelj i akcijski projekt.',
              'Izradi matricu interesa i utjecaja dionika za plan upravljanja odabranom destinacijom.',
            ]
      : [
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
      title: content.title,
      description: `Vodič povezuje sva četiri nastavna koraka, pojmove, podatke i urednički dodatak cjeline ${content.id}.`,
      source: `Kanonski izvor 1.0 · str. ${content.pages}`,
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

    <div className="conversation-mode-selector" role="group" aria-label="Odaberite način razgovora">
      <button type="button" onClick={() => setConversationType('written')} aria-haspopup="dialog" aria-label="Otvori objašnjenje pismenog razgovora u skočnom prozoru">
        <span className="conversation-mode-icon"><Keyboard /></span><span><strong>Pismeni razgovor</strong><small>Otvara objašnjenje u skočnom prozoru</small></span>
      </button>
      <button type="button" onClick={() => setConversationType('voice')} aria-haspopup="dialog" aria-label="Otvori objašnjenje usmenog razgovora u skočnom prozoru">
        <span className="conversation-mode-icon"><Mic /></span><span><strong>Usmeni razgovor</strong><small>Otvara objašnjenje u skočnom prozoru</small></span>
      </button>
    </div>

    {conversationType && <ConversationModal type={conversationType} onClose={() => setConversationType(null)}>
      {conversationType === 'written' ? <div className="conversation-layout" id="written-conversation">
        <section className="conversation-rules"><div className="conversation-icon"><Bot /></div><span className="eyebrow">PISMENI RAZGOVOR · PRAVILA</span><h3>Vodič neće nagađati</h3><ul><li><CheckCircle2 />Najprije odgovara iz kanonskog izvora 1.0.</li><li><CheckCircle2 />Urednički sloj označava datumom i izvorom.</li><li><CheckCircle2 />Kada nema pouzdane osnove, to jasno kaže.</li></ul><div className="conversation-source-summary"><BookOpen /><span><small>Početni opseg</small><strong>Cijela cjelina {content.id}</strong></span></div></section>
        <section className="prompt-preview"><span className="eyebrow">PRIMJERI PITANJA</span><div>{prompts.map((prompt) => <button key={prompt} disabled><MessageCircle />{prompt}</button>)}</div><label htmlFor="chapter-question">Vaše pitanje</label><div className="disabled-composer"><input id="chapter-question" value="AI usluga još nije povezana" disabled /><button disabled aria-label="Pošalji pitanje"><Send /></button></div><small>Sučelje je prototipski dovršeno. AI usluga aktivirat će se nakon zasebne potvrde modela, citiranja i zaštite podataka.</small></section>
      </div> : <section className="voice-conversation" id="voice-conversation">
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
    </ConversationModal>}
  </>
}

function ConversationModal({ type, onClose, children }: { type: 'written' | 'voice'; onClose: () => void; children: React.ReactNode }) {
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

  const isWritten = type === 'written'
  return createPortal(<div className="modal-backdrop conversation-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="conversation-modal" role="dialog" aria-modal="true" aria-labelledby="conversation-modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <header className="conversation-modal-header">
        <div><span className="eyebrow">RAZGOVARAJ · {isWritten ? 'PISMENI NAČIN' : 'USMENI NAČIN'}</span><h2 id="conversation-modal-title">{isWritten ? 'Pismeni razgovor' : 'Usmeni razgovor'}</h2></div>
        <button className="icon-button conversation-modal-close" onClick={onClose} aria-label="Zatvori objašnjenje razgovora" autoFocus><X /></button>
      </header>
      <div className="conversation-modal-content">{children}</div>
    </section>
  </div>, document.body)
}

function MediaViewer({ content }: { content: ChapterContent }) {
  if (!content.media) return <ComingSoon icon={<Headphones />} title="Multimedija je prenesena" text="Izvorne datoteke nalaze se u samostalnom Supabase spremniku. Njihovi točni nazivi još se povezuju s ovim prikazom." />
  return <div className="media-note"><CheckCircle2 /><strong>Samostalna medijska infrastruktura</strong></div>
}

function MediaOverview({ content }: { content: ChapterContent }) {
  return <div className="section-heading media-overview"><span className="eyebrow">GLEDAJ I SLUŠAJ · CJELINA {content.id}</span><h2>Audio, video i prezentacija</h2><p>Odaberite medij u podizborniku ispod i otvorit će se pripadajući skočni prozor.</p></div>
}

function MediaSubmenu({ content, onSelect }: { content: ChapterContent; onSelect: (media: MediaKind) => void }) {
  if (!content.media) return null
  const { audio, video, presentation } = content.media
  const media = [
    { key: 'audio' as const, icon: FileAudio, title: 'Audio', detail: audio.title, meta: audio.duration },
    { key: 'video' as const, icon: FileVideo, title: 'Video', detail: video.title, meta: video.duration },
    { key: 'presentation' as const, icon: Presentation, title: 'Prezentacija', detail: presentation.title, meta: `${presentation.slides.length} slajdova` },
  ]

  return <nav className="media-submenu" aria-label="Mediji cjeline">
    {media.map(({ key, icon: Icon, title, detail, meta }) => <button key={key} onClick={() => onSelect(key)} aria-haspopup="dialog">
        <span className="media-submenu-icon"><Icon /></span>
        <span className="media-submenu-copy"><strong>{title}</strong><small>{detail}</small></span>
        <em>{meta}</em>
      </button>)}
  </nav>
}

function SelectedMediaModal({ media, content, slideIndex, onSlideChange, onClose }: { media: MediaKind; content: ChapterContent; slideIndex: number; onSlideChange: (index: number) => void; onClose: () => void }) {
  if (!content.media) return null
  const { audio, video, presentation } = content.media
  if (media === 'audio') return <MediaModal title={audio.title} label={`AUDIO · ${audio.duration}`} onClose={onClose}>
      <div className="expanded-audio"><p>{audio.description}</p><audio controls autoPlay preload="metadata" src={audio.url}>Vaš preglednik ne podržava reprodukciju zvuka.</audio><a className="source-link" href={audio.url} target="_blank" rel="noreferrer">Otvori izvornu audiodatoteku <ArrowUpRight /></a></div>
    </MediaModal>
  if (media === 'video') return <MediaModal title={video.title} label={`VIDEO · ${video.duration}`} onClose={onClose}>
      <div className="expanded-video"><p>{video.description}</p><video controls autoPlay preload="metadata" poster={video.poster} src={video.url}>Vaš preglednik ne podržava reprodukciju videa.</video><a className="source-link" href={video.url} target="_blank" rel="noreferrer">Otvori izvornu videodatoteku <ArrowUpRight /></a></div>
    </MediaModal>
  return <PresentationModal presentation={presentation} slideIndex={slideIndex} onSlideChange={onSlideChange} onClose={onClose} />
}

function SlideStage({ slide, slideCount }: { slide: PresentationSlide; slideCount: number }) {
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

  return createPortal(<div className="modal-backdrop media-modal-backdrop" role="presentation" onMouseDown={onClose}><section className="media-modal" role="dialog" aria-modal="true" aria-labelledby="media-modal-title" onMouseDown={(event) => event.stopPropagation()}><header className="media-modal-header"><div><span className="eyebrow">{label}</span><h2 id="media-modal-title">{title}</h2></div><button className="icon-button media-modal-close" onClick={onClose} aria-label="Zatvori skočni prozor" autoFocus><X /></button></header>{children}</section></div>, document.body)
}

function PresentationModal({ presentation, slideIndex, onSlideChange, onClose }: { presentation: PresentationFile; slideIndex: number; onSlideChange: (index: number) => void; onClose: () => void }) {
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

function Quiz({ content }: { content: ChapterContent }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = useMemo(() => content.questions.filter((q, i) => answers[i] === q.correct).length, [answers, content.questions])
  const reset = () => { setAnswers({}); setSubmitted(false) }
  return <>
    <div className="section-heading"><span className="eyebrow">PROVJERI · 5 PITANJA</span><h2>Samoprovjera cjeline</h2><p>Odaberite odgovor na svako pitanje. Nakon predaje dobit ćete objašnjenje, ne samo rezultat.</p></div>
    <div className="quiz-list">{content.questions.map((q, qIndex) => <article className="quiz-card" key={q.question}><div className="quiz-title"><span>{qIndex + 1}</span><h3>{q.question}</h3></div><div className="answers">{q.options.map((option, optionIndex) => <label key={option} className={submitted ? optionIndex === q.correct ? 'correct' : answers[qIndex] === optionIndex ? 'wrong' : '' : ''}><input type="radio" name={`q-${content.id}-${qIndex}`} checked={answers[qIndex] === optionIndex} onChange={() => !submitted && setAnswers((current) => ({ ...current, [qIndex]: optionIndex }))} />{option}</label>)}</div>{submitted && <p className="explanation"><strong>Objašnjenje:</strong> {q.explanation}</p>}</article>)}</div>
    <div className="quiz-actions">{submitted ? <><div className="score"><strong>{score} / {content.questions.length}</strong><span>{score >= 4 ? 'Vrlo dobro razumijevanje cjeline.' : 'Preporuka: vratite se na korake koje treba ponoviti.'}</span></div><button className="primary-button" onClick={reset}><RotateCcw /> Ponovi</button></> : <button className="primary-button" disabled={Object.keys(answers).length !== content.questions.length} onClick={() => setSubmitted(true)}>Predaj odgovore</button>}</div>
  </>
}

function PlannedChapter({ title, outcome }: { title: string; outcome: string }) {
  return <ComingSoon icon={<BookOpen />} title={`${title} — sadržaj je planiran`} text={`Potvrđeni ishod: ${outcome} Ova je cjelina dio integralnog projekta i bit će obrađena prema istom potvrđenom obrascu kao cjelina 1.`} />
}

function ComingSoon({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="coming-soon"><div className="coming-icon">{icon}</div><span className="eyebrow">PRIPREMLJENA FUNKCIJA</span><h2>{title}</h2><p>{text}</p></div>
}

function SummaryModal({ title, pages, summary, outcomes, hasContent, onClose }: { title: string; pages: string; summary: string; outcomes: string[]; hasContent: boolean; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={onClose} aria-label="Zatvori sažetak"><X /></button><span className="eyebrow">SAŽETAK CJELINE</span><h2 id="summary-title">{title}</h2><p>{summary}</p>{outcomes.length > 0 && <ul className="modal-outcomes">{outcomes.map((outcome) => <li key={outcome}><CheckCircle2 />{outcome}</li>)}</ul>}<div className="modal-meta"><BookOpen /><span><strong>{hasContent ? 'Kanonski izvor 1.0' : 'Potvrđena matrica cjelina'}</strong>{hasContent ? `Stranice ${pages}` : 'Sadržaj cjeline u pripremi'}</span></div></section></div>
}

function guideText(mode: Mode, hasContent: boolean) {
  if (!hasContent) return 'Ova je cjelina dio potvrđene integralne matrice. Njezin puni sadržaj bit će dodan prema obrascu cjeline 1.'
  const copy: Record<Mode, string> = {
    'Razgovaraj': 'Razgovor će odgovarati iz kanonskog teksta i jasno označenih izvora. Trenutačno nije aktiviran.',
    'Prouči': 'Prođite četiri koraka redom. Svaki izravno upućuje na pripadajući dio kanonskog izvora.',
    'Gledaj i slušaj': 'Odaberite audio, video ili prezentaciju. Uz svaki je medij prikazano trajanje, podrijetlo i izvorna datoteka.',
    'Vježbaj': 'Pritisnite pojam kako biste prikazali njegovo objašnjenje. Ponovnim pritiskom karticu možete zatvoriti.',
    'Provjeri': 'Odgovorite na svih pet pitanja. Objašnjenja će pokazati što treba ponoviti.',
  }
  return copy[mode]
}

export default App

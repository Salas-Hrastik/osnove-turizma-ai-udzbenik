import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, BookOpen, Bot, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, FileAudio, FileVideo, Headphones, Keyboard, LockKeyhole, Menu, MessageCircle, Mic, Presentation, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { baltazarHeaderArtwork } from './assets/baltazarHeaderArtwork'
import { book, chapterContents, chapters } from './data/book'
import { FinalOralExam } from './FinalOralExam'
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
  const isFinalAssessment = chapter.status === 'assessment'

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
          <div className={`chapter-controls ${mode === 'Gledaj i slušaj' ? 'media-mode-controls' : ''} ${isFinalAssessment ? 'assessment-controls' : ''}`}>
            <section className="chapter-hero">
              <div>
                <span className="eyebrow">CJELINA {chapter.id} · {chapter.status === 'assessment' ? chapter.pages : `STRANICE ${chapter.pages}`}</span>
                <h1>{chapter.title}</h1>
                <p>{chapter.outcome}</p>
              </div>
              <button className="summary-button" onClick={() => setSummaryOpen(true)}><Sparkles /> Sažetak cjeline</button>
            </section>

            {!isFinalAssessment && <nav className="mode-tabs" aria-label="Načini rada">
              {modes.map(({ name, label, icon: Icon }) => (
                <button key={name} className={mode === name ? 'active' : ''} aria-pressed={mode === name} onClick={() => selectMode(name)} disabled={!hasContent && name !== 'Prouči'}>
                  <Icon /><span>{label}</span>
                </button>
              ))}
            </nav>}
            {mode === 'Gledaj i slušaj' && chapterContent?.media && <>
              <MediaOverview content={chapterContent} />
              <MediaSubmenu content={chapterContent} onSelect={openMedia} />
            </>}
          </div>

          <div className="main-body-scroll" ref={mainBodyRef}>
            <div className={`content-grid ${mode !== 'Prouči' || isFinalAssessment ? 'without-guide' : ''}`}>
              <section className={`learning-area ${mode === 'Gledaj i slušaj' ? 'media-learning-area' : ''} ${isFinalAssessment ? 'assessment-learning-area' : ''}`}>
                {isFinalAssessment ? <FinalOralExam /> : !chapterContent ? <PlannedChapter title={chapter.title} outcome={chapter.outcome} /> : <ChapterMode key={chapter.id} mode={mode} content={chapterContent} />}
              </section>
              {mode === 'Prouči' && !isFinalAssessment && <aside className="guide-card">
                <div className="guide-avatar"><Bot /></div>
                <span className="eyebrow">STALNI VODIČ</span>
                <h3>Kako proučiti ovu cjelinu?</h3>
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

      {summaryOpen && <SummaryModal title={chapter.title} pages={chapter.pages} summary={chapterContent?.summary ?? chapter.outcome} outcomes={isFinalAssessment ? ['odgovoriti na pet nasumično odabranih pitanja iz različitih cjelina', 'povezati pojmove i obrazložiti odgovor vlastitim riječima', 'upotrijebiti sugestivnu pomoć za nastavak nepotpunoga odgovora', 'protumačiti završni zapisnik i preporuke za daljnje učenje'] : chapterContent?.outcomes ?? []} hasContent={hasContent || isFinalAssessment} onClose={() => setSummaryOpen(false)} />}
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
        <div><span>Autorski istraživački dodatak</span><strong>Ivan Ružić, Tanja Gavrić</strong></div>
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
        : content.id === 8
          ? {
              eyebrow: 'OKVIRI I UPRAVLJAČKI PRAGOVI',
              title: 'Održivost postaje operativna tek kada se mjeri i provodi',
              description: 'Četiri pokazatelja povezuju stupove održivosti, strateški ciklus, vremenski horizont plana upravljanja i aktualni europski prag izvješćivanja.',
              appendComparison: false,
            }
        : content.id === 9
          ? {
              eyebrow: 'OTPORNOST I DIGITALNA PRAVILA',
              title: 'Priprema prije poremećaja određuje sposobnost oporavka',
              description: 'Pokazatelji sažimaju ciklus kriznog upravljanja, skupine primjene umjetne inteligencije te aktualne datume europskih obveza transparentnosti i visokorizičnih sustava.',
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

type ConversationMessage = { role: 'user' | 'assistant'; text: string; source?: string }
type VoiceStatus = 'idle' | 'connecting' | 'ready' | 'listening' | 'thinking' | 'speaking' | 'error'

const voiceStatusText: Record<VoiceStatus, string> = {
  idle: 'Razgovor nije pokrenut',
  connecting: 'Povezujem mikrofon…',
  ready: 'Spreman — izgovorite pitanje',
  listening: 'Slušam vas…',
  thinking: 'Oblikujem odgovor…',
  speaking: 'AI vodič govori…',
  error: 'Razgovor je prekinut',
}

function conversationContext(content: ChapterContent, scope: 'topic' | 'chapter' | 'book') {
  const selected = scope === 'book'
    ? Object.values(chapterContents).filter((chapter): chapter is ChapterContent => Boolean(chapter))
    : [content]
  return selected.map((chapter) => [
    `CJELINA ${chapter.id}: ${chapter.title} (str. ${chapter.pages})`,
    `Sažetak: ${chapter.summary}`,
    ...chapter.steps.map((step) => `${step.title}: ${step.body} ${step.takeaway} [${step.source}]`),
    `Ključni pojmovi: ${chapter.keywords.map((item) => `${item.term}: ${item.definition}`).join('; ')}`,
    `Urednički/istraživački dodatak (${chapter.editorialUpdate.checkedAt}): ${chapter.editorialUpdate.title}. ${chapter.editorialUpdate.body}`,
    `Izvori: ${chapter.sources.map((source) => `${source.label} — ${source.detail}`).join('; ')}`,
  ].join('\n')).join('\n\n')
}

function answerFromBook(question: string, content: ChapterContent, scope: 'topic' | 'chapter' | 'book') {
  const normalized = question.toLocaleLowerCase('hr').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const words = normalized.split(/[^a-z0-9čćđšž]+/).filter((word) => word.length > 3)
  const contents = scope === 'book'
    ? Object.values(chapterContents).filter((chapter): chapter is ChapterContent => Boolean(chapter))
    : [content]
  const candidates = contents.flatMap((chapter) => [
    ...chapter.keywords.map((item) => ({ text: `${item.term} — ${item.definition}`, source: `Cjelina ${chapter.id} · ključni pojam „${item.term}”` })),
    ...chapter.steps.map((item) => ({ text: `${item.title}: ${item.body} ${item.takeaway}`, source: `Cjelina ${chapter.id} · ${item.source}` })),
    { text: chapter.summary, source: `Cjelina ${chapter.id} · sažetak` },
    { text: `${chapter.editorialUpdate.title}: ${chapter.editorialUpdate.body}`, source: `Cjelina ${chapter.id} · urednički dodatak (${chapter.editorialUpdate.checkedAt})` },
  ])
  const ranked = candidates.map((candidate) => {
    const haystack = candidate.text.toLocaleLowerCase('hr').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return { ...candidate, score: words.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0) }
  }).sort((a, b) => b.score - a.score)
  const best = ranked[0]
  if (!best || best.score === 0) return {
    text: 'U odabranom izvoru nisam pronašao dovoljno pouzdanu osnovu za odgovor. Pokušajte pitanje povezati s konkretnim pojmom iz cjeline ili proširite opseg na cijeli udžbenik. Vanjske izvore nisam uključio.',
    source: 'Granica izvora · odgovor nije pronađen',
  }
  return { text: best.text, source: best.source }
}

function ConversationPreview({ content }: { content: ChapterContent }) {
  const [conversationType, setConversationType] = useState<'written' | 'voice' | null>(null)
  const [voiceScope, setVoiceScope] = useState<'topic' | 'chapter' | 'book'>('topic')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isAnswering, setIsAnswering] = useState(false)
  const [conversationError, setConversationError] = useState('')
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle')
  const [voiceError, setVoiceError] = useState('')
  const voicePeerRef = useRef<RTCPeerConnection | null>(null)
  const voiceChannelRef = useRef<RTCDataChannel | null>(null)
  const voiceStreamRef = useRef<MediaStream | null>(null)
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null)
  const voiceDisconnectTimerRef = useRef<number | null>(null)
  const voiceUserSpeakingRef = useRef(false)
  const voiceResponseActiveRef = useRef(false)
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
        : content.id === 9
          ? [
              'Izradi matricu rizika i predloži mjeru za svaki njezin kvadrant.',
              'Kako hotel treba uvesti virtualnog asistenta uz transparentnost i prijelaz na djelatnika?',
              'Zašto pametna destinacija ovisi više o upravljanju podacima nego o broju senzora?',
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

  const askQuestion = async (text: string) => {
    const cleanQuestion = text.trim()
    if (!cleanQuestion || isAnswering) return
    const currentHistory = messages
    setMessages((current) => [...current, { role: 'user', text: cleanQuestion }])
    setQuestion('')
    setConversationError('')
    setIsAnswering(true)
    try {
      const result = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: cleanQuestion, context: conversationContext(content, voiceScope), history: currentHistory }),
      })
      const payload = await result.json()
      if (!result.ok) throw new Error(payload?.error || 'Odgovor trenutačno nije dostupan.')
      const answer = { text: String(payload.text), source: String(payload.source || 'Odabrani izvor udžbenika') }
      setMessages((current) => [...current, { role: 'assistant', ...answer }])
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : 'Razgovor trenutačno nije dostupan.')
    } finally {
      setIsAnswering(false)
    }
  }

  function closeVoiceConnection() {
    if (voiceDisconnectTimerRef.current !== null) {
      window.clearTimeout(voiceDisconnectTimerRef.current)
      voiceDisconnectTimerRef.current = null
    }
    voiceUserSpeakingRef.current = false
    voiceResponseActiveRef.current = false
    const channel = voiceChannelRef.current
    voiceChannelRef.current = null
    channel?.close()
    const peer = voicePeerRef.current
    voicePeerRef.current = null
    peer?.close()
    const stream = voiceStreamRef.current
    voiceStreamRef.current = null
    stream?.getTracks().forEach((track) => track.stop())
    const audio = voiceAudioRef.current
    voiceAudioRef.current = null
    if (audio) {
      audio.pause()
      audio.srcObject = null
    }
  }

  function stopVoiceConversation() {
    closeVoiceConnection()
    setVoiceStatus('idle')
    setVoiceError('')
  }

  function handleVoiceEvent(raw: string) {
    let event: {
      type?: string
      error?: { message?: string; code?: string; event_id?: string }
      response?: { status?: string; status_details?: { reason?: string } }
    }
    try {
      event = JSON.parse(raw)
    } catch {
      return
    }
    switch (event.type) {
      case 'input_audio_buffer.speech_started':
        voiceUserSpeakingRef.current = true
        setVoiceStatus('listening')
        setVoiceError('')
        break
      case 'input_audio_buffer.speech_stopped':
        voiceUserSpeakingRef.current = false
        setVoiceStatus('thinking')
        break
      case 'response.created':
        voiceResponseActiveRef.current = true
        setVoiceStatus('thinking')
        break
      case 'response.output_audio.delta':
      case 'response.audio.delta':
        setVoiceStatus('speaking')
        break
      case 'response.output_audio.done':
      case 'response.audio.done':
        if (!voiceUserSpeakingRef.current) setVoiceStatus('ready')
        break
      case 'response.done': {
        voiceResponseActiveRef.current = false
        const status = event.response?.status
        const reason = event.response?.status_details?.reason
        if (status === 'incomplete' && reason === 'max_output_tokens') {
          const channel = voiceChannelRef.current
          if (channel?.readyState === 'open') {
            channel.send(JSON.stringify({
              type: 'response.create',
              response: { instructions: 'Nastavi točno od mjesta na kojem je prethodni odgovor prekinut. Ne ponavljaj uvod ni već izrečene dijelove i dovrši započetu misao.' },
            }))
            setVoiceStatus('thinking')
            break
          }
        }
        setVoiceStatus(voiceUserSpeakingRef.current ? 'listening' : 'ready')
        break
      }
      case 'error':
        setVoiceError(event.error?.message || 'Došlo je do pogreške u glasovnoj sesiji.')
        // Realtime pogreška pojedinog događaja ne zatvara nužno sesiju.
        // Zadržavamo istu vezu i povijest dok je podatkovni kanal otvoren.
        setVoiceStatus(voiceChannelRef.current?.readyState === 'open' ? 'ready' : 'error')
        break
    }
  }

  async function startVoiceConversation() {
    if (!['idle', 'error'].includes(voiceStatus)) return
    setVoiceStatus('connecting')
    setVoiceError('')
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
        throw new Error('Ovaj preglednik ne podržava izravni glasovni razgovor.')
      }

      const peer = new RTCPeerConnection()
      voicePeerRef.current = peer
      const audio = document.createElement('audio')
      audio.autoplay = true
      audio.setAttribute('playsinline', '')
      voiceAudioRef.current = audio
      peer.ontrack = (event) => {
        audio.srcObject = event.streams[0] ?? new MediaStream([event.track])
        void audio.play().catch(() => undefined)
      }
      peer.onconnectionstatechange = () => {
        if (voicePeerRef.current !== peer) return
        if (peer.connectionState === 'connected') {
          if (voiceDisconnectTimerRef.current !== null) {
            window.clearTimeout(voiceDisconnectTimerRef.current)
            voiceDisconnectTimerRef.current = null
          }
          setVoiceError('')
          setVoiceStatus('ready')
          return
        }
        if (peer.connectionState === 'disconnected') {
          if (voiceDisconnectTimerRef.current !== null) return
          setVoiceStatus('connecting')
          voiceDisconnectTimerRef.current = window.setTimeout(() => {
            voiceDisconnectTimerRef.current = null
            if (voicePeerRef.current !== peer || peer.connectionState !== 'disconnected') return
            setVoiceError('Glasovna veza nije se uspjela obnoviti. Pokrenite razgovor ponovno.')
            setVoiceStatus('error')
            closeVoiceConnection()
          }, 8000)
          return
        }
        if (peer.connectionState === 'failed') {
          setVoiceError('Glasovna veza je prekinuta. Pokrenite razgovor ponovno.')
          setVoiceStatus('error')
          closeVoiceConnection()
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      voiceStreamRef.current = stream
      stream.getTracks().forEach((track) => peer.addTrack(track, stream))

      const channel = peer.createDataChannel('oai-events')
      voiceChannelRef.current = channel
      channel.onopen = () => setVoiceStatus('ready')
      channel.onmessage = (event) => handleVoiceEvent(event.data)
      channel.onclose = () => {
        if (voiceChannelRef.current !== channel) return
        voiceChannelRef.current = null
        if (voicePeerRef.current === peer && peer.connectionState !== 'closed') {
          setVoiceError('Veza s glasovnim AI vodičem je zatvorena. Pokrenite razgovor ponovno.')
          setVoiceStatus('error')
          closeVoiceConnection()
        }
      }
      channel.onerror = () => {
        if (voiceChannelRef.current === channel) {
          setVoiceError('Došlo je do poteškoće u glasovnoj vezi. Pokušavam zadržati razgovor aktivnim.')
        }
      }

      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      if (!offer.sdp) throw new Error('Preglednik nije stvorio valjanu glasovnu vezu.')

      const response = await fetch('/api/realtime-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sdp: offer.sdp,
          context: conversationContext(content, voiceScope),
          scopeLabel: `${selectedScope.label} · ${selectedScope.title}`,
        }),
      })
      if (!response.ok) {
        const raw = await response.text()
        let message = 'Glasovnu sesiju trenutačno nije moguće pokrenuti.'
        try {
          const payload = JSON.parse(raw)
          if (typeof payload?.error === 'string') message = payload.error
        } catch {
          if (raw.trim()) message = raw.replace(/\s+/g, ' ').slice(0, 180)
        }
        throw new Error(message)
      }
      await peer.setRemoteDescription({ type: 'answer', sdp: await response.text() })
    } catch (error) {
      closeVoiceConnection()
      setVoiceError(error instanceof Error ? error.message : 'Glasovni razgovor nije bilo moguće pokrenuti.')
      setVoiceStatus('error')
    }
  }

  function interruptVoiceAnswer() {
    const channel = voiceChannelRef.current
    if (!channel || channel.readyState !== 'open') return
    if (voiceResponseActiveRef.current) channel.send(JSON.stringify({ type: 'response.cancel' }))
    channel.send(JSON.stringify({ type: 'output_audio_buffer.clear' }))
    voiceResponseActiveRef.current = false
    setVoiceStatus('ready')
  }

  function closeConversation() {
    if (conversationType === 'voice') stopVoiceConversation()
    setConversationType(null)
  }

  useEffect(() => () => closeVoiceConnection(), [])

  const voiceActive = ['ready', 'listening', 'thinking', 'speaking'].includes(voiceStatus)

  return <>
    <div className="section-heading"><span className="eyebrow">RAZGOVARAJ · ODABERITE NAČIN</span><h2>Pismeni ili usmeni razgovor</h2><p>Oba načina poštuju istu hijerarhiju provjerenih izvora. U usmenom razgovoru možete proširiti opseg od odabrane teme do cijeloga udžbenika.</p></div>

    <div className="conversation-mode-selector" role="group" aria-label="Odaberite način razgovora">
      <button type="button" onClick={() => setConversationType('written')} aria-haspopup="dialog" aria-label="Otvori pismeni razgovor u skočnom prozoru">
        <span className="conversation-mode-icon"><Keyboard /></span><span><strong>Pismeni razgovor</strong><small>Postavite pitanje i nastavite razgovor</small></span>
      </button>
      <button type="button" onClick={() => setConversationType('voice')} aria-haspopup="dialog" aria-label="Otvori usmeni razgovor u skočnom prozoru">
        <span className="conversation-mode-icon"><Mic /></span><span><strong>Usmeni razgovor</strong><small>Govorite i poslušajte odgovor</small></span>
      </button>
    </div>

    {conversationType && <ConversationModal type={conversationType} onClose={closeConversation}>
      {conversationType === 'written' ? <div className="conversation-layout" id="written-conversation">
        <section className="conversation-rules"><div className="conversation-icon"><Bot /></div><span className="eyebrow">PISMENI RAZGOVOR · PRAVILA</span><h3>Vodič neće nagađati</h3><ul><li><CheckCircle2 />Najprije odgovara iz kanonskog izvora 1.0.</li><li><CheckCircle2 />Urednički sloj označava datumom i izvorom.</li><li><CheckCircle2 />Kada nema pouzdane osnove, to jasno kaže.</li></ul><div className="conversation-source-summary"><BookOpen /><span><small>Početni opseg</small><strong>Cijela cjelina {content.id}</strong></span></div></section>
        <section className="prompt-preview"><span className="eyebrow">PRIMJERI PITANJA</span><div>{prompts.map((prompt) => <button key={prompt} onClick={() => void askQuestion(prompt)} disabled={isAnswering}><MessageCircle />{prompt}</button>)}</div><ConversationHistory messages={messages} />{isAnswering && <div className="conversation-empty"><Bot /><span>AI vodič oblikuje odgovor iz odabranih izvora…</span></div>}{conversationError && <p className="conversation-boundary"><LockKeyhole /><span><strong>Razgovor nije dovršen.</strong> {conversationError}</span></p>}<form className="conversation-composer" onSubmit={(event) => { event.preventDefault(); void askQuestion(question) }}><label htmlFor="chapter-question">Vaše pitanje</label><div><input id="chapter-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Upišite pitanje o ovoj cjelini…" autoComplete="off" disabled={isAnswering} /><button type="submit" disabled={!question.trim() || isAnswering} aria-label="Pošalji pitanje"><Send /></button></div></form><small>Odgovor oblikuje AI isključivo iz sadržaja odabranog opsega. Vanjski izvori nisu automatski uključeni.</small></section>
      </div> : <section className="voice-conversation" id="voice-conversation">
        <div className="voice-heading"><div><span className="eyebrow">USMENI RAZGOVOR · IZRAVNI DIJALOG</span><h3>Razgovarajte prirodno s AI vodičem</h3><p>Odaberite opseg i pokrenite razgovor. Vodič vas sluša, odgovara prirodnim glasom i automatski prepušta riječ kada ponovno progovorite.</p></div><div className={`voice-status ${voiceStatus !== 'idle' ? 'active' : ''}`}><Mic /><span><small>Status razgovora</small><strong>{voiceStatusText[voiceStatus]}</strong></span></div></div>

        <div className="voice-scope-selector" role="radiogroup" aria-label="Odaberite opseg izvora za usmeni razgovor">
          {voiceScopes.map((scope, index) => <button key={scope.key} className={voiceScope === scope.key ? 'active' : ''} onClick={() => setVoiceScope(scope.key)} role="radio" aria-checked={voiceScope === scope.key} disabled={voiceActive || voiceStatus === 'connecting'}>
            <span className="scope-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{scope.label}</strong><em>{scope.title}</em><small>{scope.description}</small><b>{scope.source}</b></span><CheckCircle2 />
          </button>)}
        </div>

        <div className={`voice-console voice-${voiceStatus}`}>
          <div className="voice-orb"><Mic /></div>
          <div className="voice-console-copy"><span className="eyebrow">ODABRANI OPSEG</span><h3>{selectedScope.label}</h3><p>{selectedScope.description}</p><div className="voice-source-layers"><span><BookOpen />Kanonski tekst 1.0</span><span><Sparkles />Datirani urednički dodatci</span></div></div>
          <div className="voice-action">
            {!voiceActive ? <button type="button" onClick={() => void startVoiceConversation()} disabled={voiceStatus === 'connecting'}><Mic /> {voiceStatus === 'connecting' ? 'Povezujem…' : 'Pokreni razgovor'}</button> : <>
              {(voiceStatus === 'speaking' || voiceStatus === 'thinking') && <button type="button" className="interrupt" onClick={interruptVoiceAnswer}>Prekini odgovor</button>}
              <button type="button" className="stop" onClick={stopVoiceConversation}>Završi razgovor</button>
            </>}
            <small>{voiceActive ? 'Govorite čim želite. Novi govorni potez automatski prekida odgovor AI vodiča.' : 'Preglednik će jednom zatražiti dopuštenje za mikrofon.'}</small>
          </div>
        </div>

        {voiceError && <p className="conversation-boundary voice-error"><LockKeyhole /><span><strong>Razgovor nije nastavljen.</strong> {voiceError}</span></p>}
        <p className="voice-privacy"><LockKeyhole /> Zvuk se prenosi samo tijekom aktivnoga razgovora i ne prikazuje se transkript. Vanjski izvori nisu automatski uključeni.</p>
      </section>}
    </ConversationModal>}
  </>
}

function ConversationHistory({ messages }: { messages: ConversationMessage[] }) {
  if (!messages.length) return <div className="conversation-empty"><MessageCircle /><span>Razgovor će se prikazati ovdje.</span></div>
  return <div className="conversation-history" aria-live="polite">{messages.map((message, index) => {
    const paragraphs = plainConversationText(message.text).split(/\n{2,}/).filter(Boolean)
    return <article key={`${message.role}-${index}`} className={message.role}><strong>{message.role === 'user' ? 'Vi' : 'AI vodič'}</strong>{paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}{message.source && <small><BookOpen />{plainConversationText(message.source)}</small>}</article>
  })}</div>
}

function plainConversationText(value: string) {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
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
  const score = useMemo(() => content.questions.filter((q, i) => answers[i] === q.correct).length, [answers, content.questions])
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === content.questions.length
  const reset = () => setAnswers({})
  return <>
    <div className="section-heading"><span className="eyebrow">PROVJERI · 5 PITANJA</span><h2>Samoprovjera cjeline</h2><p>Odaberite jedan odgovor. Odmah ćete vidjeti točan odgovor i njegovo obrazloženje.</p></div>
    <div className="quiz-list">{content.questions.map((q, qIndex) => {
      const answered = answers[qIndex] !== undefined
      const selectedAnswer = answers[qIndex]
      return <article className="quiz-card" key={q.question}>
        <div className="quiz-title"><span>{qIndex + 1}</span><h3>{q.question}</h3></div>
        <div className="answers">{q.options.map((option, optionIndex) => {
          const answerState = answered
            ? optionIndex === q.correct
              ? 'correct'
              : selectedAnswer === optionIndex
                ? 'wrong'
                : ''
            : ''
          return <label key={option} className={answerState}>
            <input
              type="radio"
              name={`q-${content.id}-${qIndex}`}
              checked={selectedAnswer === optionIndex}
              disabled={answered}
              onChange={() => setAnswers((current) => ({ ...current, [qIndex]: optionIndex }))}
            />
            {option}
          </label>
        })}</div>
        {answered && <div className="explanation" role="status">
          <strong>{selectedAnswer === q.correct ? 'Točno.' : 'Točan odgovor označen je zeleno.'}</strong>
          <span><strong>Obrazloženje:</strong> {q.explanation}</span>
        </div>}
      </article>
    })}</div>
    <div className="quiz-actions">{allAnswered ? <><div className="score"><strong>{score} / {content.questions.length}</strong><span>{score >= 4 ? 'Vrlo dobro razumijevanje cjeline.' : 'Preporuka: vratite se na korake koje treba ponoviti.'}</span></div><button className="primary-button" onClick={reset}><RotateCcw /> Ponovi</button></> : <div className="quiz-progress" aria-live="polite">Odgovoreno: <strong>{answeredCount} / {content.questions.length}</strong></div>}</div>
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

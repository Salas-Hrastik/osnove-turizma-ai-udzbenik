import type { ChapterSummary, PilotChapter } from '../types'

export const book = {
  title: 'Osnove turizma i ugostiteljstva',
  author: 'prof. dr. sc. Drago Ružić',
  publisher: 'Veleučilište Baltazar',
  canonicalVersion: '1.0',
  canonicalDate: '3. kolovoza 2026.',
}

export const chapters: ChapterSummary[] = [
  { id: 1, title: 'Uvod u turizam i ugostiteljstvo', pages: '6–11', outcome: 'Definirati temeljne pojmove, razlikovati statističke kategorije putnika te objasniti odnos turizma i ugostiteljstva.', status: 'pilot' },
  { id: 2, title: 'Povijesni razvoj turizma', pages: '12–16', outcome: 'Objasniti razvojne faze putovanja i prepoznati preduvjete nastanka masovnog turizma.', status: 'planned' },
  { id: 3, title: 'Turistički motivi i ponašanje potražnje', pages: '17–21', outcome: 'Analizirati motive turista pomoću psiholoških i socioloških modela.', status: 'planned' },
  { id: 4, title: 'Oblici i vrste turizma', pages: '22–25', outcome: 'Klasificirati oblike turizma i procijeniti prikladnost specijalizacije destinacije.', status: 'planned' },
  { id: 5, title: 'Turističko tržište i poslovno posredovanje', pages: '26–29', outcome: 'Objasniti mehanizme ponude i potražnje te izračunati učinke distribucijskog miksa.', status: 'planned' },
  { id: 6, title: 'Ugostiteljstvo — operacije i poslovni modeli', pages: '30–35', outcome: 'Primijeniti operativne pokazatelje i usporediti poslovne modele u hotelijerstvu.', status: 'planned' },
  { id: 7, title: 'Učinci turizma', pages: '36–40', outcome: 'Procijeniti gospodarske, društveno-kulturne i ekološke učinke turizma.', status: 'planned' },
  { id: 8, title: 'Održivi razvoj i strateško upravljanje destinacijom', pages: '41–45', outcome: 'Kritički prosuditi strategije održivosti i sustave certificiranja.', status: 'planned' },
  { id: 9, title: 'Otpornost, tehnologija i suvremeni trendovi', pages: '46–49', outcome: 'Vrednovati primjenu digitalnih tehnologija i planirati odgovor na krizu.', status: 'planned' },
  { id: 10, title: 'Zaključna sinteza — integracija, etika i budućnost', pages: '50–51', outcome: 'Integrirati koncepte i argumentirati etičke dileme razvoja turizma.', status: 'planned' },
  { id: 11, title: 'Završna samoprovjera znanja', pages: '30 pitanja', outcome: 'Integrirati znanje iz svih deset cjelina i prepoznati područja koja treba ponoviti.', status: 'assessment' },
]

export const pilot: PilotChapter = {
  ...chapters[0],
  summary: 'Turizam i ugostiteljstvo međusobno su isprepleteni, ali pojmovno različiti sustavi. Cjelina uvodi međunarodno usklađene statističke kategorije, Leiperov sustavni model i aktualnu sliku hrvatskog turističkog sustava na temelju službenih podataka za 2025. godinu.',
  outcomes: [
    'razlikovati putnika, posjetitelja, turista i izletnika',
    'objasniti turizam kao otvoreni sustav prema Leiperovu modelu',
    'razgraničiti turizam kao širi sustav od ugostiteljstva kao djelatnosti',
    'protumačiti službene pokazatelje i njihova metodološka ograničenja',
  ],
  keywords: [
    { term: 'Turizam', definition: 'Aktivnosti osoba koje putuju i borave izvan svoje uobičajene sredine kraće od jedne godine, bez zapošljavanja kod subjekta u mjestu posjeta.' },
    { term: 'Putnik', definition: 'Svaka osoba koja se kreće između dviju geografskih lokacija, neovisno o svrsi.' },
    { term: 'Posjetitelj', definition: 'Putnik izvan uobičajene sredine kraće od 12 mjeseci, čija glavna svrha nije zaposlenje u mjestu posjeta.' },
    { term: 'Turist', definition: 'Posjetitelj koji ostvaruje najmanje jedno noćenje.' },
    { term: 'Izletnik', definition: 'Posjetitelj koji se vraća bez ostvarenog noćenja.' },
    { term: 'Uobičajena sredina', definition: 'Područje u kojem pojedinac obavlja redovite životne rutine.' },
    { term: 'Ugostiteljstvo', definition: 'Djelatnost smještaja te pripreme i usluživanja hrane, pića i napitaka.' },
    { term: 'Destinacija', definition: 'Prostor s atrakcijama, uslugama i upravljačkom strukturom koji posjetitelj doživljava kao cjelinu.' },
    { term: 'Turistički proizvod', definition: 'Spoj atrakcija, usluga, infrastrukture i doživljaja koji zadovoljava turističke potrebe.' },
    { term: 'Lanac vrijednosti', definition: 'Mreža dionika koji doprinose stvaranju konačnog turističkog iskustva.' },
  ],
  steps: [
    {
      title: 'Razgraniči mobilnost i turizam',
      body: 'Nije svako putovanje turizam. Da bi se kretanje statistički smatralo turističkim, istodobno moraju biti ispunjeni prostorni, vremenski i svrhovni uvjet.',
      points: [
        'Prostorni uvjet: osoba napušta svoju uobičajenu sredinu.',
        'Vremenski uvjet: boravak traje kraće od jedne godine.',
        'Uvjet svrhe: osoba se ne zapošljava kod subjekta u mjestu posjeta.',
        'Posjetitelj s najmanje jednim noćenjem jest turist; bez noćenja jest izletnik.',
      ],
      takeaway: 'Najprije utvrdite ulazi li osoba u statistički obuhvat posjetitelja, a tek zatim je razvrstajte kao turista ili izletnika.',
      source: 'Kanonski izvor 1.0, str. 7–8',
    },
    {
      title: 'Promatraj turizam kao sustav',
      body: 'Leiperov model prikazuje turizam kao otvoreni sustav: turist se kreće iz emitivne regije, tranzitnom rutom, prema receptivnoj regiji, uz potporu turističke industrije.',
      points: [
        'Turist je ljudski element i pokretač sustava.',
        'Geografski elementi su emitivna regija, tranzitna ruta i receptivna regija.',
        'Turistička industrija omogućuje putovanje, boravak i doživljaj.',
        'Promjena tečaja, prometne povezanosti ili sigurnosti izvan destinacije može promijeniti njezin rezultat.',
      ],
      takeaway: 'Destinacija nikada ne posluje izolirano: njezina potražnja ovisi i o uvjetima na polazištu i putu turista.',
      source: 'Kanonski izvor 1.0, str. 8; Leiper, 1979.',
    },
    {
      title: 'Razlikuj turizam i ugostiteljstvo',
      body: 'Ugostiteljstvo je ključna djelatnost unutar turizma, ali ta dva pojma nisu istoznačna. Ugostiteljstvo služi i turistima i lokalnom stanovništvu, dok turizam obuhvaća širi lanac vrijednosti.',
      points: [
        'Ugostiteljstvo pruža smještaj te priprema i uslužuje hranu, piće i napitke.',
        'Turistički sustav uključuje i promet, posrednike, atrakcije, trgovinu i javnu infrastrukturu.',
        'Turistički proizvod nastaje povezivanjem materijalnih i nematerijalnih elemenata.',
        'Menadžer upravlja dijelom ukupnog doživljaja, pa kvaliteta zahtijeva suradnju dionika.',
      ],
      takeaway: 'Vrhunska pojedinačna usluga ne može sama nadomjestiti slabosti cijeloga destinacijskog lanca vrijednosti.',
      source: 'Kanonski izvor 1.0, str. 8–9',
    },
    {
      title: 'Tumači pokazatelje prije odluke',
      body: 'Službeni podatak dobiva značenje tek kada znamo tko ga je objavio, na koje se razdoblje odnosi, što obuhvaća i kako je izračunan.',
      points: [
        'Hrvatska je 2025. u komercijalnom smještaju ostvarila 20,7 milijuna dolazaka i 94,8 milijuna noćenja.',
        'Prosjek od 4,6 noćenja po dolasku odražava strukturu odmorišnog, obiteljskog i kampističkog turizma.',
        'DZS-ovi podaci ne uključuju nekomercijalni promet i broje dolaske, a ne jedinstvene osobe.',
        'Prostorna koncentracija, ovisnost o emitivnim tržištima i struktura smještaja važniji su od same veličine prometa.',
      ],
      takeaway: 'Pokazatelj koji odaberemo usmjerava odluke: broj noćenja potiče obujam, a prihod, zadovoljstvo stanovnika i sezonska raspodjela potiču drukčiju politiku.',
      source: 'Kanonski izvor 1.0, str. 9–11; DZS, 2026.',
    },
  ],
  dataSnapshot: [
    { label: 'Dolasci', value: '20,7 mil.', change: '+2,2 %' },
    { label: 'Noćenja', value: '94,8 mil.', change: '+1,2 %' },
    { label: 'Noćenja po dolasku', value: '4,6' },
    { label: 'Udio stranih noćenja', value: '90,3 %' },
  ],
  appliedActivity: {
    title: 'Od podatka do upravljačke odluke',
    intro: 'Destinacija „Grad X” ostvarila je 45 000 dolazaka i 225 000 noćenja: hoteli 15 000 / 45 000, kampovi 8 000 / 48 000, privatni smještaj 22 000 / 132 000.',
    tasks: [
      'Izračunajte prosječnu duljinu boravka za svaku vrstu smještaja i destinaciju u cjelini.',
      'Usporedite rezultat destinacije s hrvatskim prosjekom od 4,6 noćenja po dolasku.',
      'Objasnite zašto najveći broj noćenja ne mora značiti i najveću dodanu vrijednost.',
    ],
    note: 'Didaktički konstruirano — podaci za Grad X ilustrativni su i ne smiju se citirati kao empirijski dokaz.',
  },
  editorialUpdate: {
    title: 'Promet nije isto što i vrijednost',
    checkedAt: '4. kolovoza 2026.',
    body: 'Službena godišnja osnova DZS-a za 2025. potvrđuje blag rast prometa, ali sama veličina dolazaka i noćenja ne govori koliko je vrijednosti ostalo u destinaciji niti kako je turizam utjecao na stanovnike, okoliš i sezonsku ravnotežu.',
    implications: [
      'Uz promet pratite prihod i dodanu vrijednost po noćenju.',
      'Rezultate promatrajte prostorno, sezonski i prema vrsti smještaja.',
      'U upravljačku sliku uključite zadovoljstvo stanovnika i opterećenje infrastrukture.',
    ],
  },
  sources: [
    { label: 'Kanonski izvor 1.0', detail: 'Osnove turizma i ugostiteljstva, str. 6–11' },
    { label: 'Državni zavod za statistiku', detail: 'TUR-2025-1-2, objavljeno 26. veljače 2026.', url: 'https://podaci.dzs.hr/2025/hr/97093' },
    { label: 'UN Tourism', detail: 'International tourist arrivals, objavljeno 20. siječnja 2026.', url: 'https://www.unwto.org/news/international-tourist-arrivals-up-4%25-in-2025-reflecting-strong-travel-demand-around-the-world' },
  ],
  questions: [
    { question: 'Koja osobina razlikuje turista od izletnika?', options: ['Svrha odmora', 'Najmanje jedno noćenje', 'Putovanje u inozemstvo', 'Plaćena usluga'], correct: 1, explanation: 'Turist ostvaruje najmanje jedno noćenje, dok se izletnik vraća istoga dana.' },
    { question: 'Što nije dio Leiperova sustavnog modela?', options: ['Emitivna regija', 'Tranzitna ruta', 'Receptivna regija', 'Cjenik hotelskih soba'], correct: 3, explanation: 'Model obuhvaća turista, geografske elemente i turističku industriju, a ne pojedinačni cjenik.' },
    { question: 'Zašto ugostiteljstvo i turizam nisu istoznačnice?', options: ['Ugostiteljstvo postoji samo ljeti', 'Turizam ne uključuje hranu', 'Ugostiteljstvo služi i lokalnom stanovništvu, a turizam je širi sustav', 'Turizam je samo statistička kategorija'], correct: 2, explanation: 'Ugostiteljstvo je djelatnost unutar širega turističkog sustava i posluje i izvan turističke potražnje.' },
    { question: 'Koliki je bio prosječan broj noćenja po dolasku u Hrvatskoj 2025.?', options: ['2,1', '3,4', '4,6', '7,2'], correct: 2, explanation: 'DZS je za komercijalni smještaj zabilježio prosjek od 4,6 noćenja po dolasku.' },
    { question: 'Koje metodološko ograničenje vrijedi za navedene podatke DZS-a?', options: ['Obuhvaćaju samo strane goste', 'Obuhvaćaju komercijalni smještaj', 'Ne razlikuju dolaske i noćenja', 'Odnose se samo na hotele'], correct: 1, explanation: 'Navedeni podaci odnose se na komercijalni smještaj; nekomercijalni promet prati se odvojeno.' },
  ],
}

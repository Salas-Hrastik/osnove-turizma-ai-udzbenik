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
    { title: 'Razgraniči mobilnost i turizam', body: 'Turizam postoji kada su zajedno ispunjeni prostorni, vremenski i svrhovni uvjet. Posjetitelji se dijele na turiste s noćenjem i izletnike bez noćenja.', source: 'Kanonski izvor 1.0, str. 7–8' },
    { title: 'Promatraj turizam kao sustav', body: 'Leiperov model povezuje turista, emitivnu regiju, tranzitnu rutu, receptivnu regiju i turističku industriju. Promjena u jednome dijelu utječe na cijeli sustav.', source: 'Kanonski izvor 1.0, str. 8–9' },
    { title: 'Razlikuj turizam i ugostiteljstvo', body: 'Ugostiteljstvo je ključna djelatnost unutar turizma, ali služi i lokalnom stanovništvu. Turizam je širi sustav koji uključuje promet, atrakcije, posrednike i javnu infrastrukturu.', source: 'Kanonski izvor 1.0, str. 9' },
    { title: 'Tumači pokazatelje prije odluke', body: 'Hrvatska je 2025. ostvarila 20,7 milijuna dolazaka i 94,8 milijuna noćenja u komercijalnom smještaju. Brojke treba čitati uz metodologiju, prostornu koncentraciju i strukturu smještaja.', source: 'Kanonski izvor 1.0, str. 9–11; DZS, 2026.' },
  ],
  questions: [
    { question: 'Koja osobina razlikuje turista od izletnika?', options: ['Svrha odmora', 'Najmanje jedno noćenje', 'Putovanje u inozemstvo', 'Plaćena usluga'], correct: 1, explanation: 'Turist ostvaruje najmanje jedno noćenje, dok se izletnik vraća istoga dana.' },
    { question: 'Što nije dio Leiperova sustavnog modela?', options: ['Emitivna regija', 'Tranzitna ruta', 'Receptivna regija', 'Cjenik hotelskih soba'], correct: 3, explanation: 'Model obuhvaća turista, geografske elemente i turističku industriju, a ne pojedinačni cjenik.' },
    { question: 'Zašto ugostiteljstvo i turizam nisu istoznačnice?', options: ['Ugostiteljstvo postoji samo ljeti', 'Turizam ne uključuje hranu', 'Ugostiteljstvo služi i lokalnom stanovništvu, a turizam je širi sustav', 'Turizam je samo statistička kategorija'], correct: 2, explanation: 'Ugostiteljstvo je djelatnost unutar širega turističkog sustava i posluje i izvan turističke potražnje.' },
    { question: 'Koliki je bio prosječan broj noćenja po dolasku u Hrvatskoj 2025.?', options: ['2,1', '3,4', '4,6', '7,2'], correct: 2, explanation: 'DZS je za komercijalni smještaj zabilježio prosjek od 4,6 noćenja po dolasku.' },
    { question: 'Koje metodološko ograničenje vrijedi za navedene podatke DZS-a?', options: ['Obuhvaćaju samo strane goste', 'Obuhvaćaju komercijalni smještaj', 'Ne razlikuju dolaske i noćenja', 'Odnose se samo na hotele'], correct: 1, explanation: 'Navedeni podaci odnose se na komercijalni smještaj; nekomercijalni promet prati se odvojeno.' },
  ],
}

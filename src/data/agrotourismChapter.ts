import type { ChapterContent, ChapterMedia, ChapterSummary, PresentationSlide } from '../types'

const storageBase = 'https://oltrjqqkczqkzxuqwxcr.supabase.co/storage/v1/object/public/otu-aiu-media'

function publicObjectUrl(path: string) {
  return `${storageBase}/${path.split('/').map(encodeURIComponent).join('/')}`
}

const slideEntries: ReadonlyArray<readonly [string, string]> = [
  ['Agroturizam: hrvatski strateški nacrt', 'Naslovni slajd agroturizam prikazuje kao spoj tradicije, ugostiteljstva, poljoprivrede i održivog poslovnog modela. Razvojni put vodi od autentičnog resursa do registrirane i tržišno dostupne usluge.'],
  ['Most između urbanog stresa i ruralnog mira', 'Suvremeni motiv povratka prirodi povezuje psihološku obnovu s društvenom i pedagoškom vrijednošću sela. Povijesni primjeri podsjećaju da je dodatni prihod od turizma od početka služio očuvanju ruralnog prostora.'],
  ['Arhitektura pojmova', 'Ruralni turizam je najširi prostorni pojam, seoski turizam uži je prema ambijentu, a agroturizam traži aktivno poljoprivredno gospodarstvo. Ta hijerarhija sprječava da se svaka kuća za odmor na selu pogrešno nazove agroturizmom.'],
  ['Psihologija domaćina', 'Agroturizam je emotivan i radno intenzivan posao u kojem se preklapaju uloge poljoprivrednika, kuhara, recepcionara, vodiča i menadžera. Ispravna motivacija počiva na baštini, proizvodnji i dugoročnom obiteljskom opredjeljenju.'],
  ['Odabir tržišnog modela', 'Matrica razlikuje agroturizam, kušaonicu, kuću za odmor, B&B, ruralni hotel i kamp prema primarnoj djelatnosti, poljoprivrednom uvjetu, smještaju i prehrani. Odabir modela mora slijediti stvarne resurse i kompetencije domaćina.'],
  ['Difuzni hotel', 'Raspršene tradicijske kuće mogu tvoriti jedinstven hotelski sustav sa zajedničkom recepcijom i servisima. Model istodobno revitalizira napuštene građevine, čuva vizuru naselja i distribuira korist kroz zajednicu.'],
  ['Sadržaj se prilagođava arhitekturi', 'Izvorni gabariti i funkcija prostora trebaju odrediti kapacitet i sadržaj. Pretjerano povećanje objekta radi kratkoročnog prihoda može uništiti ambijentalnost koja je bila glavni razlog dolaska.'],
  ['Četiri stupa kvalitete doživljaja', 'Komfor, gastronomija, autentičnost i aktivan odmor zajedno čine cjelovitu vrijednost. Tradicija bez čistoće i udobnosti nije kvaliteta, kao što ni luksuz bez lokalne proizvodnje nije agroturizam.'],
  ['Uređenje okoliša i ruralna senzorika', 'Autohtoni materijali, biljke, ograde i diskretna infrastruktura čuvaju identitet gospodarstva. Prirodne značajke živog sela dio su doživljaja, ali ne mogu biti opravdanje za neurednost ili higijenske propuste.'],
  ['Putokaz za registraciju', 'Pravni oblik ovisi o tome postoji li aktivan OPG te nude li se smještaj, hrana ili samo turističke aktivnosti. Prije ulaganja potrebno je provjeriti aktualne zakone, pravilnike i nadležna tijela.'],
  ['Kapaciteti i ograničenja', 'Slajd sažima pragove i pravila iz kanonskog teksta. Budući da su propisi promjenjivi, ove brojke treba koristiti kao obrazovni primjer i potvrditi u važećim službenim izvorima prije poslovne odluke.'],
  ['Sanitarni i tehnički minimumi', 'Odvajanje sirovina, temperaturni režimi, perive površine i prostorni minimumi štite gosta i domaćina. Tradicijska građevina može tražiti prilagodbu, ali ne uklanja odgovornost za sigurnost hrane i smještaja.'],
  ['Financijska arhitektura', 'Vlastita sredstva, krediti, nacionalne potpore i fondovi imaju različite uvjete, rokove i rizike. Financijska konstrukcija mora uključiti predfinanciranje, likvidnost i održavanje nakon završetka ulaganja.'],
  ['Vizija 2030.: održivost i kružno gospodarstvo', 'Kratki lanci opskrbe, brownfield obnova i obnovljivi izvori energije povezuju agroturizam s prostornom i sezonskom ravnotežom turizma. Ekološka tvrdnja vrijedi tek kada je potkrijepljena mjerljivim praksama.'],
  ['Čuvari djedovine', 'Završna poruka baštinu predstavlja kao obvezu i razvojni kapital. Agroturizam je uspješan kada modernu stručnost ugostiteljstva podredi očuvanju živog gospodarstva i ruralne zajednice.'],
]

const slides: PresentationSlide[] = slideEntries.map(([title, interpretation], index) => ({
  number: index + 1,
  title,
  image: `/media/posebni-interesi/agroturizam/slides/slide-${index + 1}.webp`,
  interpretation,
}))

const media: ChapterMedia = {
  audio: {
    title: 'Agroturizam između idile i birokracije',
    fileName: 'Agroturizam_izmedju_idile_i_birokracije.m4a',
    url: publicObjectUrl('Agro turizam/Agroturizam_izmedju_idile_i_birokracije.m4a'),
    duration: '18:51',
    description: 'Audio povezuje autentični ruralni doživljaj s radnim, tržišnim i administrativnim zahtjevima vođenja agroturističkog gospodarstva.',
  },
  video: {
    title: 'Budućnost agroturizma',
    fileName: 'Buducnost_agroturizma.mp4',
    url: publicObjectUrl('Agro turizam/Buducnost_agroturizma.mp4'),
    duration: '11:47',
    description: 'Video prikazuje razvoj agroturizma kroz održivost, obnovu baštine, lokalne lance vrijednosti i generacijsku revitalizaciju sela.',
    poster: '/media/posebni-interesi/agroturizam/video-poster.webp',
  },
  presentation: {
    title: 'Agroturizam: od vizije i tradicije do održivog poslovnog modela',
    fileName: 'Croatian_Agrotourism_Blueprint.pptx',
    url: publicObjectUrl('Agro turizam/Croatian_Agrotourism_Blueprint.pptx'),
    description: 'Petnaest slajdova obrađuje pojmove, domaćina, tržišne modele, prostor, kvalitetu, registraciju, financiranje i viziju razvoja do 2030.',
    slides,
  },
}

export const agrotourismChapterSummary: ChapterSummary = {
  id: 12,
  title: 'Vrste turizma posebnih interesa: Agroturizam',
  pages: '96–103',
  outcome: 'Razgraničiti agroturizam od širih ruralnih oblika, odabrati tržišni model gospodarstva te procijeniti ulogu domaćina, propisa i održivosti.',
  status: 'available',
}

export const agrotourismChapterContent: ChapterContent = {
  ...agrotourismChapterSummary,
  summary: 'Agroturizam je najuži oblik ruralnog turizma: turističke i ugostiteljske usluge pružaju se kao dopunska djelatnost na aktivnom poljoprivrednom gospodarstvu, a vlastita proizvodnja, domaćin i ruralni način života čine jezgru doživljaja. Njegova razvojna vrijednost obuhvaća dodatni prihod, očuvanje baštine, lokalne lance opskrbe i ostanak stanovništva, ali uspjeh zahtijeva radnu spremnost, tržišno jasan model i poštovanje promjenjivog regulatornog okvira.',
  outcomes: [
    'razlikovati ruralni turizam, seoski turizam i agroturizam',
    'procijeniti motive, kompetencije i višestruke uloge domaćina',
    'usporediti tržišne modele seoske ponude i odabrati primjeren model gospodarstva',
    'oblikovati održiv agroturistički proizvod uz provjeru aktualnih pravnih i sigurnosnih uvjeta',
  ],
  keywords: [
    { term: 'Ruralni turizam', definition: 'Najširi skup turističkih aktivnosti i usluga u ruralnom prostoru, neovisno o tome odvijaju li se na poljoprivrednom gospodarstvu.' },
    { term: 'Seoski turizam', definition: 'Turizam vezan uz ambijent sela, njegove manifestacije, gastronomiju, folklor, etnologiju i tradicijske zanate.' },
    { term: 'Agroturizam', definition: 'Turističke i ugostiteljske usluge kao dopunska djelatnost aktivnog poljoprivrednog gospodarstva, povezane s vlastitom proizvodnjom.' },
    { term: 'OPG', definition: 'Organizacijski oblik obiteljskog poljoprivrednog gospodarstva na kojem se može registrirati odgovarajuća dopunska djelatnost.' },
    { term: 'TSOG', definition: 'Turističko seosko obiteljsko gospodarstvo; naziv koji se u praksi koristi za agroturističko gospodarstvo.' },
    { term: 'Kušaonica', definition: 'Objekt usmjeren na degustaciju i interpretaciju određenog vlastitog ili lokalnog proizvoda, bez klasičnog punog restoranskog modela.' },
    { term: 'Difuzni hotel', definition: 'Jedinstveni smještajni sustav sastavljen od raspršenih tradicijskih kuća, zajedničke recepcije i servisnih sadržaja.' },
    { term: 'Kratki lanac opskrbe', definition: 'Izravno ili kratko povezivanje poljoprivrednog proizvođača i gosta, s manjim brojem posrednika i većom lokalnom vrijednošću.' },
    { term: 'Brownfield ulaganje', definition: 'Obnova i nova uporaba postojećeg napuštenog ili nedovoljno korištenog objekta umjesto gradnje na novom prostoru.' },
    { term: 'Autentičnost gospodarstva', definition: 'Vjerodostojan spoj aktivne proizvodnje, domaćina, prostora, hrane, običaja i svakodnevnog ruralnog života.' },
  ],
  steps: [
    {
      title: 'Razgraniči ruralno, seosko i agroturističko',
      body: 'Položaj na selu sam po sebi ne čini agroturizam. Ključna razlika jest aktivna poljoprivredna proizvodnja kojoj je turizam dopunska djelatnost.',
      points: ['Ruralni turizam obuhvaća sve turističke aktivnosti u ruralnom prostoru.', 'Seoski turizam vezan je uz ambijent sela i njegovu kulturnu i gospodarsku praksu.', 'Agroturizam se odvija na živom poljoprivrednom gospodarstvu.', 'Vlastita proizvodnja i kontakt s domaćinom čine razlikovni temelj doživljaja.'],
      takeaway: 'Svaki agroturizam jest ruralni turizam, ali svaki ruralni smještaj nije agroturizam.',
      source: 'Kanonski izvor 1.1, str. 96–97; Baćac, 2011.',
    },
    {
      title: 'Procijeni spremnost domaćina i gospodarstva',
      body: 'Domaćin gostu otvara dom i svakodnevicu te istodobno upravlja proizvodnjom, hranom, smještajem, animacijom i poslovanjem.',
      points: ['Pozitivni motivi uključuju aktivaciju resursa, plasman proizvoda, baštinu i samozapošljavanje.', 'Trend, brza zarada i poticaji sami nisu održiva poslovna motivacija.', 'Komunikativnost i tolerancija jednako su važne kao proizvodne i ugostiteljske vještine.', 'Autentičnost ne isključuje urednost, higijenu, sigurnost i privatnost obitelji.'],
      takeaway: 'Agroturizam nije pasivno iznajmljivanje, nego osobno i radno intenzivno domaćinstvo.',
      source: 'Kanonski izvor 1.1, str. 97–98.',
    },
    {
      title: 'Odaberi izvediv tržišni model',
      body: 'Agroturizam, kušaonica, ruralna kuća, B&B, difuzni hotel i kamp razlikuju se prema proizvodnji, uslugama i očekivanoj ulozi domaćina.',
      points: ['Klasični agroturizam povezuje živu proizvodnju, prehranu, aktivnosti i mogući smještaj.', 'Kušaonica gradi dubinu oko jednoga proizvoda i interpretacije njegova nastanka.', 'Ruralna kuća za odmor može čuvati arhitekturu, ali bez aktivne proizvodnje nije automatski agroturizam.', 'Difuzni hotel revitalizira raspršene kuće bez nove betonizacije.'],
      takeaway: 'Naziv proizvoda mora odgovarati stvarnoj djelatnosti, resursima i iskustvu koje gost dobiva.',
      source: 'Kanonski izvor 1.1, str. 98–100.',
    },
    {
      title: 'Poveži propise, kvalitetu i održivost',
      body: 'Registracija, kapaciteti, podrijetlo hrane, higijena i porezni tretman ovise o pravnom obliku i važećim pravilima, pa ih treba provjeriti prije ulaganja.',
      points: ['Kanonski tekst daje pregled pravno-fiskalnog okvira, ali propisi se mogu mijenjati.', 'Kratki lanci opskrbe povećavaju lokalnu vrijednost i sljedivost hrane.', 'Brownfield obnova i prilagodba sadržaja postojećoj arhitekturi čuvaju krajolik.', 'Energija, voda, otpad i učinak na zajednicu moraju imati mjerljive pokazatelje.'],
      takeaway: 'Održivi proizvod istodobno mora biti zakonit, siguran, tržišno održiv i vjerodostojno ruralan.',
      source: 'Kanonski izvor 1.1, str. 100–103; Strategija razvoja održivog turizma do 2030.',
    },
  ],
  dataSnapshot: [
    { label: 'Razina pojmovne hijerarhije', value: '3', change: 'ruralni · seoski · agroturizam' },
    { label: 'Uloge domaćina', value: '7', change: 'poljoprivreda · usluga · vođenje' },
    { label: 'Tržišni modeli', value: '6', change: 'gospodarstvo · kušaonica · kuća · B&B · hotel · kamp' },
    { label: 'Razvojni horizont', value: '2030.', change: 'održivost · kružnost · revitalizacija' },
  ],
  appliedActivity: {
    title: 'Od gospodarstva do agroturističkog proizvoda',
    intro: 'Odaberite postojeće ili zamišljeno hrvatsko poljoprivredno gospodarstvo i oblikujte tržišno, radno i prostorno izvediv proizvod.',
    tasks: ['Dokažite pripada li ponuda agroturizmu ili drugom obliku ruralnog turizma.', 'Odaberite tržišni model te odredite uloge članova domaćinstva.', 'Povežite vlastite proizvode, smještaj ili degustaciju i najmanje dvije aktivnosti gosta.', 'Navedite pravne uvjete koje treba provjeriti te pokazatelje lokalne vrijednosti, energije, vode i otpada.'],
    note: 'Kapacitet i program prilagodite stvarnoj proizvodnji, arhitekturi i vremenu domaćina; ne projektirajte gospodarstvo prema najvećem mogućem broju gostiju.',
  },
  editorialUpdate: {
    title: 'Regulatorni podatak mora imati datum provjere',
    checkedAt: '12. kolovoza 2026.',
    body: 'Kanonski tekst sadržava konkretne pragove registracije, kapaciteta, hrane i poreznog tretmana. Budući da se zakonodavni i provedbeni okvir mijenja, AI udžbenik te brojke koristi za učenje strukture problema, a prije stvarne poslovne odluke zahtijeva provjeru u važećim propisima i kod nadležnih tijela.',
    implications: ['Ne poistovjećivati kuću za odmor na selu s agroturizmom bez aktivne poljoprivredne proizvodnje.', 'Prije investicije provjeriti aktualni pravni oblik, dopunske djelatnosti, minimalne uvjete i porezni tretman.', 'Održivost dokazivati podrijetlom hrane, obnovom prostora i mjerljivim upravljanjem resursima.'],
  },
  sources: [
    { label: 'Kanonski tekst', detail: 'Osnove turizma i ugostiteljstva, poglavlje 11.2, str. 96–103' },
    { label: 'Baćac (2011)', detail: 'Priručnik za bavljenje seoskim turizmom: Korak po korak od ideje do uspješnog poslovanja' },
    { label: 'Strategija razvoja održivog turizma', detail: 'Ministarstvo turizma i sporta RH, razvojni okvir do 2030.' },
  ],
  questions: [
    { question: 'Koja je ključna razlika agroturizma od šireg ruralnog turizma?', options: ['Agroturizam se odvija samo na obali', 'Agroturizam je vezan uz aktivno poljoprivredno gospodarstvo i vlastitu proizvodnju', 'Ruralni turizam uvijek uključuje medicinske usluge', 'Agroturizam ne uključuje goste'], correct: 1, explanation: 'Agroturizam je najuži oblik, u kojem je turistička usluga dopuna živoj poljoprivrednoj proizvodnji.' },
    { question: 'Koji je motiv najmanje održiv za pokretanje agroturizma?', options: ['Plasman vlastitih proizvoda', 'Očuvanje obiteljske baštine', 'Očekivanje brze zarade samo zato što je djelatnost u trendu', 'Samozapošljavanje članova obitelji'], correct: 2, explanation: 'Agroturizam zahtijeva dugoročan rad i osobni angažman; trend i očekivanje brze zarade nisu dovoljna poslovna osnova.' },
    { question: 'Što je posebnost difuznog hotela?', options: ['Sve sobe moraju biti u novom neboderu', 'Raspršene tradicijske kuće posluju kao jedinstven smještajni sustav', 'Ne smije imati zajedničku recepciju', 'Mora se nalaziti u marini'], correct: 1, explanation: 'Difuzni hotel povezuje odvojene obnovljene objekte zajedničkom recepcijom i uslugama te čuva strukturu naselja.' },
    { question: 'Kako treba pristupiti konkretnim pravnim pragovima iz kanonskog teksta?', options: ['Smatrati ih trajno nepromjenjivima', 'Provjeriti ih u aktualnim službenim propisima prije stvarne odluke', 'Ignorirati sve propise', 'Primijeniti ih samo na hotele'], correct: 1, explanation: 'Zakoni i pravilnici mogu se mijenjati, pa obrazovni pregled nije zamjena za aktualnu službenu provjeru.' },
    { question: 'Koja kombinacija najbolje opisuje održiv agroturizam?', options: ['Nova gradnja, uvozna hrana i maksimalan kapacitet', 'Aktivna proizvodnja, kratki lanci, obnova baštine i mjerljivo upravljanje resursima', 'Samo digitalno oglašavanje', 'Odsutnost domaćina i lokalne zajednice'], correct: 1, explanation: 'Održivost povezuje gospodarstvo, lokalnu vrijednost, očuvanje prostora i odgovorno upravljanje energijom, vodom i otpadom.' },
  ],
  media,
}

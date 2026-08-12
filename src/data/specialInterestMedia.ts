import type { ChapterMedia, PresentationSlide } from '../types'

const storageBase = 'https://oltrjqqkczqkzxuqwxcr.supabase.co/storage/v1/object/public/otu-aiu-media'

function publicObjectUrl(path: string) {
  return `${storageBase}/${path.split('/').map(encodeURIComponent).join('/')}`
}

function slidesFor(slug: string, entries: ReadonlyArray<readonly [string, string]>): PresentationSlide[] {
  return entries.map(([title, interpretation], index) => ({
    number: index + 1,
    title,
    image: `/media/posebni-interesi/${slug}/slides/slide-${index + 1}.webp`,
    interpretation,
  }))
}

const culturalSlides = slidesFor('kulturni', [
  ['Od pasivne baštine do aktivnog doživljaja', 'Naslovni slajd postavlja razvojni smjer kulturnog turizma: resurs sam po sebi nije dovoljan, nego ga treba pretvoriti u aktivan, tržišno spreman i odgovorno vođen doživljaj.'],
  ['Dvije paradigme kulturnog turizma', 'Tehnička definicija olakšava mjerenje posjeta i aktivnosti, dok konceptualna polazi od motiva, učenja i kulturnih potreba. Zajedno omogućuju i statistički obuhvat i razumijevanje ponašanja gosta.'],
  ['Anatomija kulturno-turističkog proizvoda', 'Atrakcija postaje proizvod kada joj se pridruže interpretacija, smještaj, ugostiteljstvo, prijevoz i druge usluge. Prikazane vrste razlikuju se prema središnjem resursu i ulozi posjetitelja.'],
  ['Profil suvremenog kulturnog turista', 'Omnivorni kulturni turist spaja baštinu, događanja i kreativnost te ne prihvaća strogu podjelu na visoku i popularnu kulturu. Individualizirane potrebe traže fleksibilniji portfelj iskustava.'],
  ['Tri stupa globalnih trendova', 'Kvalitativna promjena potražnje, popularna i kreativna kultura te digitalna transformacija zajedno mijenjaju standard ponude. Digitalni kanal pritom prati cijeli put korisnika, a ne samo rezervaciju.'],
  ['Arhitektura participativnog turizma', 'Institucije, lokalna zajednica, turoperatori i posjetitelji imaju različite, ali povezane uloge. Financijski održiv proizvod nastaje tek kada se autentičnost, tržišni pristup i aktivno sudjelovanje usklade.'],
  ['Metodologija doživljaja: model 3S', 'Stories, Senses i Sophistication povezuju narativ, osjetila i inovativnu komunikaciju. Primjer Istra Inspirit pokazuje kako kontrolirana participacija može povijesnu temu učiniti emocionalno relevantnom.'],
  ['Potražnja za kulturnim turizmom u Hrvatskoj', 'TOMAS pokazatelji povezuju motive učenja, dnevnu potrošnju i konkretne točke nezadovoljstva. UNESCO oznaka povećava međunarodnu prepoznatljivost, ali ne uklanja potrebu za kvalitetnom signalizacijom i informacijama.'],
  ['Diskrepancija resursa i tržišne spremnosti', 'SWOT matrica upozorava da bogata baština i afirmirani imidž nisu jednaki tržišnoj spremnosti. Najveći jaz nastaje u suradnji, vještinama, operativnoj izvedbi i stabilnom financiranju.'],
  ['Operativna implementacija kulturnog turizma', 'Akcijski plan povezuje atlas atrakcija, itinerere, tržišnu distribuciju, partnerstva i edukaciju. Redoslijed pokazuje da promocija treba počivati na prethodno uređenom proizvodu i mreži dionika.'],
  ['Kreativne industrije kao katalizator inovacije', 'Dizajn, arhitektura i informacijska tehnologija mogu statični muzejski prostor pretvoriti u interaktivan prostor izvrsnosti. Tehnologija pritom treba pojačati značenje baštine, a ne ga potisnuti.'],
  ['Održivi balans i vizija 2030.', 'Završni slajd prikazuje trajnu napetost između zaštite i komercijalizacije. Održivost nije srednji kompromis bez kriterija, nego upravljanje koje čuva identitet i istodobno osigurava ekonomsku vitalnost.'],
])

const enogastronomicSlides = slidesFor('enogastronomski', [
  ['Od lokalne baštine do globalnog fenomena', 'Naslovni slajd enogastronomiju postavlja iznad biološke potrebe: hrana je kulturni kod, turistički motiv i mogući pokretač lokalne dodane vrijednosti.'],
  ['Koncept i utjecaj enogastronomije', 'Kultura, poljoprivreda i održivost čine povezani sustav. Turistički proizvod istodobno interpretira baštinu, skraćuje opskrbni lanac i podupire razvoj ruralnog gospodarstva.'],
  ['Spektar gastronomske motivacije', 'Model razlikuje nizak, umjeren i visok interes za gastronomiju. Intenzitet motiva određuje koliko su izbor destinacije, program putovanja i potrošnja podređeni hrani i piću.'],
  ['Matrica gastroturista', 'Dvije osi — tradicionalno nasuprot inovativnom te pasivno nasuprot aktivnom — stvaraju četiri profila. Matrica pomaže prilagoditi dubinu interpretacije, ambijent, participaciju i razinu eksperimentiranja.'],
  ['Tko je suvremeni gost?', 'DINKS, SINKS, empty nesters i baby boomers imaju različite životne okolnosti, ali mogu dijeliti visoku kupovnu moć. Foodie kultura dodatno povezuje gastronomiju s identitetom, hobijem i digitalnim dijeljenjem.'],
  ['Urbani, ruralni i obalni modeli destinacija', 'Gradovi se oslanjaju na restoransku scenu i tržnice, ruralna područja na model od polja do stola, a obala na ribarsku tradiciju i produljenje sezone. Isti resurs zato zahtijeva različit poslovni model.'],
  ['Gastronomski identitet i Michelinov efekt', 'Radar podsjeća da priznanje ovisi o sastojcima, tehnici, kreativnosti, dosljednosti i vrijednosti za cijenu. Michelin može snažno povećati vidljivost, ali destinacijski identitet ne smije ovisiti o jednoj oznaci.'],
  ['Hrvatska kao gastro-enološka princeza', 'Srednjoeuropski, orijentalni i mediteranski utjecaji stvaraju raznolik kulinarski identitet. Razvojni zadatak je tu raznolikost prevesti u prepoznatljive i dostupne proizvode izvan glavne sezone.'],
  ['Regionalno bogatstvo Hrvatske', 'Tablica povezuje autohtone namirnice, jela, vina i međunarodne markere po regijama. Vrijednost nastaje kada se popis rariteta pretvori u itinerer, interpretaciju i pouzdano iskustvo.'],
  ['Anatomija potražnje: Zagrebačka županija', 'Podaci studije slučaja pokazuju važnost lokalne hrane, vinarija, produljenja boravka i spremnosti na premijsku cijenu za održiv proizvod. Postotke treba čitati u granicama uzorka i metodologije istraživanja.'],
  ['Međunarodni primjeri', 'Primjeri iz Slovenije, Crne Gore i Sjeverne Makedonije pokazuju različite putove tržišne diferencijacije: sezonski jelovnik, vinski krajolik te spoj arhitekture i slow food pristupa.'],
  ['Održivi krug enogastronomije', 'Lokalna poljoprivreda opskrbljuje inovativno ugostiteljstvo, ono oblikuje turistički doživljaj, a potrošnja podupire zajednicu. Krug je održiv samo ako korist doista ostaje u lokalnom lancu.'],
  ['Strateške preporuke', 'Umrežavanje, autentičnost, digitalizacija i edukacija četiri su povezane poluge. Digitalna vinska karta ili QR jelovnik vrijede tek kada iza njih stoje dostupan proizvod, standardi i osposobljeni ljudi.'],
  ['Identitet na tanjuru', 'Završna poruka sažima enogastronomiju kao mehanizam očuvanja nasljeđa i stvaranja visoke lokalne vrijednosti. Autentičnost pritom nije zamrzavanje tradicije, nego njezina vjerodostojna suvremena interpretacija.'],
])

const nauticalSlides = slidesFor('nauticki', [
  ['Nautički turizam Hrvatske', 'Naslovni slajd najavljuje integralnu analizu tržišta, kapaciteta i održivosti. Nautički turizam promatra se kao sustav plovidbe, boravka, infrastrukture i lokalnih ekonomskih veza.'],
  ['Plovidba i socio-ekonomski sustav', 'Slajd odvaja tehničku funkciju plovila od višednevnog turističkog načina života. Kada plovilo postane primarni životni prostor gosta, kvaliteta ovisi o cijelom obalnom i lučkom sustavu.'],
  ['Četiri stupa hrvatskog nautičkog turizma', 'Jahting i čarter, međunarodni kruzing, domaći kruzing i riječni kruzing razlikuju se prema plovilu, tržištu, ruti i lokalno zadržanoj vrijednosti. Zajednička oznaka zato ne znači isti razvojni model.'],
  ['Ekosustav jahtinga i čartera', 'Vlastita plovila donose lojalnost i dulji boravak, dok čarter osigurava veću rotaciju. Pomak prema većim plovilima traži prilagodbu vezova, servisa i proizvoda, a ne automatsko širenje kapaciteta.'],
  ['Domaći i međunarodni kruzing', 'Mali domaći brodovi češće uključuju otoke i lokalne dobavljače, dok mega-kruzeri stvaraju velik, kratkotrajan pritisak na nekoliko luka. Upravljanje treba razlikovati ekonomski trag i prostorno opterećenje.'],
  ['Skriveni dragulj riječnog kruzinga', 'Dunav i Drava povezuju Vukovar, Ilok i Osijek s međunarodnim gostima visoke platežne moći. Zadržavanje potrošnje ovisi o kvalitetnim izletima prema vinarijama, baštini i Kopačkom ritu.'],
  ['Kapaciteti i financijska snaga luka', 'Regionalna usporedba razlikuje marine, sidrišta i suhe marine te pokazuje da broj vezova nije jedina mjera kapaciteta. Kvaliteta usluge i prihod po kapacitetu važni su za razvojnu prosudbu.'],
  ['Konkurentsko okruženje na Sredozemlju', 'Niža gustoća vezova može se tumačiti kao neiskorišten potencijal, ali i kao očuvana komparativna prednost. Odluka o rastu mora zato uključiti kvalitetu prostora i nosivi kapacitet.'],
  ['Središnja dilema: nosivi kapacitet', 'Ekonomski pritisak za nove vezove susreće ekološku granicu obale i livada posidonije. Zadovoljavanje svake potražnje može umanjiti upravo prirodnu osnovu nautičkog proizvoda.'],
  ['Konsolidirana SWOT analiza', 'Snage prirodnog resursa i tradicije suprotstavljene su sezonalnosti, administrativnim preprekama i neujednačenim standardima. Prilike zelene tehnologije i brodogradnje prate klimatski i prostorni rizici.'],
  ['Pravna i ekološka harmonizacija', 'Usklađeni pojmovi, javni status pomorskog dobra i mjerljivi okolišni standardi stvaraju pravnu sigurnost. ISO sustavi i nadzor otpada vrijede samo uz dosljednu provedbu na terenu.'],
  ['Pametna infrastruktura', 'Prioritet je obnova postojećih luka, prilagodba vezova većim plovilima i zelena oprema. Takav pristup povećava vrijednost bez nepotrebne izgradnje u netaknutim uvalama.'],
  ['Ekonomski multiplikatori', 'Marketing životnog stila, razvoj male brodogradnje te edukacija skipera, posada i lučkog menadžmenta šire učinak izvan samoga veza. Lokalna vrijednost raste kada se nabava i servis vežu uz domaće poduzetnike.'],
  ['Održivi nautički ekosustav', 'Kružni model povezuje očuvanje resursa, visokokvalitetnu ponudu, lokalni ekonomski rast i reinvestiranje u zaštitu. Prekid bilo koje veze pretvara rast u trošenje prirodnog kapitala.'],
  ['Vizija za budućnost', 'Završna vizija zagovara vodeću destinaciju po mjeri čovjeka, a ne maksimalan broj plovila. Mjerilo uspjeha postaje vrijednost uz očuvan Jadran za buduće generacije.'],
])

const cityBreakSlides = slidesFor('city-break', [
  ['City break kao strateški potencijal kontinentalne Hrvatske', 'Naslovni slajd city break postavlja kao razvojni alat za kontinentalne gradove. Fokus je na resursima, dostupnosti i integralnom upravljanju, a ne samo na kratkoći boravka.'],
  ['Dekonstrukcija city break koncepta', 'Dva do četiri noćenja, urbana jezgra i spoj kulture, zabave i gastronomije čine osnovni format. Kratko trajanje zahtijeva visoku gustoću lako dostupnih iskustava.'],
  ['Strateški zaokret: obala i kontinent', 'Jadranski model nosi visoku ljetnu koncentraciju i rizik overtourisma, dok kontinentalni gradovi nude prostornu i vremensku diversifikaciju. Kontinent je razvojna dopuna, ne samo zamjena za obalu.'],
  ['Makropokretači urbanog turizma', 'Prometna infrastruktura, digitalne rezervacije i fragmentacija odmora omogućuju češća kratka putovanja. Prednost ostvaruje grad koji gostu smanjuje vrijeme i neizvjesnost planiranja.'],
  ['Resursna osnova kontinenta', 'Karta povezuje Varaždin, Osijek, Đakovo i Vinkovce sa srednjoeuropskim tržištem. Koncentracija baroka, secesije, tradicije i gastronomije može postati mreža komplementarnih urbanih proizvoda.'],
  ['Matrica kontinentalnih destinacija', 'Svaki grad dobiva profil prema primarnom resursu, manifestaciji i ciljnom doživljaju. Matrica sprječava generičko brendiranje i olakšava zajedničko pozicioniranje bez gubitka posebnosti.'],
  ['Dimenzije doživljaja kontinentalnog city breaka', 'Tradicija, kreativnost i enogastronomija preklapaju se u integralnom proizvodu. Optimalan program spaja čuvare identiteta, suvremenu interpretaciju i hedonističke sadržaje.'],
  ['Manifestacija kao destinacija', 'Špancirfest, HeadOnEast, Vinkovačke jeseni i Đakovački vezovi pokazuju kako događaj može postati primarni motiv dolaska. Trajniji učinak nastaje kada manifestacija aktivira smještaj, gastronomiju i zaleđe.'],
  ['Divergentni izazovi održivosti', 'Obalni gradovi upravljaju prekomjernim tokovima, a kontinentalni kratkim boravkom i slabijom vidljivošću. Zbog različite dijagnoze ne mogu primjenjivati iste upravljačke mjere.'],
  ['Anatomija sindroma kratkog boravka', 'Nakon konzumacije primarnog resursa angažman brzo pada, često prije drugoga noćenja. Hotelski kapacitet i MICE ponuda mogu stvoriti dodatne razloge boravka radnim danom.'],
  ['Integralna strateška rješenja', 'DMO treba proširiti proizvod izvan urbane jezgre prema Kopačkom ritu, Baranji, toplicama i dvorcima. MICE služi kao sidro izvan vikenda i povećava opravdanost kvalitetnijeg smještaja.'],
  ['Pametno upravljanje destinacijom', 'Jedinstvena kartica, digitalni vodiči i analitika tokova mogu povećati dostupnost i disperziju potrošnje. Tehnologija je učinkovita samo ako su sadržaji stvarno otvoreni i povezani.'],
  ['Sinteza i pitanja za strateško promišljanje', 'Završni slajd povezuje održivost, međunarodno brendiranje manifestacija i umrežavanje grada sa zaleđem. Ta tri pitanja pretvaraju city break iz promotivne oznake u razvojni program.'],
])

const healthSlides = slidesFor('zdravstveni', [
  ['Zdravstveni turizam u Hrvatskoj', 'Naslovni slajd povezuje povijesno nasljeđe, tržišni profil i razvojne smjernice. Središnji je zadatak pretvoriti komparativne resurse u dokazivu globalnu konkurentnost.'],
  ['Potencijal visoke dodane vrijednosti', 'Zdravstveni turizam može ublažiti sezonalnost, valorizirati prirodne ljekovite činitelje i odgovoriti na starenje stanovništva te rast svijesti o zdravlju. Potencijal ne znači automatski tržišni rezultat.'],
  ['Tri temeljna stupa zdravstvenog turizma', 'Wellness, lječilišni i medicinski turizam razlikuju se prema motivu, mjestu i razini stručnog nadzora. Jasne granice štite korisnika i sprječavaju neodgovorno marketinško obećanje.'],
  ['Povijesni temelj lječilišnog fenomena', 'Europska kupališta i austrougarska tradicija povezuju medicinu, rekreaciju i boravak. Balneologija i talasoterapija Hrvatskoj daju autentičnu osnovu za suvremeni proizvod.'],
  ['Strukturni dispariteti sektora', 'Hotelski wellness ima tržišnu kvalitetu, javna lječilišta stručnost, a privatne poliklinike agilnost. Svaki segment istodobno ima drugo usko grlo: regulativu, infrastrukturu ili fragmentirano tržišno pozicioniranje.'],
  ['Sociodemografski profil korisnika', 'Wellness gost je mlađi i platežno snažniji, dok je lječilišni gost stariji i usmjeren liječenju. Oba segmenta visoko vrednuju stručnost, reputaciju, certifikate i cijenu.'],
  ['Izvozni potencijal i domaća ovisnost', 'Wellness i medicinski turizam imaju veći udio stranih korisnika, dok lječilišni segment ostaje oslonjen na domaće tržište. Internacionalizacija traži modernizaciju, standarde i pouzdanu prodajnu mrežu.'],
  ['Akreditacija kao arhitektura povjerenja', 'Klinički protokoli, tržišna diferencijacija, kontinuirano poboljšanje i kompetencije čine četiri stupa akreditacije. Certifikat nije ukras, nego dokaz upravljačkog sustava kvalitete.'],
  ['SWOT sinteza zdravstvenog turizma', 'Stručni kadar, prirodni resursi i cijene susreću zastarjelu infrastrukturu, regulatorni jaz i manjak akreditacije. Starenje europskog tržišta otvara priliku, ali regionalna konkurencija brzo podiže standard.'],
  ['Tri imperativa repozicioniranja', 'Modernizacija javnog sektora, međunarodna certifikacija i integrirana promocija moraju napredovati zajedno. Promocija bez obnovljene infrastrukture i dokaza kvalitete povećava reputacijski rizik.'],
  ['Od fragmentacije do globalne prepoznatljivosti', 'Vizija prikazuje prijelaz od ad hoc rješenja prema integriranoj destinaciji zdravlja. Mehanizam tranzicije čine sustavno ulaganje, akreditacija i koordinirana tržišna prisutnost.'],
])

const miceSlides = slidesFor('mice', [
  ['Kontinuirana nit okupljanja', 'Naslovni slajd upravljanje događajima smješta u dugu povijest ljudske potrebe za zajedničkim okupljanjem. Formati se mijenjaju, ali društvena funkcija ostaje.'],
  ['Osnovna anatomija događaja', 'Događaj je privremen, planiran, jedinstven i oblikovan za određenu publiku. Upravo ta kombinacija zahtijeva projektno upravljanje, koordinaciju resursa i jasno definirane ciljeve.'],
  ['Filter posebnoga događaja', 'Ograničeno trajanje, autentičnost i odmak od svakodnevice razlikuju poseban događaj od redovitog programa. Oznaka poseban mora se dokazati iskustvom, a ne samo nazivom.'],
  ['Doba korijena i rituala', 'Sajmovi i građanski spektakli povezivali su kalendar, ritual, trgovinu i političku vidljivost. Povijesni primjeri pokazuju da događaji od početka istodobno stvaraju društvenu i ekonomsku vrijednost.'],
  ['Doba industrijskog izloga', 'Velika izložba i strukturiranje slobodnog vremena označavaju profesionalizaciju komercijalnih događaja. Industrijalizacija je povećala doseg, ali i potrebu za planskom infrastrukturom i upravljanjem masama.'],
  ['Doba globalnog mega-događaja', 'Televizija i digitalna tehnologija odvajaju doseg od fizičkog kapaciteta prostora. Live Aid i Vivid Sydney pokazuju kako događaj može istodobno postati medijska platforma, urbani proizvod i instrument aktivizma.'],
  ['Strateški ekosustav događaja', 'Događaji pokreću potrošnju, korporativni angažman, meku moć i koheziju zajednice. Učinak zato treba mjeriti šire od prodanih ulaznica i hotelskih noćenja.'],
  ['Krivulja otpornosti: šok i adaptacija', 'Financijska kriza, klimatski pritisci i pandemija promijenili su kriterije uspjeha. Industrija je odgovorila mjerenjem povrata, održivošću te virtualnim i hibridnim formatima.'],
  ['Matrica paradigme formata', 'Događaji uživo nude imerziju, virtualni globalni doseg, a hibridni pokušavaju spojiti obje vrijednosti uz dvostruku produkcijsku složenost. Format treba birati prema cilju i publici, ne prema modi.'],
  ['Neprekinuta potreba i budućnost', 'Završna sinteza odvaja trajnu ljudsku potrebu od promjenjivog mehanizma isporuke. Buduća industrija mora projektirati fleksibilnost i otpornost jednako ozbiljno kao sadržaj i spektakl.'],
])

export const specialInterestMedia: Record<number, ChapterMedia> = {
  11: {
    audio: { title: 'Povijest više nije gledanje', fileName: 'Povijest_vise_nije_gledanje.mp3', url: publicObjectUrl('Kulturni turizam/Povijest_vise_nije_gledanje.mp3'), duration: '34:00', description: 'Audio prati prijelaz od pasivnog promatranja baštine prema participativnom, kreativnom i odgovorno vođenom kulturnom doživljaju.' },
    video: { title: 'Kulturni turizam', fileName: 'Kulturni_turizam.mp4', url: publicObjectUrl('Kulturni turizam/Kulturni_turizam.mp4'), duration: '9:43', description: 'Video sažima motive, proizvode, dionike i razvojne izazove kulturnog turizma.', poster: '/media/posebni-interesi/kulturni/video-poster.webp' },
    presentation: { title: 'Kulturni turizam: od pasivne baštine do aktivnog doživljaja', fileName: 'Cultural_Tourism_Redefined.pptx', url: publicObjectUrl('Kulturni turizam/Cultural_Tourism_Redefined.pptx'), description: 'Dvanaest slajdova povezuje definicije, profil gosta, participaciju, model 3S, hrvatsku potražnju i održivu viziju razvoja.', slides: culturalSlides },
  },
  12: {
    audio: { title: 'Od Michelinovih guma do vinskih bunkera', fileName: 'Od_Michelinovih_guma_do_vinskih_bunkera.m4a', url: publicObjectUrl('Enogastronomski turizam/Od_Michelinovih_guma_do_vinskih_bunkera.m4a'), duration: '17:53', description: 'Audio povezuje nastanak gastronomskih vodiča, vinske priče i suvremeno pozicioniranje destinacija hrane i pića.' },
    video: { title: 'Enogastronomski turizam', fileName: 'Enogastronomski_turizam.mp4', url: publicObjectUrl('Enogastronomski turizam/Enogastronomski_turizam.mp4'), duration: '8:10', description: 'Video objašnjava kako lokalna gastronomija postaje turistički motiv i održiv lanac vrijednosti.', poster: '/media/posebni-interesi/enogastronomski/video-poster.webp' },
    presentation: { title: 'Enogastronomski turizam: od lokalne baštine do globalnog fenomena', fileName: 'Strategic_Enogastronomic_Tourism_(2).pptx', url: publicObjectUrl('Enogastronomski turizam/Strategic_Enogastronomic_Tourism_(2).pptx'), description: 'Četrnaest slajdova obrađuje motive, segmente, destinacijske modele, hrvatske regije i održivi lanac enogastronomije.', slides: enogastronomicSlides },
  },
  13: {
    audio: { title: 'Može li preživjeti nautički turizam?', fileName: 'Moze_li_prezivjeti_nauticki_turizam.m4a', url: publicObjectUrl('Nauticki turizam/Moze_li_prezivjeti_nauticki_turizam.m4a'), duration: '20:43', description: 'Audio propituje odnos rasta, javnog pomorskog dobra, nosivog kapaciteta i očuvanja Jadrana.' },
    video: { title: 'Paradoks nautičkog turizma', fileName: 'Paradoks_nautickog_turizma.mp4', url: publicObjectUrl('Nauticki turizam/Paradoks_nautickog_turizma.mp4'), duration: '7:57', description: 'Video prikazuje napetost između tržišne potražnje, lučkih kapaciteta i zaštite morskog prostora.', poster: '/media/posebni-interesi/nauticki/video-poster.webp' },
    presentation: { title: 'Nautički turizam Hrvatske: strategija, tržište i održivi razvoj', fileName: 'Croatia_Nautical_Strategy_(2).pptx', url: publicObjectUrl('Nauticki turizam/Croatia_Nautical_Strategy_(2).pptx'), description: 'Petnaest slajdova povezuje tržišne oblike, kapacitete, konkurenciju, nosivost prostora i strateške stupove razvoja.', slides: nauticalSlides },
  },
  14: {
    audio: { title: 'Kako kontinentalni gradovi preotimaju goste Jadranu', fileName: 'Kako_kontinentalni_gradovi_preotimaju_goste_Jadranu.m4a', url: publicObjectUrl('City break turizam/Kako_kontinentalni_gradovi_preotimaju_goste_Jadranu.m4a'), duration: '25:43', description: 'Audio analizira kako kontinentalni gradovi mogu razviti kratke odmore i smanjiti prostornu i sezonsku neravnotežu hrvatskog turizma.' },
    video: { title: 'Kontinentalni City Break', fileName: 'Kontinentalni_City_Break.mp4', url: publicObjectUrl('City break turizam/Kontinentalni_City_Break.mp4'), duration: '9:30', description: 'Video povezuje gradske resurse, događanja, gastronomiju, dostupnost i produljenje kratkog boravka.', poster: '/media/posebni-interesi/city-break/video-poster.webp' },
    presentation: { title: 'City break turizam: strateški potencijal kontinentalne Hrvatske', fileName: 'Continental_Croatia_City_Break_Strategy_(2).pptx', url: publicObjectUrl('City break turizam/Continental_Croatia_City_Break_Strategy_(2).pptx'), description: 'Trinaest slajdova analizira resurse kontinentalnih gradova, događanja, kratki boravak i integralno pametno upravljanje.', slides: cityBreakSlides },
  },
  15: {
    audio: { title: 'Hrvatska na rudniku zdravstvenog turizma', fileName: 'Hrvatska_na_rudniku_zdravstvenog_turizma.m4a', url: publicObjectUrl('Zdravstveni turizam/Hrvatska_na_rudniku_zdravstvenog_turizma.m4a'), duration: '15:45', description: 'Audio procjenjuje neiskorištene resurse, tržišne prilike i uvjete pretvaranja Hrvatske u konkurentnu destinaciju zdravlja.' },
    video: { title: 'Zdravstveni turizam', fileName: 'Zdravstveni_turizam.mp4', url: publicObjectUrl('Zdravstveni turizam/Zdravstveni_turizam.mp4'), duration: '7:16', description: 'Video razgraničuje wellness, lječilišni i medicinski turizam te objašnjava važnost kvalitete i povjerenja.', poster: '/media/posebni-interesi/zdravstveni/video-poster.webp' },
    presentation: { title: 'Zdravstveni turizam u Hrvatskoj', fileName: 'Croatia_Health_Tourism_Strategy.pptx', url: publicObjectUrl('Zdravstveni turizam/Croatia_Health_Tourism_Strategy.pptx'), description: 'Jedanaest slajdova povezuje resurse, korisnike, internacionalizaciju, akreditaciju i put od fragmentacije prema prepoznatljivosti.', slides: healthSlides },
  },
  16: {
    audio: { title: 'Od proteinskog soka do spektakala', fileName: 'Od_proteinskog_soka_do_spektakala.mp3', url: publicObjectUrl('MICE turizam/Od_proteinskog_soka_do_spektakala.mp3'), duration: '32:40', description: 'Audio prati razvoj industrije događaja i načine na koje okupljanje stvara ekonomsku, društvenu i komunikacijsku vrijednost.' },
    video: { title: 'Menadžment događaja', fileName: 'Menadzment_dogadjaja.mp4', url: publicObjectUrl('MICE turizam/Menadzment_dogadjaja.mp4'), duration: '7:24', description: 'Video sažima planiranje, izvedbu i prilagodbu događaja suvremenim formatima i rizicima.', poster: '/media/posebni-interesi/mice/video-poster.webp' },
    presentation: { title: 'Evolucija i otpornost upravljanja događajima', fileName: 'Event_Management_Evolution_and_Resilience.pptx', url: publicObjectUrl('MICE turizam/Event_Management_Evolution_and_Resilience.pptx'), description: 'Deset slajdova prati razvoj događaja od rituala do hibridne industrije te izdvaja društvenu potrebu, format i otpornost.', slides: miceSlides },
  },
}

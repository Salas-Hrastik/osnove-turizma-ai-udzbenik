import type { ChapterContent, ChapterMedia, ChapterSummary, PresentationFile, PresentationSlide } from '../types'

/**
 * Stručni dodatak izvan kanonskog rukopisa: rezultati istraživanja TOMAS
 * Hrvatska 2025./2026. (Institut za turizam, 26. listopada 2026.) kao prikaz
 * aktualnoga stanja turističke potražnje u Hrvatskoj. Oznake „sl. N” upućuju na
 * slajd službene prezentacije rezultata.
 */

const mediaBase = '/media/tomas'

const officialSlideEntries: ReadonlyArray<readonly [string, string]> = [
  ['TOMAS Hrvatska 2025./2026. — stavovi i potrošnja turista u Hrvatskoj', 'Naslovni slajd prezentacije rezultata istraživanja TOMAS Hrvatska 2025./2026., koju je Institut za turizam predstavio u Zagrebu 26. listopada 2026. Najavljuje temu cjeline: stavove i potrošnju turista koji borave u Hrvatskoj, izmjerene izravno na terenu. Cjelina pokazuje kako se stanje hrvatskog turizma prati stvarnim, ponavljanim mjerenjem.'],
  ['Uvod i metode', 'Razdjelni slajd prvog dijela prezentacije. Ujedno prikazuje strukturu cijele cjeline u šest koraka: uvod i metode, tko su gosti, zašto i kako dolaze, što rade u destinaciji i jesu li zadovoljni, koliko troše te ključni nalazi.'],
  ['TOMAS Hrvatska 2025./2026. — što, ciljevi, koristi', 'Slajd u tri stupca objašnjava što je TOMAS: nacionalno longitudinalno i kvantitativno primarno istraživanje turističke potražnje koje se provodi od 1987. godine. Ciljevi su opis profila, motivacije, aktivnosti, zadovoljstva i potrošnje turista te praćenje trendova i održivosti. Koristi su podloga za informirano upravljanje turizmom, strateške dokumente, benchmarking i praćenje održivosti.'],
  ['Metodološki okvir i uzorak', 'Slajd navodi sedam elemenata metodološkog okvira (od sadržaja i instrumenta istraživanja do ciljne populacije i ispitanika) te četiri elementa uzorka: dizajn, okvir za izbor, veličinu i alokaciju. Bilješka objašnjava da naziv TOMAS potječe od švicarskog „TOuristisches MArktforschungssystem Schweiz”. Slajd je dobar podsjetnik na korake kvantitativnog istraživanja ponašanja.'],
  ['Uzorak istraživanja', 'Tablica opisuje uzorak: stratificirani slučajni odnosno kvotni uzorak od 14.770 turista iz 153 mjesta i više od 4.200 smještajnih objekata, uz okvir izbora i ponderiranje iz sustava eVisitor. Ponderiranje stvarnim turističkim prometom osigurava reprezentativnost rezultata prema stratumima. To je primjer kako se pouzdano mjeri ponašanje velike i raznolike populacije turista.'],
  ['Rezultati prema segmentima potražnje', 'Slajd pokazuje kako se rezultati raščlanjuju: prema regijama, zemlji porijekla, vrsti smještaja, sezoni i glavnom motivu, uz praćenje trendova. Za Jadransku Hrvatsku ljeti trendovi postoje od 1987., a za Kontinentalnu Hrvatsku od 2019. godine. Takva segmentacija omogućuje usporedbu ponašanja različitih skupina turista.'],
  ['Tko su gosti?', 'Razdjelni slajd drugog dijela, posvećenog profilu turista: dobi, obrazovanju, primanjima, pratnji na putovanju i učestalosti dolaska.'],
  ['Profil turista (1/3) — dob', 'Prosječna dob turista je 41 godina u Jadranskoj i 43,5 godina u Kontinentalnoj Hrvatskoj, a većina je u dobi od 30 do 49 godina (61 % odnosno 53 %). Na obali raste udio najmlađih gostiju (do 29 godina: 14 % u 2022., 17 % u 2025.), dok je na kontinentu dobna struktura stabilna. Slajd navodi i skupine starijih i mlađih gostiju po županijama, tržištima, vrsti smještaja i motivu.'],
  ['Profil turista (2/3) — dobna struktura 1987. – 2025.', 'Stupčasti grafikon prikazuje dobnu strukturu turista u Jadranskoj Hrvatskoj ljeti kroz gotovo četiri desetljeća. Turisti srednje životne dobi dominiraju cijelo razdoblje i dosežu 62 % u 2022. i 2025., a udio najmlađe skupine nakon dugog pada ponovno raste na 17 %. Slajd pokazuje vrijednost longitudinalnog istraživanja za praćenje demografskih promjena potražnje.'],
  ['Profil turista (3/3) — obrazovanje i primanja', 'Fakultetsko obrazovanje ima 41 % gostiju na obali i 45 % na kontinentu, a primanja kućanstva iznad 5.000 € 41 % odnosno 25 %. Na obali je udio visokoobrazovanih stabilan, dok udio gostiju s višim primanjima raste (74 % iznad 4.000 € u 2025.), a i na kontinentu se udio gostiju s primanjima iznad 5.000 € podigao s 12 % na 25 %. Slajd navodi i segmente s iznadprosječnim obrazovanjem i primanjima, poput gostiju motiviranih kulturom ili ruralnim područjima.'],
  ['Pratnja na putovanju', 'Grafikon uspoređuje s kim gosti putuju: na obali prevladavaju putovanja samo s partnerom (43 %) i s obitelji (38 %), a na kontinentu je znatno više gostiju bez pratnje (24 %). Trendovi pokazuju da dolasci s partnerom na obali rastu, a obiteljski padaju, pa su se u ljetnom istraživanju izjednačili na 41 %. Pratnja je važan društveni čimbenik koji oblikuje odluku o putovanju i ponašanje u destinaciji.'],
  ['Učestalost dolaska inozemnih gostiju', 'Slajd prikazuje koliko su puta inozemni gosti već boravili u Hrvatskoj: 22 % gostiju na obali i 32 % na kontinentu dolazi prvi put. Udio novih gostiju na obali porastao je s 14 % na 22 %, a vjernost je i dalje visoka: 60 % gostiju bilo je u Hrvatskoj tri ili više puta, u kampovima čak 75 %. Najvjerniji su gosti s bliskih tržišta (Slovenija, BiH, Italija, Austrija), što je izravan pokazatelj ponovljene kupnje i lojalnosti.'],
  ['Zašto i kako gosti dolaze?', 'Razdjelni slajd trećeg dijela, koji obrađuje motive putovanja, izvore informacija i prijevozna sredstva.'],
  ['Motivi putovanja', 'Grafikon uspoređuje motive dolaska: na obali dominiraju more (83 %) i priroda (57 %), uz 93 % odmorišnih putovanja, dok su na kontinentu najvažniji city break i posao (po 22 %), uz 56 % odmorišnih putovanja. Na obali raste motiv zabave (s 8 % na 21 %) i odmora u gradu, a pada važnost prirode i gastronomije; na kontinentu raste važnost touringa i zabave. Slajd pokazuje kako se motivacija razlikuje po regijama i mijenja kroz vrijeme.'],
  ['Izvori informacija', 'Internet je glavni izvor informacija (65 % gostiju na obali, 56 % na kontinentu), a slijede preporuke rodbine i prijatelja te prijašnji boravak. Udio interneta stalno raste (s 56 % na 65 % od 2019.), a na internetu gosti najčešće koriste društvene mreže, online agencije, meta travel stranice, alate umjetne inteligencije i stranice smještajnih objekata. Slajd povezuje fazu traženja informacija s online ponašanjem turista i navodi tržišta koja se na internet oslanjaju najmanje i najviše.'],
  ['Prijevozno sredstvo', 'Automobil je dominantno prijevozno sredstvo (77 % na obali, 62 % na kontinentu), dok zrakoplovom dolazi 18 % odnosno 31 % gostiju. Na obali raste udio dolazaka zrakoplovom (s 12 % na 17 %), osobito u Dubrovačko-neretvanskoj županiji (70 %). Slajd pokazuje i razlike po vrsti smještaja, npr. 46 % gostiju kampova dolazi kamperom ili kamp-kućicom.'],
  ['Što rade u destinaciji i jesu li zadovoljni?', 'Razdjelni slajd četvrtog dijela, koji obrađuje duljinu boravka, aktivnosti i zadovoljstvo turista.'],
  ['Duljina boravka u destinaciji', 'Gosti na obali ostvaruju prosječno 6,6 noćenja, većinom četiri do sedam, dok na kontinentu prevladavaju kratki boravci od jednog do tri noćenja (81 %), uz prosjek od 2,8 noćenja. Boravak se skraćuje u obje regije: na obali ljeti s 8,4 na 6,9, a na kontinentu s 3,4 na 2,8 noćenja. Dulje ostaju gosti kampova i Nizozemci, a kraće poslovni, domaći i hotelski gosti.'],
  ['Aktivnosti u destinacijama', 'Usporedni grafikoni pokazuju što gosti rade: na obali je najčešće plivanje (82 %), zatim odlazak u restorane (59 %) i razgledavanje gradova (52 %), a na kontinentu restorani i razgledavanje gradova (po 55 %) te posjet muzejima i galerijama (20 %). Izlete planira 40 % gostiju na obali i 22 % na kontinentu. Aktivnosti su ponašajni izraz motiva iz prethodnog dijela.'],
  ['Stupanj zadovoljstva turista — Jadranska Hrvatska', 'Od 31 ocijenjenog elementa ponude, 16 ima vrlo visoko zadovoljstvo (80 % i više gostiju daje ocjenu 6 ili 7), 14 visoko, a samo promet u mjestu srednje. Najbolje su ocijenjeni ljepota mjesta i prirode, osobna sigurnost, atmosfera i čistoća plaža, a vrijednost za novac ukupnog boravka spada tek u visoko zadovoljstvo. Slajd pokazuje kako se zadovoljstvo mjeri na razini pojedinih elemenata destinacije.'],
  ['Stupanj zadovoljstva turista — Kontinentalna Hrvatska', 'Na kontinentu je zadovoljstvo vrlo visoko za 20 od 31 elementa, visoko za 10, a srednje opet samo za promet u mjestu. Na vrhu su osobna sigurnost, gostoljubivost lokalnog stanovništva i ukupni boravak, a za razliku od obale, vrijednost za novac ovdje je u skupini vrlo visokog zadovoljstva. Usporedba s prethodnim slajdom pokazuje razlike u doživljaju dviju regija.'],
  ['Stupanj zadovoljstva turista — ukupni boravak i preporuka', 'Udio gostiju koji su ukupni boravak ocijenili s 6 ili 7 iznosio je 81 % u 2019., 92 % u 2022. i 87 % u 2025.; na obali je zadovoljstvo nešto niže nego 2022., ali je poredak elemenata isti. Gosti na kontinentu zadovoljniji su gotovo svim elementima, a destinaciju bi gotovo sigurno preporučilo 69 % gostiju na kontinentu i 58 % na obali. Kao nadprosječno visoke cijene gosti najčešće ističu cijene u restoranima, a kao najveću smetnju nedostatne ili neodržavane javne WC-e.'],
  ['Koliko troše?', 'Razdjelni slajd petog dijela, posvećenog dnevnoj potrošnji turista.'],
  ['Prosječni dnevni izdaci po osobi — kategorije i smještaj', 'Turist dnevno prosječno potroši 162 € na obali i 164 € na kontinentu, od čega najveći dio odlazi na smještaj (71 € odnosno 72 €). Prema vrsti smještaja najviše troše hotelski gosti (211 €), a najmanje gosti kampova (113 €). Slajd povezuje potrošnju s izborom smještaja kao jednom od ključnih odluka o putovanju.'],
  ['Prosječni dnevni izdaci po osobi — zemlja porijekla', 'Grafikon rangira emitivna tržišta prema dnevnoj potrošnji: najviše troše gosti iz SAD-a (280 €), Ujedinjenog Kraljevstva (248 €), Španjolske i Skandinavije (po 240 €). Na dnu prikazanih deset tržišta su Srbija, Ukrajina i Slovačka (176 – 184 €). Slajd pokazuje zašto je zemlja porijekla važna varijabla segmentacije.'],
  ['Prosječni dnevni izdaci — Jadranska Hrvatska 2022. – 2025.', 'U ljetnom istraživanju dnevni izdaci na obali porasli su sa 141 € na 162 € (+15 %). Udio smještaja, hrane i pića pao je sa 69 % na 66 %, a udio ostalih destinacijskih usluga porastao je s 31 % na 34 %; iznos izdataka za te usluge porastao je za 28 %. Gosti, dakle, sve veći dio novca troše na doživljaje i usluge u destinaciji.'],
  ['Prosječni dnevni izdaci — Kontinentalna Hrvatska 2022. – 2025.', 'Na kontinentu su dnevni izdaci porasli sa 136 € na 164 € (+21 %), uz nepromijenjenu strukturu: 65 % za smještaj, hranu i piće te 35 % za ostale destinacijske usluge. Iznosi u obje skupine porasli su za 20 % odnosno 22 %. Slajd pokazuje da je rast potrošnje na kontinentu ravnomjerno raspoređen.'],
  ['Za naglasiti', 'Razdjelni slajd posljednjeg dijela, koji sažima ključne nalaze istraživanja.'],
  ['Za naglasiti — ključni nalazi', 'Sažetak u dva stupca: na obali raste udio gostiju veće kupovne moći, novih gostiju i dolazaka zrakoplovom, raste motiv zabave i odmora u gradu, boravak se skraćuje, a potrošnja raste na 162 € (+15 %). Na kontinentu su gosti stariji, glavni su motivi posao i city break, boravci su kraći, a zadovoljstvo i namjera preporuke veći nego na obali, uz potrošnju od 164 € (+21 %). Ovo je najbolji slajd za ponavljanje cijele cjeline.'],
  ['Hvala na pozornosti', 'Završni slajd s kontakt podacima Instituta za turizam (Zagreb, www.iztzg.hr), autora istraživanja TOMAS Hrvatska 2025./2026. Ne donosi novo gradivo.'],
]

const comparativeSlideEntries: ReadonlyArray<readonly [string, string]> = [
  ['TOMAS Hrvatska: Komparativna analiza', 'Naslovni slajd prezentacije koja sintetizira ključne nalaze istraživanja TOMAS od 2019. do 2026. i uspoređuje Jadransku i Kontinentalnu Hrvatsku. Važno: brojke u ovoj prezentaciji uglavnom potječu iz ranijih valova istraživanja (2019. i 2022./2023.), pa se razlikuju od rezultata za 2025./2026. iz službene prezentacije.'],
  ['Evolucija istraživanja: od ljetnog fokusa do nacionalnog obuhvata', 'Vremenska crta prikazuje razvoj istraživanja: do 2019. provodio se TOMAS Ljeto samo za primorske destinacije (od 1987.), 2019. prvo je cjelogodišnje nacionalno istraživanje s 13.582 ispitanika, 2022./2023. slijedi post-pandemijski val s ljestvicom zadovoljstva od 1 do 7, a 2025./2026. novi metodološki okvir. Slajd objašnjava zašto se trendovi za kontinent mogu pratiti tek od 2019.'],
  ['Arhitektura podataka: metodološki temelj TOMAS istraživanja', 'Slajd sažima metodu: kvantitativno primarno istraživanje osobnim intervjuima s turistima u komercijalnim smještajnim objektima, uz utežavanje podacima iz sustava eVisitor. Naglašava kontinuitet: rezultati za Jadransku Hrvatsku izravno su usporedivi sa starijim podacima TOMAS Ljeto. U valu 2025./2026. uzorak je iznosio 14.770 ispitanika (službena prezentacija, sl. 5).'],
  ['Dva lica hrvatskog turizma', 'Karta razlikuje dvije regije istraživanja: Jadransku Hrvatsku (7 primorskih županija), tradicionalnu ljetnu destinaciju, i Kontinentalnu Hrvatsku (14 kontinentalnih županija i Grad Zagreb), rastuće cjelogodišnje tržište. Ta podjela je osnovna os usporedbe u cijeloj cjelini.'],
  ['Sociodemografski profil: tko posjećuje hrvatske regije?', 'Slajd uspoređuje obrazovanje i primanja gostiju dviju regija prema ranijem valu istraživanja (prag primanja od 3.000 €). U valu 2025./2026. fakultetsko obrazovanje ima 41 % gostiju na obali i 45 % na kontinentu, a primanja iznad 5.000 € 41 % odnosno 25 % (službena prezentacija, sl. 10). Zaključak je isti: gosti s obale imaju višu kupovnu moć, a kontinentalni gosti su nešto obrazovaniji.'],
  ['Lojalnost i akvizicija: povratnici na obali, novi gosti na kontinentu', 'Grafikon prema ranijem valu pokazuje da obala ima više lojalnih gostiju, a kontinent više gostiju koji dolaze prvi put. U valu 2025./2026. prvi je put u Hrvatskoj 22 % gostiju na obali i 32 % na kontinentu, a 60 % inozemnih gostiju bilo je ovdje tri ili više puta (službena prezentacija, sl. 12). Internet je i ovdje glavni izvor informacija.'],
  ['Motivacijski pokretači: od mora do posla', 'Usporedni grafikon motiva prema ranijem valu: na obali dominiraju more i priroda, a na kontinentu priroda, city break, touring i posao. U valu 2025./2026. more motivira 83 % gostiju na obali, a na kontinentu su najvažniji city break i posao s po 22 % (službena prezentacija, sl. 14). Struktura motiva dviju regija ostala je bitno različita.'],
  ['Obilježja putovanja: obiteljska putovanja automobilom nasuprot solo letovima', 'Slajd prema ranijem valu suprotstavlja obiteljske dolaske automobilom na obalu i samostalne, često poslovne dolaske zrakoplovom na kontinent. U valu 2025./2026. automobilom dolazi 77 % gostiju na obali i 62 % na kontinentu, a zrakoplovom 18 % odnosno 31 % (službena prezentacija, sl. 16). Na kontinentu se udio gostiju bez pratnje smanjio na 24 %.'],
  ['Boravak i aktivnosti: dugo ljetovanje nasuprot kratkom gradskom odmoru', 'Slajd prema ranijem valu prikazuje 7,6 noćenja na obali i 2,9 na kontinentu te zajedničke i specifične aktivnosti dviju regija. U valu 2025./2026. prosjek je 6,6 noćenja na obali i 2,8 na kontinentu, a boravak se u obje regije skraćuje (službena prezentacija, sl. 18). Odlazak u restorane i razgledavanje gradova zajedničke su aktivnosti obiju regija.'],
  ['Turistička potrošnja: kontinent generira višu dnevnu potrošnju', 'Prema ranijem valu dnevna potrošnja iznosila je 115 € na kontinentu i 97 € na obali, uz istu strukturu izdataka u obje regije. U valu 2025./2026. potrošnja je porasla na 164 € na kontinentu i 162 € na obali (službena prezentacija, sl. 24). Kontinent i dalje ima nešto višu dnevnu potrošnju po osobi.'],
  ['Temelji konkurentnosti: najveće prednosti hrvatskog turizma', 'Radarski prikaz izdvaja najbolje ocijenjene elemente ponude prema valu 2022./2023.: ljepotu prirode, osobnu sigurnost, ljepotu mjesta, atmosferu i gostoljubivost lokalnog stanovništva. Isti elementi zadržali su vrlo visoke ocjene i u valu 2025./2026. (službena prezentacija, sl. 20–21). Konkurentnost se dakle temelji na percepciji prirode i sigurnosti.'],
  ['Dijagnostika nedostataka: kritične točke turističke ponude', 'Slajd navodi probleme iz ranijeg vala (gužve, otpad, mirisi, buka) i najslabije ocijenjene elemente po regijama. U valu 2025./2026. promet u mjestu jedini je element sa srednjom ocjenom u obje regije, a najveća smetnja su nedostatni ili neodržavani javni WC-i (službena prezentacija, sl. 20–22). Takva dijagnostika pokazuje gdje upravljanje destinacijom treba intervenirati.'],
  ['Metodološka evolucija: preciznije mjerenje zadovoljstva (2022./2023.)', 'Slajd objašnjava prelazak na ljestvicu od 1 (vrlo loše) do 7 (odlično) u valu 2022./2023. i mjerenje zadovoljstva na mnogo pojedinačnih elemenata ponude. U valu 2025./2026. ocjenjuje se 31 element, a zadovoljstvo se iskazuje kao udio ocjena 6 ili 7 (službena prezentacija, sl. 20). Granularno mjerenje omogućuje ciljanije odluke o ulaganjima.'],
  ['Budućnost sustava: nacrt za TOMAS 2025./2026.', 'Slajd u obliku hrama prikazuje sedam elemenata metodološkog okvira i četiri elementa uzorka novog vala istraživanja, istih kao u prezentaciji Instituta za turizam (službena prezentacija, sl. 4). Navodi i usmjerenje prema preciznijem praćenju održivosti i otpornosti turizma.'],
  ['Zaključna sinteza: od ljetne obale do cjelogodišnje cjeline', 'Sažetak opisuje dva komplementarna tržišta: obalu, obiteljski orijentiranu i obilježenu lojalnošću i duljim boravcima, te kontinent, tržište kratkih boravaka s visokom dnevnom potrošnjom koje privlači nove goste. Poruka je prijelaz s praćenja volumena na upravljanje dodanom vrijednošću tijekom cijele godine.'],
]

const anatomySlideEntries: ReadonlyArray<readonly [string, string]> = [
  ['TOMAS Hrvatska 2025./2026.: Anatomija nacionalnog turističkog istraživanja', 'Naslovni slajd prezentacije koja korak po korak raščlanjuje metodologiju i rezultate istraživanja TOMAS 2025./2026. Napomena: na slajdu je naveden kolegij „Istraživanje turističkog tržišta”, ali sadržaj odgovara ovoj cjelini.'],
  ['Zašto istražujemo? Strateška vrijednost TOMAS-a', 'Slajd u tri stupca ponavlja što je TOMAS (kvantitativno primarno, nacionalno longitudinalno istraživanje od 1987.), koji su mu ciljevi (opis potražnje, praćenje trendova i održivosti) i koja mu je korist (informirano odlučivanje, strateški dokumenti, benchmarking). Odgovara prvom koraku ove cjeline.'],
  ['Arhitektura uzorka: od sirovog podatka do reprezentativnosti', 'Slajd prati put od okvira uzorka (eVisitor, travanj 2025. – ožujak 2026.) preko 153 mjesta i više od 4.200 smještajnih objekata do 14.770 ispitanika i utežavanja rezultata. Dobro pokazuje logiku stratificiranog uzorka i ponderiranja (službena prezentacija, sl. 5).'],
  ['Segmentacija potražnje: kako seciramo nacionalno tržište?', 'Šest šesterokuta prikazuje analitičke prizme istraživanja: regije, zemlju porijekla, vrstu smještaja, sezonu, glavni motiv dolaska i trendove. Poruka je da se potražnja ne promatra kroz opći prosjek nego kroz segmente (službena prezentacija, sl. 6).'],
  ['Evolucija dobi turista (1987. – 2025.): smjena generacija', 'Slajd prikazuje dominaciju turista srednje životne dobi kroz cijelo razdoblje, rast udjela najmlađih gostiju na obali (do 29 godina: s 14 % na 17 %) i stabilnu dobnu strukturu na kontinentu. Ističe i skupine starijih gostiju (Istra, Kvarner, hoteli, kampovi, zdravstveni motiv) te mlade goste hostela (službena prezentacija, sl. 8–9).'],
  ['Uspon „premium” gosta: obrazovanje i prihodi', 'Slajd ističe da 40 % gostiju na obali (45 % na kontinentu) ima fakultetsko obrazovanje, a 74 % gostiju u 2025. ima primanja kućanstva iznad 4.000 €. Navodi i gdje su takvi gosti najzastupljeniji: Zagreb, Splitsko-dalmatinska županija, hoteli s 4 i 5 zvjezdica, gosti motivirani kulturom i ruralnim područjima (službena prezentacija, sl. 10).'],
  ['Matrica usporedbe: Jadranska nasuprot Kontinentalnoj Hrvatskoj', 'Tablica uspoređuje ključne pokazatelje dviju regija: prosječnu dob (41 i 43,5 godina), udio primanja iznad 5.000 € (41 % i 25 %), dnevnu potrošnju (162 € i 164 €), zadovoljstvo ukupnim boravkom (87 % i 92 %) i namjeru preporuke (58 % i 69 %). Zaključak: kontinent privlači nešto starije goste nižih primanja, ali s većom potrošnjom i zadovoljstvom.'],
  ['Smjena motiva: što pokreće dolazak na destinaciju?', 'Na obali raste motiv zabave (s 8 % na 21 %) i odmora u gradu (sa 17 % na 23 %), a pada važnost prirode (sa 64 % na 58 %) i gastronomije (s 18 % na 13 %). Na kontinentu su posao i city break (po 22 %) i dalje glavni motivi, uz rast touringa i zabave (službena prezentacija, sl. 14).'],
  ['Putovanje korisnika: informacije i prijevoz', 'Lijevak informacija pokazuje rast interneta s 56 % na 65 % i sve veću ulogu alata umjetne inteligencije. Ispravak podataka sa slajda: automobilom dolazi 77 % gostiju na obali i 62 % na kontinentu, a zrakoplovom 18 % na obali i 31 % na kontinentu, a ne 31 % u obje regije (službena prezentacija, sl. 15–16). Točni su podaci o gostima kampova (46 % kamperom) i hostela (22 % autobusom).'],
  ['Ponašanje u destinaciji: od plana do realizacije', 'Slajd ističe da 40 % gostiju na obali planira izlete te prikazuje najčešće aktivnosti po regijama. Ispravak: na kontinentu razgledavanje gradova i odlazak u restorane iznose po 55 %, a posjet muzejima i galerijama 20 %, ne 55 %; izlete na kontinentu planira 22 % gostiju (službena prezentacija, sl. 19).'],
  ['Indeks zadovoljstva: analiza jaza', 'Ukupno zadovoljstvo je visoko (87 % na obali i 92 % na kontinentu daje ocjenu 6 ili 7), ali je na obali niže nego 2022. Slajd navodi elemente visokog zadovoljstva (vrijednost za novac, pješačke staze, označavanje znamenitosti) i ističe da kontinent prednjači u kulturi i umjetnosti (85 %) te sportskim sadržajima (80 %). Napomena da pad s povijesnog maksimuma treba shvatiti kao signal za korekciju strategije.'],
  ['Kritične točke: što narušava iskustvo?', 'Tri upozorenja sažimaju slabosti: cijene u restoranima i trgovinama ocijenjene su kao nadprosječno visoke, najveća smetnja su nedostatni ili neodržavani javni WC-i (5 %), a promet u mjestu ima samo srednje zadovoljstvo, u Zagrebu 64 % (službena prezentacija, sl. 22).'],
  ['Ekonomski učinak: paradoks potrošnje i duljine boravka', 'Dnevna potrošnja raste na 162 € na obali (+15 %) i 164 € na kontinentu (+21 %), dok se boravak skraćuje (na kontinentu 2,8 noćenja u mjestu). Zaključak slajda: gosti ostavljaju više novca u manje dana (službena prezentacija, sl. 18 i 26–27).'],
  ['Sinteza: anatomija hrvatskog turista 2025./2026.', 'Profil tipičnog gosta u pet točaka: viša kupovna moć (74 % s primanjima iznad 4.000 €), povratak novih gostiju (s 14 % na 22 %), oslanjanje na internet (65 %) i umjetnu inteligenciju, pomak motiva prema zabavi i city breaku te kraći, ali intenzivniji boravci. Dobar slajd za ponavljanje cijele cjeline.'],
  ['Znanje je temelj održivog turizma', 'Završni slajd upućuje na cjelovito izvješće TOMAS Hrvatska 2025./2026. Instituta za turizam. Ne donosi novo gradivo.'],
]

function slidesFrom(entries: ReadonlyArray<readonly [string, string]>, folder: string): PresentationSlide[] {
  return entries.map(([title, interpretation], index) => ({
    number: index + 1,
    title,
    image: `${mediaBase}/${folder}/slides/slide-${index + 1}.webp`,
    interpretation,
  }))
}

const officialPresentation: PresentationFile = {
  title: 'TOMAS Hrvatska 2025./2026. — stavovi i potrošnja turista',
  fileName: 'TOMAS_Hrvatska_2025_2026.pdf',
  url: `${mediaBase}/TOMAS_Hrvatska_2025_2026.pdf`,
  description: 'Službena prezentacija rezultata Instituta za turizam u trideset slajdova: metode, profil gostiju, motivi, informiranje, prijevoz, boravak, zadovoljstvo i potrošnja.',
  slides: slidesFrom(officialSlideEntries, 'sluzbena'),
}

const media: ChapterMedia = {
  video: {
    title: 'Privlačnost Hrvatske',
    fileName: 'privlacnost-hrvatske.mp4',
    url: `${mediaBase}/privlacnost-hrvatske.mp4`,
    duration: '8:30',
    description: 'Video uspoređuje obalu i kontinent te prati promjenu motiva od mora i sunca prema zabavi. Dio brojki potječe iz ranijih valova istraživanja (2019. i 2022./2023.), pa ih valja usporediti s rezultatima za 2025./2026.',
    poster: `${mediaBase}/privlacnost-poster.webp`,
  },
  presentation: officialPresentation,
  extraVideos: [
    {
      title: 'Kako zabava mijenja dobnu sliku turista',
      fileName: 'zabava-i-dobna-slika-turista.mp4',
      url: `${mediaBase}/zabava-i-dobna-slika-turista.mp4`,
      duration: '1:11',
      description: 'Kratki uspravni video o rastu udjela gostiju mlađih od 30 godina i motiva zabave u Jadranskoj Hrvatskoj.',
      poster: `${mediaBase}/zabava-poster.webp`,
    },
  ],
  extraPresentations: [
    {
      title: 'TOMAS Hrvatska: komparativna analiza 2019. – 2023.',
      fileName: 'TOMAS_komparativna_analiza.pdf',
      url: `${mediaBase}/TOMAS_komparativna_analiza.pdf`,
      description: 'Petnaest slajdova uspoređuje Jadransku i Kontinentalnu Hrvatsku prema ranijim valovima istraživanja; tumačenja navode i rezultate za 2025./2026.',
      slides: slidesFrom(comparativeSlideEntries, 'komparativna'),
    },
    {
      title: 'Anatomija nacionalnog turističkog istraživanja',
      fileName: 'Anatomija_TOMAS_istrazivanja.pdf',
      url: `${mediaBase}/Anatomija_TOMAS_istrazivanja.pdf`,
      description: 'Petnaest slajdova raščlanjuje metodologiju i rezultate TOMAS-a 2025./2026.; tumačenja ispravljaju netočne podatke s pojedinih slajdova.',
      slides: slidesFrom(anatomySlideEntries, 'anatomija'),
    },
  ],
}

export const tomasChapterSummary: ChapterSummary = {
  id: 19,
  title: 'Stanje turizma u Hrvatskoj: TOMAS Hrvatska 2025./2026.',
  pages: 'stručni dodatak',
  outcome: 'Protumačiti aktualni profil, ponašanje, zadovoljstvo i potrošnju turista u Jadranskoj i Kontinentalnoj Hrvatskoj na temelju nacionalnoga istraživanja.',
  status: 'available',
}

export const tomasChapterContent: ChapterContent = {
  ...tomasChapterSummary,
  summary: 'TOMAS Hrvatska 2025./2026. nacionalno je longitudinalno istraživanje Instituta za turizam koje na uzorku od 14.770 turista, utežanom podacima iz sustava eVisitor, opisuje tko dolazi u Hrvatsku, zašto i kako putuje, što radi u destinaciji, koliko je zadovoljan i koliko troši. Na obali raste udio gostiju veće kupovne moći i novih gostiju, jačaju motivi zabave i odmora u gradu, a boravak se skraćuje. Kontinent privlači nešto starije goste koji dolaze poslovno ili na city break, ostaju kraće, ali su zadovoljniji. Dnevna potrošnja raste na 162 € na obali i 164 € na kontinentu.',
  outcomes: [
    'objasniti svrhu, uzorak i utežavanje nacionalnoga istraživanja TOMAS',
    'usporediti profil, pratnju i vjernost gostiju Jadranske i Kontinentalne Hrvatske',
    'protumačiti motive, izvore informacija, duljinu boravka i zadovoljstvo kao pokazatelje stanja turizma',
    'procijeniti trendove potrošnje i predložiti posljedice za upravljanje destinacijom i ponudom',
  ],
  keywords: [
    { term: 'TOMAS istraživanje', definition: 'Nacionalno longitudinalno i kvantitativno primarno istraživanje turističke potražnje u Hrvatskoj koje Institut za turizam provodi od 1987. godine, prikupljajući podatke izravno od turista.' },
    { term: 'Stratificirani uzorak', definition: 'Dizajn uzorka istraživanja TOMAS: stratificirani slučajni odnosno kvotni uzorak, s dolascima i noćenjima prema stratumima iz eVisitora kao okvirom; obuhvatio je 14.770 turista u 153 mjesta.' },
    { term: 'Utežavanje rezultata', definition: 'Usklađivanje rezultata uzorka sa stvarnim turističkim prometom iz sustava eVisitor, čime se osigurava reprezentativnost rezultata prema stratumima.' },
    { term: 'Profil turista', definition: 'Sociodemografska obilježja gostiju: prosječna dob je 41 godina na obali i 43,5 na kontinentu, a fakultetsko obrazovanje ima 41 % odnosno 45 % gostiju.' },
    { term: 'Vjernost gostiju', definition: 'Ponovljeni dolasci u Hrvatsku: 60 % inozemnih gostiju bilo je ovdje tri ili više puta, a u kampovima 75 %, najviše s bliskih tržišta.' },
    { term: 'Odmorišna putovanja', definition: 'Putovanja kojima je glavna svrha odmor; čine 93 % putovanja u Jadranskoj i 56 % u Kontinentalnoj Hrvatskoj.' },
    { term: 'Internet kao izvor informacija', definition: 'Glavni izvor informacija za 65 % gostiju na obali; najčešće se koriste društvene mreže, online agencije, meta travel stranice i alati umjetne inteligencije.' },
    { term: 'Stupanj zadovoljstva', definition: 'Udio gostiju koji su element ponude ocijenili s 6 ili 7 na skali od 1 do 7; vrlo visok je 80 % i više, visok 70–79,9 %, a srednji 60–69,9 %.' },
    { term: 'Namjera preporuke', definition: 'Udio gostiju koji bi destinaciju gotovo sigurno preporučili drugima: 69 % gostiju na kontinentu i 58 % gostiju na obali.' },
    { term: 'Prosječni dnevni izdaci', definition: 'Potrošnja turista po osobi i danu: 162 € na obali (+15 % od 2022.) i 164 € na kontinentu (+21 %), najviše za smještaj.' },
  ],
  steps: [
    {
      title: 'Upoznaj istraživanje i njegovu metodu',
      body: 'TOMAS se provodi od 1987. godine, a prethodno je proveden 2019. i 2022./2023. Podaci se prikupljaju izravno od turista u 153 mjesta i više od 4.200 smještajnih objekata, od travnja 2025. do ožujka 2026.',
      points: ['Uzorak je stratificiran prema dolascima i noćenjima iz sustava eVisitor.', 'Anketirano je 14.770 turista, 100,2 % planiranoga broja.', 'Rezultati su utežani ostvarenim turističkim prometom radi reprezentativnosti.', 'Rezultati se prikazuju po regijama, tržištima, smještaju, sezoni i glavnom motivu.'],
      takeaway: 'Pouzdana slika turizma traži reprezentativan uzorak i ponavljanje mjerenja kroz vrijeme.',
      source: 'TOMAS Hrvatska 2025./2026., sl. 3–6',
    },
    {
      title: 'Prepoznaj tko su gosti',
      body: 'Prosječna dob turista je 41 godina na obali i 43,5 godina na kontinentu. Na obali raste udio najmlađih gostiju i gostiju veće kupovne moći, a ponovno raste i udio onih koji Hrvatsku posjećuju prvi put.',
      points: ['Gostiju do 29 godina na obali je 17 % (2022.: 14 %).', 'Primanja kućanstva iznad 4.000 € ima 74 % ljetnih gostiju na obali.', 'Na obali se izjednačuju dolasci s partnerom i s obitelji (po 41 %).', '60 % inozemnih gostiju bilo je u Hrvatskoj tri ili više puta.'],
      takeaway: 'Hrvatska istodobno zadržava vjerne goste s bliskih tržišta i privlači nove goste veće kupovne moći.',
      source: 'TOMAS Hrvatska 2025./2026., sl. 8–12',
    },
    {
      title: 'Objasni motive, informiranje i ponašanje u destinaciji',
      body: 'Na obali dominiraju more (83 %) i priroda (57 %), a na kontinentu city break i posao (po 22 %). Gosti se najčešće informiraju internetom, većinom dolaze automobilom, a boravak se u obje regije skraćuje.',
      points: ['Na obali motiv zabave raste s 8 % na 21 %, a važnost prirode i gastronomije pada.', 'Internet koristi 65 % gostiju na obali, uz sve veću ulogu alata umjetne inteligencije.', 'Prosječan boravak iznosi 6,6 noćenja na obali i 2,8 na kontinentu.', 'Od 31 elementa ponude jedino promet u mjestu ima samo srednje zadovoljstvo.'],
      takeaway: 'Motiv dolaska određuje trajanje boravka, aktivnosti i elemente ponude koje gost najstrože ocjenjuje.',
      source: 'TOMAS Hrvatska 2025./2026., sl. 14–22',
    },
    {
      title: 'Procijeni potrošnju i razvojne poruke',
      body: 'Prosječni dnevni izdaci po osobi iznose 162 € na obali i 164 € na kontinentu. Gosti ostavljaju više novca u manje dana, a na obali raste udio izdataka za ostale destinacijske usluge.',
      points: ['Na obali dnevna potrošnja raste za 15 %, a na kontinentu za 21 % od 2022.', 'Hotelski gosti troše 211 €, a gosti kampova 113 € dnevno.', 'Najviše troše gosti iz SAD-a (280 €) i Ujedinjenog Kraljevstva (248 €).', 'Udio ostalih destinacijskih usluga na obali raste s 31 % na 34 %.'],
      takeaway: 'Kraći, ali intenzivniji boravci traže bogatiju ponudu doživljaja u destinaciji, a ne samo više kapaciteta.',
      source: 'TOMAS Hrvatska 2025./2026., sl. 24–29',
    },
  ],
  dataSnapshot: [
    { label: 'Anketiranih turista', value: '14.770', change: '153 mjesta · 4.200+ objekata' },
    { label: 'Dnevna potrošnja', value: '162 € / 164 €', change: 'obala +15 % · kontinent +21 %' },
    { label: 'Prosječan boravak', value: '6,6 / 2,8', change: 'noćenja · obala / kontinent' },
    { label: 'Namjera preporuke', value: '58 % / 69 %', change: 'obala / kontinent' },
  ],
  appliedActivity: {
    title: 'Profil gosta vaše destinacije',
    intro: 'Odaberite hrvatsku destinaciju i usporedite njezine pretpostavljene goste s nacionalnim rezultatima istraživanja TOMAS.',
    tasks: ['Odredite pripada li destinacija Jadranskoj ili Kontinentalnoj Hrvatskoj i navedite dva glavna motiva dolaska.', 'Usporedite očekivanu duljinu boravka i dnevnu potrošnju s nacionalnim prosjekom regije.', 'Izdvojite dva elementa ponude koje treba poboljšati, uz pripadajući podatak o zadovoljstvu.', 'Predložite jednu mjeru koja odgovara na trend kraćeg boravka i veće dnevne potrošnje.'],
    note: 'Nacionalni prosjek nije podatak o pojedinoj destinaciji; za lokalne odluke koristite i podatke sustava eVisitor te lokalna istraživanja.',
  },
  editorialUpdate: {
    title: 'Stručni dodatak izvan kanonskog rukopisa',
    checkedAt: '30. listopada 2026.',
    body: 'Ova cjelina temelji se na prezentaciji rezultata istraživanja TOMAS Hrvatska 2025./2026. koju je Institut za turizam predstavio 26. listopada 2026. Brojke nisu dio kanonskih stranica udžbenika, nego suvremena nadogradnja koja ilustrira stanje turizma u Hrvatskoj. Dodatni video i prezentacija „Komparativna analiza” djelomično koriste podatke iz ranijih valova istraživanja (2019. i 2022./2023.).',
    implications: ['Kanonski sadržaj cjelina 1–17 ostaje jasno odvojen od stručnih dodataka u cjelinama 18 i 19.', 'Pri usporedbi uvijek navesti val istraživanja i regiju na koju se podatak odnosi.', 'Za cjelovitu metodologiju i tablice koristiti cjelovito izvješće Instituta za turizam.'],
  },
  sources: [
    { label: 'Institut za turizam (2026)', detail: 'TOMAS Hrvatska 2025./2026. — stavovi i potrošnja turista u Hrvatskoj, prezentacija rezultata, Zagreb, 26. listopada 2026.', url: 'https://www.iztzg.hr' },
  ],
  questions: [
    { question: 'Kako su podaci istraživanja TOMAS Hrvatska 2025./2026. ponderirani da bi rezultati bili reprezentativni?', options: ['Prema broju smještajnih objekata u svakoj županiji', 'Podacima o ostvarenom turističkom prometu iz sustava eVisitor', 'Prema udjelu svake zemlje porijekla u stanovništvu Europe', 'Ponderiranje nije provedeno jer je uzorak slučajan'], correct: 1, explanation: 'Rezultati su utežani podacima o ostvarenom turističkom prometu iz sustava eVisitor, što osigurava reprezentativnost prema stratumima (sl. 5).' },
    { question: 'Koji podatak najbolje pokazuje vjernost inozemnih gostiju Hrvatskoj?', options: ['60 % inozemnih gostiju već je bilo u Hrvatskoj tri ili više puta', '22 % gostiju na obali dolazi prvi put', 'Gosti iz SAD-a troše 280 € dnevno', '65 % gostiju informira se putem interneta'], correct: 0, explanation: 'Tri ili više posjeta ima 60 % inozemnih gostiju, a u kampovima 75 %; najvjerniji su gosti s bliskih tržišta (sl. 12).' },
    { question: 'Koja su dva motiva najvažnija za dolazak turista u Kontinentalnu Hrvatsku?', options: ['More i priroda', 'Wellness i gastronomija', 'Zabava i manifestacije', 'City break i posao, svaki s 22 %'], correct: 3, explanation: 'U Kontinentalnoj Hrvatskoj najvažniji su motivi city break i posao (po 22 %), dok na obali dominiraju more i priroda (sl. 14).' },
    { question: 'Kako se prema istraživanju mijenja duljina boravka turista u Hrvatskoj?', options: ['Boravak se produljuje u obje regije', 'Boravak se produljuje samo u Kontinentalnoj Hrvatskoj', 'Boravak se skraćuje u obje regije', 'Duljina boravka se nije promijenila od 2022.'], correct: 2, explanation: 'Prosječan boravak u mjestu skraćen je na obali ljeti s 8,4 na 6,9, a na kontinentu s 3,4 na 2,8 noćenja (sl. 18).' },
    { question: 'Kako se od 2022. do 2025. promijenila struktura dnevnih izdataka turista u Jadranskoj Hrvatskoj?', options: ['Raste udio ostalih destinacijskih usluga, s 31 % na 34 %', 'Raste udio smještaja, hrane i pića, sa 66 % na 69 %', 'Struktura izdataka ostala je potpuno ista', 'Ukupni dnevni izdaci pali su sa 162 € na 141 €'], correct: 0, explanation: 'Uz rast ukupnih izdataka sa 141 € na 162 €, udio ostalih destinacijskih usluga porastao je s 31 % na 34 % (sl. 26).' },
  ],
  media,
}

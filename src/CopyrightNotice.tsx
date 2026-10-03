import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { book } from './data/book'

/**
 * Samostalni gumb i skočni prozor s autorskopravnom obaviješću — upravlja
 * vlastitim stanjem pa se može postaviti bilo gdje u stablu (zaglavlje
 * aplikacije, naslovna stranica) bez podizanja stanja u roditelja. Po uzoru
 * na CopyrightNotice komponentu na platformi marketing-ai-tutor-rijeka,
 * prilagođeno ovdje kanonskom tekstu, uredničkom/istraživačkom dodatku i
 * autorima ovog udžbenika.
 */
export function CopyrightNotice({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <>
      <button
        type="button"
        className={`icon-button copyright-badge ${className}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Nositelji prava — autorska prava i uvjeti korištenja"
        title="Nositelji prava"
      >
        <span aria-hidden="true">©</span>
      </button>
      {open && <CopyrightModal onClose={() => setOpen(false)} />}
    </>
  )
}

function CopyrightModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="summary-modal copyright-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="copyright-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="icon-button modal-close" onClick={onClose} aria-label="Zatvori obavijest o autorskim pravima">
          <X />
        </button>
        <span className="eyebrow">AUTORSKA PRAVA I UVJETI KORIŠTENJA</span>
        <h2 id="copyright-title">Nositelji prava</h2>

        <p>Sadržaj i programsko rješenje ove platforme su tri odvojena autorska doprinosa:</p>

        <ul>
          <li>
            <strong>Kanonski tekst</strong> — udžbenik <em>{book.title}</em> (kanonski izvor v
            {book.canonicalVersion}, {book.canonicalDate}), autor {book.author}. Koristi se na
            platformi uz suglasnost nositelja prava.
          </li>
          <li>
            <strong>Urednički/istraživački dodatak</strong> — datirane uredničke nadopune i stručni
            dodaci uz kanonski tekst (npr. aktualizacija službenih pokazatelja, stručni dodatak o
            sezonalnosti), autori Ivan Ružić, Tanja Gavrić. Svaki je dodatak u sučelju jasno
            označen i vremenski datiran, odvojeno od kanonskog teksta.
          </li>
          <li>
            <strong>Programsko rješenje platforme</strong> — AI Eduka.
          </li>
        </ul>

        <h3>Osnova i opseg zaštite</h3>
        <p>
          Zaštita proizlazi iz Zakona o autorskom pravu i srodnim pravima (NN 111/21) i nastaje
          automatski, u trenutku stvaranja djela:
        </p>
        <ul>
          <li>kanonski tekst i urednički/istraživački dodatak zaštićeni su kao izvorna autorska djela (čl. 14. st. 1.);</li>
          <li>
            odabir i raspored građe — podjela na cjeline, korake i kvizove te njihova veza sa
            stranicama izvornika — zaštićeni su kao autorska zbirka, neovisno o pravima na
            pojedinim dijelovima (čl. 16.);
          </li>
          <li>programsko rješenje zaštićeno je kao računalni program (čl. 14. st. 2.).</li>
        </ul>
        <p>
          Moralna prava autorâ — pravo na priznanje autorstva i pravo na poštivanje cjelovitosti
          djela (čl. 28. i 29.) — neprenosiva su i pripadaju autorima trajno.
        </p>

        <h3>Što je dopušteno</h3>
        <p>
          Studentima i nastavnicima ustanove koja ima pristup platformi dopušta se čitanje, ispis
          i pohrana primjeraka za osobnu uporabu u učenju i nastavi, uz navođenje izvora. Citiranje
          u seminarskim, završnim i znanstvenim radovima dopušteno je uz uredno navođenje
          kanonskog izvora, njegovih poglavlja i stranica.
        </p>

        <h3>Što nije dopušteno</h3>
        <p>Bez prethodnog pisanog odobrenja nositelja prava nije dopušteno:</p>
        <ul>
          <li>objavljivanje ili činjenje dostupnim javnosti cjeline ili znatnog dijela sadržaja;</li>
          <li>
            komercijalno korištenje, uključujući uvrštavanje u druge nastavne materijale, tečajeve
            ili proizvode;
          </li>
          <li>sustavno preuzimanje sadržaja automatiziranim sredstvima;</li>
          <li>
            korištenje sadržaja za treniranje, dotreniravanje ili evaluaciju sustava umjetne
            inteligencije;
          </li>
          <li>uklanjanje ili izmjena oznaka autorstva i autorskopravnih napomena.</li>
        </ul>

        <h3>Pridržaj prava na rudarenje teksta i podataka</h3>
        <p>
          <strong>
            Nositelji prava izričito pridržavaju pravo na umnožavanje sadržaja ove platforme u
            svrhu rudarenja teksta i podataka
          </strong>
          , u smislu članka 188. Zakona o autorskom pravu i srodnim pravima te članka 4. stavka 3.
          Direktive (EU) 2019/790.
        </p>
        <p>
          Pridržaj obuhvaća sav sadržaj platforme i izražen je strojno čitljivim sredstvima —
          datotekom <code>/.well-known/tdmrep.json</code>, HTTP zaglavljima, HTML metapodacima i
          datotekom <code>robots.txt</code>. Iznimka iz članka 187. ZASP-a, koja se odnosi na
          rudarenje za znanstveno istraživanje što ga provode znanstvene organizacije i ustanove
          kulturne baštine, ostaje netaknuta.
        </p>
        <p>
          Od 2. kolovoza 2025. članak 53. Uredbe (EU) 2024/1689 obvezuje davatelje modela umjetne
          inteligencije opće namjene da uspostave politiku poštivanja autorskog prava i da
          prepoznaju ovako izražene pridržaje.
        </p>

        <h3>Korištenje umjetne inteligencije</h3>
        <p>
          Platforma sadrži asistenta utemeljenog na umjetnoj inteligenciji koji odgovara isključivo
          na temelju sadržaja kanonskog teksta i jasno označenih uredničkih dodataka. Odgovori se
          generiraju automatski i mogu sadržavati pogreške; za ocjenjivanje i ispite mjerodavan je
          kanonski tekst, a ne odgovor asistenta. Ova je obavijest dana sukladno članku 50. Uredbe
          (EU) 2024/1689.
        </p>

        <h3>Licenciranje i kontakt</h3>
        <p>
          Zahtjevi za korištenje izvan navedenih okvira, uključujući institucionalne licencije i
          prijevode, upućuju se na adresu navedenu u impresumu platforme.
        </p>

        <p className="copyright-version">
          Verzija 1.0 · listopad 2026. · Mjerodavno je pravo Republike Hrvatske.
        </p>
      </section>
    </div>,
    document.body,
  )
}

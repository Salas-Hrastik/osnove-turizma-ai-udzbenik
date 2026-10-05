import { CreditCard, X } from 'lucide-react'
import ActivationForm from './ActivationForm'

const PRICING_URL = 'https://www.aieduka.hr/platforme/osnove-turizma#licenciranje'

/**
 * Zastor koji se prikazuje kad korisnik bez važećeg pristupa pokuša otvoriti
 * udžbenik. Nudi dva puta: unos već kupljenog pristupnog koda, ili odlazak
 * na stranicu s cijenama ako pristup još nije kupljen.
 */
export default function AccessGate({ onClose, onActivated }: { onClose: () => void; onActivated: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="summary-modal access-gate"
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-gate-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="icon-button modal-close" onClick={onClose} aria-label="Zatvori">
          <X />
        </button>
        <span className="copyright-modal-kicker">POTREBAN JE PRISTUP</span>
        <h2 id="access-gate-title">Udžbenik zahtijeva aktivaciju</h2>
        <p>
          Pristup punom sadržaju udžbenika dostupan je uz kupljenu pretplatu. Ako ste već
          kupili pristup, unesite kod ispod. Ako još niste, pogledajte cijene i modele pristupa.
        </p>

        <ActivationForm onActivated={onActivated} />

        <a className="access-gate-kupi" href={PRICING_URL} target="_blank" rel="noopener noreferrer">
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          Pogledajte cijene i kupite pristup
        </a>
      </section>
    </div>
  )
}

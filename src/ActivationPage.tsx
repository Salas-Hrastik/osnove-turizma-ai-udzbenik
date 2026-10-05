import { baltazarHeaderArtwork } from './assets/baltazarHeaderArtwork'
import { book } from './data/book'
import ActivationForm from './ActivationForm'

/** Stranica na /aktivacija — odredište poveznice iz e-maila poslanog nakon kupnje. */
export default function ActivationPage() {
  return (
    <main className="activation-page" id="glavni-sadrzaj">
      <div className="activation-page-card">
        <div className="activation-page-brand">
          <span className="activation-page-logo" aria-hidden="true">
            <img src={baltazarHeaderArtwork} alt="" />
          </span>
          <span>
            <strong>{book.title}</strong>
            <small>AI udžbenik</small>
          </span>
        </div>
        <ActivationForm onActivated={() => window.location.assign('/')} />
        <a className="activation-page-natrag" href="/">
          ← Natrag na naslovnicu
        </a>
      </div>
    </main>
  )
}

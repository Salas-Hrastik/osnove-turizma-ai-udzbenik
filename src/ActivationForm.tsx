import { useState } from 'react'
import { CheckCircle2, KeyRound } from 'lucide-react'

/**
 * Dijeljeni obrazac za unos pristupnog koda — koristi se i na /aktivacija
 * stranici (puni prikaz) i u zastoru (AccessGate) kad korisnik bez pristupa
 * pokuša otvoriti udžbenik. Poziva vlastitu serverless funkciju
 * (api/activate.js), koja kod provjerava kod AIEduke i, ako je valjan,
 * postavlja siguran HttpOnly kolačić s potpisanim pristupnim tokenom.
 */
export default function ActivationForm({ onActivated }: { onActivated: () => void }) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function activate(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), token: token.trim() }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        setError(payload?.error || 'Aktivacija nije uspjela. Pokušajte ponovno.')
        setLoading(false)
        return
      }
      onActivated()
    } catch {
      setError('Aktivacija trenutačno nije dostupna. Provjerite internetsku vezu i pokušajte ponovno.')
      setLoading(false)
    }
  }

  return (
    <form className="activation-form" onSubmit={activate}>
      <span className="activation-form-icon" aria-hidden="true"><KeyRound /></span>
      <h2>Unesite pristupni kod</h2>
      <p className="activation-form-opis">
        Kod ste dobili e-poštom nakon kupnje pristupa udžbeniku. Unesite adresu e-pošte
        korištenu pri kupnji i pristupni kod.
      </p>
      <label>
        E-pošta
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ime.prezime@email.com"
          autoComplete="email"
          required
        />
      </label>
      <label>
        Pristupni kod
        <input
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Zalijepite kod iz e-maila"
          autoComplete="one-time-code"
          required
        />
      </label>
      {error && <p className="activation-form-greska">{error}</p>}
      <button type="submit" disabled={loading || !email.trim() || !token.trim()}>
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {loading ? 'Provjera…' : 'Aktiviraj pristup'}
      </button>
    </form>
  )
}

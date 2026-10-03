import { useCallback, useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

/**
 * Gumb za proširenje sadržaja preko cijelog zaslona (Fullscreen API), s
 * mogućnošću smanjenja natrag. Esc i izlazak iz punog zaslona preglednikom
 * (npr. F11) automatski vraćaju ikonu/natpis u uobičajeno stanje, jer oboje
 * okida isti 'fullscreenchange' događaj.
 */
export function FullscreenToggle() {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [])

  return (
    <button
      type="button"
      className="icon-button fullscreen-badge"
      onClick={toggle}
      aria-pressed={fullscreen}
      aria-label={fullscreen ? 'Smanji na uobičajeni prikaz' : 'Proširi preko cijelog zaslona'}
      title={fullscreen ? 'Smanji zaslon (Esc)' : 'Cijeli zaslon'}
    >
      {fullscreen ? <Minimize2 /> : <Maximize2 />}
    </button>
  )
}

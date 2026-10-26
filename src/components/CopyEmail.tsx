import { Check, Copy } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { profile } from '../content'
import { buttonClass } from './Button'

type State = 'idle' | 'copied' | 'error'

export function CopyEmail() {
  const [state, setState] = useState<State>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 2400)
    return () => clearTimeout(t)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setState('copied')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button type="button" onClick={copy} className={buttonClass('secondary')}>
        {state === 'copied' ? <Check size={18} weight="bold" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        Copiar dirección
      </button>
      <p role="status" className="min-h-4 text-xs text-muted">
        {state === 'copied' && `Copiado: ${profile.email}`}
        {state === 'error' && `No se pudo copiar. Selecciona ${profile.email} y cópialo a mano.`}
      </p>
    </div>
  )
}

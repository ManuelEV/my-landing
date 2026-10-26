import { ArrowUpRight, Check, Copy, LinkedinLogo } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { profile } from '../content'

const chip =
  'group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-2 text-sm text-fg select-none transition duration-300 ease-soft hover:border-subtle hover:bg-surface-2 active:scale-[0.98]'

/** Quiet contact row: the email copies on click, LinkedIn opens in a new tab. */
export function ContactLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <CopyEmailChip />
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={chip}>
        <LinkedinLogo size={18} weight="fill" aria-hidden="true" />
        LinkedIn
        <ArrowUpRight
          size={14}
          aria-hidden="true"
          className="text-subtle transition duration-300 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
        />
      </a>
    </div>
  )
}

function CopyEmailChip() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      // without clipboard access, fall back to the mail client
      window.location.href = `mailto:${profile.email}`
    }
  }

  const swap = 'col-start-1 row-start-1 transition duration-500 ease-soft'

  return (
    <>
      <button type="button" onClick={copy} aria-label={`Copiar correo ${profile.email}`} className={chip}>
        {/* the address slides up and "Copiado" takes its place, in the same box so the chip keeps its width */}
        <span className="grid overflow-hidden font-mono">
          <span className={`${swap} ${copied ? '-translate-y-full opacity-0' : ''}`}>{profile.email}</span>
          <span aria-hidden="true" className={`${swap} justify-self-center text-accent ${copied ? '' : 'translate-y-full opacity-0'}`}>
            Copiado
          </span>
        </span>
        <span className="grid size-4 place-items-center">
          <Copy
            size={16}
            aria-hidden="true"
            className={`${swap} text-subtle group-hover:text-fg ${copied ? 'scale-50 opacity-0' : ''}`}
          />
          <Check size={16} weight="bold" aria-hidden="true" className={`${swap} text-accent ${copied ? '' : 'scale-50 opacity-0'}`} />
        </span>
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Correo copiado' : ''}
      </span>
    </>
  )
}

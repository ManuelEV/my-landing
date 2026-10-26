import { EnvelopeSimple } from '@phosphor-icons/react'
import { finalCta, hero, profile } from '../content'
import { ButtonLink } from './Button'
import { CopyEmail } from './CopyEmail'
import { Reveal } from './Reveal'

export function FinalCta() {
  return (
    <section id="contacto" className="px-4 py-24 sm:px-6">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-12">
        <h2 className="text-gradient-hero max-w-[680px] text-4xl font-semibold tracking-tight sm:text-5xl">
          {finalCta.title}
        </h2>
        <p className="mt-6 max-w-[560px] text-lg text-muted">{finalCta.body}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
          <ButtonLink href={`mailto:${profile.email}`}>
            <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
            {hero.cta}
          </ButtonLink>
          <CopyEmail />
        </div>
        <p className="mt-4 font-mono text-xs text-subtle">
          {profile.email} · {profile.location}
        </p>
      </Reveal>
    </section>
  )
}

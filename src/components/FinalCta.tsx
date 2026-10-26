import { finalCta, profile } from '../content'
import { ContactLinks } from './ContactLinks'
import { Reveal } from './Reveal'

/** Closing section: same quiet contact row as the hero, the email copies and LinkedIn opens. */
export function FinalCta() {
  return (
    <section id="contacto" className="px-4 py-24 sm:px-6">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="font-mono text-sm text-accent">Contacto</p>
        <h2 className="text-gradient-hero mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{finalCta.title}</h2>
        <p className="mt-6 max-w-[560px] text-lg text-muted">{finalCta.body}</p>
        <div className="mt-8">
          <ContactLinks />
        </div>
        <p className="mt-6 font-mono text-xs text-subtle">{profile.location}</p>
      </Reveal>
    </section>
  )
}

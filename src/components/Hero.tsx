import { hero, trajectory } from '../content'
import { ContactLinks } from './ContactLinks'
import { Showcase } from './showcase/Showcase'
import { Trajectory } from './Trajectory'

export function Hero() {
  return (
    <section id="inicio" className="relative px-4 pt-24 pb-4 sm:px-6 md:pt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center pt-16 text-center">
        <p className="reveal is-in mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
          <span className="relative flex size-2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {hero.eyebrow}
          <span className="hidden sm:inline">{hero.eyebrowPlace}</span>
        </p>

        <h1 className="text-gradient-hero max-w-[680px] text-3xl font-semibold tracking-tight min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
          {hero.headline.map((line) => (
            <span key={line} className="block sm:whitespace-nowrap">
              {line}{' '}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-[680px] text-lg text-muted">{hero.sub}</p>

        <div className="mt-8">
          <ContactLinks />
        </div>

        <Showcase />

        <div className="reveal is-in mt-16 w-full max-w-4xl border-y border-line py-10">
          <p className="font-mono text-sm text-accent">{trajectory.label}</p>
          <Trajectory />
        </div>
      </div>
    </section>
  )
}

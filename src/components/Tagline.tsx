import { useEffect, useRef, useState } from 'react'
import { tagline } from '../content'

const words = tagline.split(' ')

/**
 * Tagline reveal (landing-page-design B11): every word starts muted and
 * activates in reading order as the block scrolls through the viewport.
 * One scroll listener, throttled through requestAnimationFrame.
 */
export function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight
      const rect = el.getBoundingClientRect()
      // starts when the top reaches 85% of the viewport, ends when the bottom reaches 45%
      const start = vh * 0.85 - rect.top
      const span = vh * 0.4 + rect.height
      const p = Math.min(1, Math.max(0, start / span))
      setCount(Math.round(p * words.length))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section aria-label="Lo que hago" className="px-4 py-24 sm:px-6">
      <p
        ref={ref}
        className="mx-auto max-w-[680px] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
        style={{ textWrap: 'balance' }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            className={`transition-opacity duration-500 ease-soft ${i < count ? 'opacity-100' : 'opacity-30'}`}
          >
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}

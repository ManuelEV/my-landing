import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Website context of design-to-motion: the intro plays once when ~30% of the
 * element is visible, and story loops pause whenever it leaves the viewport.
 */
export function useStory<T extends Element>() {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.intersectionRatio >= 0.3) setEntered(true)
      },
      { threshold: [0, 0.3] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const paused = reduced || !(visible && entered)

  // SMIL animations inside the element follow the same rule. With reduced
  // motion they rest at time 0, which is the finished design.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.querySelectorAll('svg').forEach((svg) => {
      if (paused) {
        svg.pauseAnimations()
        if (reduced) svg.setCurrentTime(0)
      } else {
        svg.unpauseAnimations()
      }
    })
  }, [paused, reduced])

  return { ref, entered, paused }
}

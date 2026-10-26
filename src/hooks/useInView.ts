import { useEffect, useRef, useState } from 'react'

/** Reports visibility through IntersectionObserver. With `once`, it stops after the first hit. */
export function useInView<T extends Element>({ threshold = 0.2, once = true, rootMargin = '0px' } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, inView] as const
}

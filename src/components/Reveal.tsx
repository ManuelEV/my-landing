import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type Props = {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
}

/** Rises 32px and fades in once when it enters the viewport. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 })
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

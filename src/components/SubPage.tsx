import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Nav } from './Nav'
import { SkipLink } from './SkipLink'

/** Shell for the secondary pages: same nav and footer, links point back home. */
export function SubPage({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Nav home={false} />
      <main id="contenido" className="flex min-h-[80dvh] flex-col px-4 pt-24 pb-24 sm:px-6">
        <div className="mx-auto w-full max-w-[680px] pt-16">{children}</div>
      </main>
      <Footer home={false} />
    </>
  )
}

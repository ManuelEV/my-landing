import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary'
type Size = 'md' | 'sm'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none transition duration-300 ease-soft active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<Variant, string> = {
  primary: 'bg-fg text-black border border-transparent hover:bg-white hover:-translate-y-0.5',
  secondary: 'bg-surface-2 text-fg border border-line-strong hover:bg-line hover:-translate-y-0.5',
}

// Main buttons: 16px semibold, 8px by 12px padding. Header buttons: 14px.
const sizes: Record<Size, string> = {
  md: 'text-base px-3 py-2',
  sm: 'text-sm px-3 py-2',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md') {
  return `${base} ${variants[variant]} ${sizes[size]}`
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<'a'> & { variant?: Variant; size?: Size }) {
  return <a className={`${buttonClass(variant, size)} ${className}`} {...props} />
}

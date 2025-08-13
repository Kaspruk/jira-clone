'use client'
 
import Link from 'next/link'
import { useState } from 'react'
 
export function HoverPrefetchLink({
  ref,
  href,
  children,
  className,
}: {
  ref?: React.RefObject<HTMLAnchorElement>
  href: string
  children: React.ReactNode
  className?: string
}) {
  const [active, setActive] = useState(false)
 
  return (
    <Link
      ref={ref}
      href={href}
      prefetch={active ? null : false}
      className={className}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
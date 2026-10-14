"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/train", label: "Train" },
  { href: "/library", label: "Library" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 text-sm">
      {LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              active
                ? "bg-accent-soft text-accent-strong"
                : "text-ink-soft hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

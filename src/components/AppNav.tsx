"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useT } from "@/i18n/LocaleProvider"
import { localePath, type MessageKey } from "@/i18n"

const LINKS: { href: string; key: MessageKey }[] = [
  { href: "/", key: "nav.dashboard" },
  { href: "/train", key: "nav.train" },
  { href: "/library", key: "nav.library" },
  { href: "/progress", key: "nav.progress" },
  { href: "/settings", key: "nav.settings" },
]

export function AppNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useT()

  return (
    <nav aria-label={t("nav.primary")} className="flex flex-wrap items-center gap-1 text-sm">
      {LINKS.map((link) => {
        const href = localePath(locale, link.href)
        const active =
          link.href === "/" ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={link.href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              active
                ? "bg-accent-soft text-accent-strong"
                : "text-ink-soft hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {t(link.key)}
          </Link>
        )
      })}
    </nav>
  )
}

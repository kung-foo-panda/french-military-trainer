import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppNav } from "@/components/AppNav"
import { AuthMenu } from "@/components/AuthMenu"
import { Providers } from "@/components/Providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "French Military Trainer",
  description: "Train French grammar with spaced repetition.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Providers>
            <header className="sticky top-0 z-10 border-b border-border bg-surface/85 backdrop-blur">
              <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                <Link
                  href="/"
                  className="text-sm font-semibold tracking-tight text-ink"
                >
                  French Military Trainer
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <AppNav />
                  <AuthMenu />
                </div>
              </div>
            </header>
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
              {children}
            </main>
            <footer className="mx-auto w-full max-w-5xl px-4 py-6 text-xs text-ink-faint">
              Private study tool. Grammar content derived from a purchased
              reference for personal use only.
            </footer>
          </Providers>
        </div>
      </body>
    </html>
  )
}

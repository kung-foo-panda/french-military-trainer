import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { buttonClass } from "@/components/ui/Button"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge tone="accent">Spaced-repetition trainer</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Bonjour. Ready to train?
        </h1>
        <p className="max-w-2xl text-sm text-ink-soft">
          Each session blends due reviews, your weakest concepts, and new
          material. Answer carefully — wrong or slow items come back sooner.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/train" className={buttonClass("primary")}>
            Start training
          </Link>
          <Link href="/library" className={buttonClass("secondary")}>
            Browse library
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <h2 className="font-medium">Train</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Mixed drills tuned to your current strengths and gaps.
          </p>
        </Card>
        <Card>
          <h2 className="font-medium">Library</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Every concept with a plain-language explanation.
          </p>
        </Card>
        <Card>
          <h2 className="font-medium">Progress</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Mastery and history — landing in a later milestone.
          </p>
        </Card>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { buttonClass } from "@/components/ui/Button"

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="text-sm text-ink-soft">
          Mastery and practice history will appear here.
        </p>
      </header>

      <Card className="space-y-3">
        <h2 className="font-medium">Coming in the next milestone</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>Per-concept mastery (strength, stability, failures)</li>
          <li>Accuracy and average answer time over time</li>
          <li>Daily target completion and streak history</li>
          <li>Reviews due today and weak-concept breakdown</li>
        </ul>
        <div>
          <Link href="/train" className={buttonClass("secondary")}>
            Train now
          </Link>
        </div>
      </Card>
    </div>
  )
}

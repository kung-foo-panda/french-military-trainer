import { AccountPanel } from "@/components/AccountPanel"
import { Card } from "@/components/ui/Card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-ink-soft">
          Account and training preferences.
        </p>
      </header>

      <AccountPanel />

      <Card className="space-y-3">
        <h2 className="font-medium">Coming soon</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>Daily exercise target</li>
          <li>Content and AI-generated data preferences</li>
        </ul>
      </Card>
    </div>
  )
}

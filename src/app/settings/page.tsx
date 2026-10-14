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

      <Card className="space-y-3">
        <h2 className="font-medium">Planned settings</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>Sign in / account (Firebase Auth)</li>
          <li>Daily exercise target</li>
          <li>Device sync across sessions</li>
          <li>Content and AI-generated data preferences</li>
        </ul>
      </Card>
    </div>
  )
}

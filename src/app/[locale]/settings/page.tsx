import { AccountPanel } from "@/components/AccountPanel"
import { Card } from "@/components/ui/Card"
import { getServerT } from "@/i18n/server"
import { DEFAULT_LOCALE, isLocale } from "@/i18n"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getServerT(isLocale(locale) ? locale : DEFAULT_LOCALE)

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("settings.heading")}
        </h1>
        <p className="text-sm text-ink-soft">{t("settings.subtitle")}</p>
      </header>

      <AccountPanel />

      <Card className="space-y-3">
        <h2 className="font-medium">{t("settings.comingSoon")}</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>{t("settings.dailyTarget")}</li>
          <li>{t("settings.contentPrefs")}</li>
        </ul>
      </Card>
    </div>
  )
}

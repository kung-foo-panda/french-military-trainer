/**
 * Phase i18n-1 — the German message catalogue. Annotated as `Messages`, so
 * typecheck fails if any key from `en.ts` is missing or misspelled.
 * French phrases/terminology stay French; only the UI scaffold is German.
 */
import type { Messages } from "./en"

export const de: Messages = {
  // — App shell / metadata —
  "app.title": "French Military Trainer",
  "app.description":
    "Trainiere französische Grammatik mit verteilten Wiederholungen.",
  "app.brand": "French Military Trainer",
  "app.footer":
    "Privates Lernwerkzeug. Grammatikinhalte stammen aus einer gekauften Referenz und dienen ausschließlich dem persönlichen Gebrauch.",

  // — Navigation —
  "nav.primary": "Hauptnavigation",
  "nav.language": "Sprache",
  "nav.dashboard": "Übersicht",
  "nav.train": "Trainieren",
  "nav.library": "Bibliothek",
  "nav.progress": "Fortschritt",
  "nav.settings": "Einstellungen",

  // — Units —
  "unit.dayShort": "T",

  // — Auth menu / sync status —
  "sync.status.synced": "synchronisiert",
  "sync.status.syncing": "synchronisiere",
  "sync.status.error": "Fehler",
  "sync.status.idle": "inaktiv",
  "sync.status.offline": "offline",
  "auth.localOnly": "Nur lokal",
  "auth.signIn": "Anmelden",
  "auth.signOut": "Abmelden",
  "auth.signedIn": "Angemeldet",
  "auth.error": "Etwas ist schiefgelaufen",

  // — Answer evaluation feedback —
  "eval.correct": "Richtig!",
  "eval.wrongAnswer": "Nicht korrekt",
  "eval.wrongAuxiliary": "Falsches Hilfsverb",
  "eval.wrongParticiple": "Falsches Partizip",
  "eval.agreementError": "Kongruenzfehler",
  "eval.wrongAller": "Falsche Form von aller",
  "eval.negationMissing": "Negation fehlt (ne … pas)",

  // — Drill prompts —
  "prompt.translate": "Übersetze „{phrase}“",
  "prompt.replacePronoun": "Ersetze „{phrase}“ durch das korrekte Pronomen",
  "prompt.personSlot": "Welche Person ist „{phrase}“?",
  "prompt.singularOrPlural": "Ist „{phrase}“ Singular oder Plural?",
  "prompt.gender": "Ist „{phrase}“ maskulin oder feminin?",
  "prompt.whichAuxiliary": "Welches Hilfsverb für „{phrase}“?",
  "prompt.conjugate": "Konjugiere: {subject} + {phrase}",
  "prompt.participle": "Partizip: {phrase}",
  "prompt.passeCompose": "Passé composé: {subject} / {phrase}",
  "prompt.negation": "Négation: {subject} / {phrase}",
  "prompt.etrePc": "Passé composé (être): {subject} + {phrase}",
  "prompt.futurProche": "Futur proche: {subject} + {phrase}",
  "prompt.mixedTense": "Présent → passé composé: {subject} + {phrase}",
  "prompt.toNegation": "Passé composé: {subject} / {phrase} → négation",

  // — Mastery bands —
  "band.mastered": "Gemeistert",
  "band.solid": "Stabil",
  "band.developing": "In Entwicklung",
  "band.fragile": "Fragil",
  "band.new": "Neu",

  // — Exercise types —
  "exercise.translate_phrase": "Satz übersetzen",
  "exercise.recognize_subject": "Subjektpronomen erkennen",
  "exercise.classify_person": "Grammatische Person bestimmen",
  "exercise.classify_number": "Singular oder Plural bestimmen",
  "exercise.classify_gender": "Genus des Nomens bestimmen",
  "exercise.conjugate_present": "Im Präsens konjugieren",
  "exercise.form_participle": "Partizip bilden",
  "exercise.build_passe_compose": "Passé composé bilden",
  "exercise.negate_passe_compose": "Passé composé verneinen",
  "exercise.choose_auxiliary": "Hilfsverb wählen",
  "exercise.apply_agreement": "Kongruenz mit être anwenden",
  "exercise.express_near_future": "Nahzukunft ausdrücken",

  // — Grammar glosses —
  "gloss.je": "ich",
  "gloss.suis": "bin",
  "gloss.tu": "du",
  "gloss.es": "bist",
  "gloss.nous": "wir",
  "gloss.sommes": "sind",
  "gloss.j'ai": "habe",
  "gloss.as": "hast",
  "gloss.a": "hat",
  "gloss.avons": "haben",
  "gloss.avez": "habt",
  "gloss.ont": "haben",
  "gloss.il": "er",
  "gloss.elle": "sie",
  "gloss.ils": "sie",
  "gloss.elles": "sie",
  "gloss.vous": "ihr",
  "gloss.est": "ist",
  "gloss.sont": "sind",
  "gloss.êtes": "seid",
  "gloss.unknown": "?",

  // — Account panel —
  "account.title": "Konto",
  "account.notConfigured": "Nicht konfiguriert",
  "account.notConfiguredBody":
    "Firebase-Umgebungsvariablen fehlen, daher läuft die App nur lokal und der Fortschritt bleibt auf diesem Gerät. Kopiere .env.example nach .env.local, trage deine Projektwerte ein und aktiviere dann E-Mail/Passwort- und Google-Anmeldung sowie Firestore in der Firebase-Konsole.",
  "account.checkingSession": "Sitzung wird geprüft…",
  "account.signedInAsPrefix": "Angemeldet als",
  "account.emailSuffix": " ({email})",
  "account.lastSyncedAt": "Zuletzt synchronisiert {time}",
  "account.notSyncedYet": "Noch nicht synchronisiert",
  "account.sync.offline": "Nur lokal",
  "account.sync.idle": "Keine Synchronisierung",
  "account.sync.syncing": "Synchronisiere…",
  "account.sync.synced": "Synchronisiert",
  "account.sync.error": "Synchronisierungsfehler",
  "account.syncNow": "Jetzt synchronisieren",
  "account.signOut": "Abmelden",
  "account.createAccount": "Konto erstellen",
  "account.signIn": "Anmelden",
  "account.haveAccount": "Konto vorhanden? Anmelden",
  "account.newHere": "Neu hier? Konto erstellen",
  "account.emailPlaceholder": "you@example.com",
  "account.passwordPlaceholder": "Passwort",
  "account.working": "Wird verarbeitet…",
  "account.or": "oder",
  "account.continueWithGoogle": "Mit Google fortfahren",

  // — Dashboard —
  "dashboard.badge": "Spaced-Repetition-Trainer",
  "dashboard.heading": "Bonjour. Bereit zum Training?",
  "dashboard.intro":
    "Jede Sitzung kombiniert fällige Wiederholungen, deine schwächsten Themen und neues Material. Antworte sorgfältig — falsche oder langsame Elemente kommen schneller zurück.",
  "dashboard.startTraining": "Training starten",
  "dashboard.viewProgress": "Fortschritt ansehen",
  "dashboard.stat.today": "Heute",
  "dashboard.stat.todayHint": "Abgeschlossene Übungen",
  "dashboard.stat.streak": "Serie",
  "dashboard.stat.dueToday": "Heute fällig",
  "dashboard.stat.weak": "Schwach",
  "dashboard.stat.weakHint": "Ø-Stärke {pct}%",
  "dashboard.todayPlan": "Plan für heute",
  "dashboard.skipDebt":
    "Gestern wurde ausgelassen — das heutige Ziel steigt auf 40.",
  "dashboard.weakest": "Deine Schwachstellen",
  "dashboard.noWeak": "Keine Schwachstellen — weiter so.",
  "dashboard.seeBreakdown": "Vollständige Aufschlüsselung →",
  "dashboard.accuracy7": "Genauigkeit — letzte 7 Tage",
  "dashboard.correctHint": "{correct}/{answers} richtig",
  "dashboard.accuracyEmpty":
    "Beende eine Sitzung, um deine Genauigkeit zu verfolgen.",
  "dashboard.trainTitle": "Training",
  "dashboard.trainBody":
    "Gemischte Übungen, abgestimmt auf deine Stärken und Lücken.",
  "dashboard.libraryTitle": "Bibliothek",
  "dashboard.libraryBody":
    "Jedes Thema mit einer einfachen Erklärung.",
  "dashboard.progressTitle": "Fortschritt",
  "dashboard.progressBody":
    "Meisterschaft, Schwachstellen und deine Übungshistorie.",

  // — Train —
  "train.heading": "Training",
  "train.subtitle":
    "Beantworte jede Aufgabe — falsche oder langsame Elemente kommen schneller zurück.",
  "train.streak": "Serie {days}",
  "train.targetRaised": "Heutiges Ziel auf 40 angehoben",
  "train.weaknessFocus": "Fokus auf Schwächen",
  "train.reinforced": "Verstärkt",
  "train.todayPlan": "Plan für heute",
  "train.stat.session": "Sitzung",
  "train.stat.elapsed": "Vergangen",
  "train.stat.avg": "Ø je Antwort",
  "train.stress.summary":
    "Heute: {sessions} Sitzung(en), {answers} Antworten, {acc}% Genauigkeit, Ø {avg}s",
  "train.stress.decay": " — Rückgang {pct}%, Verlangsamung {slow}s",
  "train.stress.weakest": " — schwächstes: {name} ({pct}%)",
  "train.practice": "Übung",
  "train.recognition": "Wiedererkennen",
  "train.infinitive": "Infinitiv:",
  "train.submit": "Absenden",
  "train.feedback.expected": "{message} — erwartet: {answer}",
  "train.report.title": "Sitzungsbericht",
  "train.report.complete": "Abgeschlossen",
  "train.report.score": "Punkte",
  "train.report.correctPct": "{pct}% richtig",
  "train.report.avg": "Ø je Antwort",
  "train.report.duration": "Dauer",
  "train.report.weakestToday": "Schwächstes heute: {name} ({pct}% von {total})",
  "train.report.byConcept": "Nach Thema",
  "train.report.startNew": "Neue Sitzung starten",

  // — Answer placeholders (by question mode) —
  "placeholder.conjugate": "z. B. je parle",
  "placeholder.participle": "z. B. parlé",
  "placeholder.passe_compose": "z. B. nous avons parlé",
  "placeholder.mixed_tense": "z. B. nous avons parlé",
  "placeholder.negation": "z. B. nous n'avons pas parlé",
  "placeholder.etre_pc": "z. B. elle est allée",
  "placeholder.futur_proche": "z. B. je vais parler",
  "placeholder.default": "Deine Antwort",

  // — Library —
  "library.heading": "Grammatik-Bibliothek",
  "library.intro":
    "{trainable} Themen im Trainingspool in {chapters} Kapiteln. Mit „Referenz“ markierte Themen sind nur für die manuelle Praxis bestimmt.",
  "library.rules": "Regeln",
  "library.inRotation": "Im Pool",
  "library.reference": "Referenz",
  "library.chapter": "Kapitel {number}",
  "library.conceptMeta": "{kind} · Schwierigkeit {difficulty}",
  "library.conceptMetaEncoded": "{kind} · Schwierigkeit {difficulty} · kodiert",

  // — Settings —
  "settings.heading": "Einstellungen",
  "settings.subtitle": "Konto und Trainingspräferenzen.",
  "settings.comingSoon": "Bald",
  "settings.dailyTarget": "Tägliches Übungsziel",
  "settings.contentPrefs":
    "Einstellungen für Inhalte und KI-generierte Daten",

  // — Dev diagnostics —
  "dev.heading": "Diagnose",
  "dev.badge": "Nur Dev",
  "dev.subtitle":
    "Rohzustand zum Debuggen. Kein Teil des Lernpfads.",
  "dev.disabled": "Diagnose ist in Produktionsbuilds deaktiviert.",
  "dev.load": "Aktuellen Zustand laden",
  "dev.enforcement": "Durchsetzung",
  "dev.ranking": "Planer-Ranking ({count} überfällig)",
  "dev.history": "Historie der Tagesmetriken ({count} Tage)",
  "dev.states": "Themenzustände",

  // — Progress —
  "progress.heading": "Fortschritt",
  "progress.subtitle":
    "Meisterschaft im Trainingspool und deine Übungshistorie.",
  "progress.trainNow": "Jetzt trainieren",
  "progress.stat.mastered": "Gemeistert",
  "progress.stat.masteredHint": "Hohe Stärke, stabile Wiedergabe",
  "progress.stat.weak": "Schwach",
  "progress.stat.weakHint": "Unter der Wiederholungsschwelle",
  "progress.stat.dueToday": "Heute fällig",
  "progress.stat.dueTodayHint": "Geplante Wiederholungen",
  "progress.stat.avgStrength": "Ø-Stärke",
  "progress.stat.avgStrengthHint": "Serie {days} Tage",
  "progress.todayPlan": "Plan für heute",
  "progress.raised": "Auf 40 angehoben",
  "progress.completed": "Abgeschlossen",
  "progress.masteryDistribution": "Verteilung der Meisterschaft",
  "progress.conceptsCount": "{count} Themen",
  "progress.accuracy14": "Genauigkeit — letzte 14 Tage",
  "progress.correctHint": "{correct}/{answers} richtig",
  "progress.avgTime": "Ø-Zeit pro Antwort (s)",
  "progress.noSessions":
    "Noch keine Sitzungen — dein Genauigkeitstrend erscheint nach der ersten Sitzung.",
  "progress.noTiming":
    "Antwortzeiten erscheinen, sobald du geübt hast.",
  "progress.weakConcepts": "Schwache Themen",
  "progress.dueForReview": "Zur Wiederholung",
  "progress.nothingWeak": "Nichts unter der Schwelle — weiter so.",
  "progress.everythingScheduled": "Alles ist später eingeplant.",
  "progress.byConcept": "Nach Thema",
  "progress.table.concept": "Thema",
  "progress.table.chapter": "Kapitel",
  "progress.table.level": "Stufe",
  "progress.table.strength": "Stärke",
  "progress.table.stability": "Stabilität",
  "progress.table.failures": "Fehler",

  // — Training plan picker —
  "plan.focus": "Trainingsfokus",
  "plan.poolCount": "{pool} von {total} Themen",
  "plan.reset": "Zurücksetzen",
  "plan.chapters": "Kapitel",
  "plan.exerciseTypes": "Übungstypen",
  "plan.hint":
    "Eine leere Auswahl trainiert alles. Eine Planänderung startet eine neue Sitzung.",

  // — Charts —
  "chart.noData": "Noch keine Daten.",
}

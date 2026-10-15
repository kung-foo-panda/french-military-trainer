/**
 * Phase i18n-1 — the Polish message catalogue. Annotated as `Messages`, so
 * typecheck fails if any key from `en.ts` is missing or misspelled.
 * French phrases/terminology stay French; only the UI scaffold is Polish.
 */
import type { Messages } from "./en"

export const pl: Messages = {
  // — App shell / metadata —
  "app.title": "French Military Trainer",
  "app.description":
    "Ćwicz gramatykę francuską z powtórkami rozłożonymi w czasie.",
  "app.brand": "French Military Trainer",
  "app.footer":
    "Prywatne narzędzie do nauki. Treści gramatyczne pochodzą z zakupionego materiału i służą wyłącznie do użytku osobistego.",

  // — Navigation —
  "nav.primary": "Nawigacja główna",
  "nav.language": "Język",
  "nav.dashboard": "Panel",
  "nav.train": "Trening",
  "nav.library": "Biblioteka",
  "nav.progress": "Postępy",
  "nav.settings": "Ustawienia",

  // — Units —
  "unit.dayShort": "d",

  // — Auth menu / sync status —
  "sync.status.synced": "zsynchronizowane",
  "sync.status.syncing": "synchronizacja",
  "sync.status.error": "błąd",
  "sync.status.idle": "bezczynne",
  "sync.status.offline": "offline",
  "auth.localOnly": "Tylko lokalnie",
  "auth.signIn": "Zaloguj się",
  "auth.signOut": "Wyloguj się",
  "auth.signedIn": "Zalogowano",
  "auth.error": "Coś poszło nie tak",

  // — Answer evaluation feedback —
  "eval.correct": "Poprawnie!",
  "eval.wrongAnswer": "Niepoprawnie",
  "eval.wrongAuxiliary": "Zły czasownik posiłkowy",
  "eval.wrongParticiple": "Błędny imiesłów przeszły",
  "eval.agreementError": "Błąd zgody",
  "eval.wrongAller": "Błędna forma czasownika aller",
  "eval.negationMissing": "Brak negacji (ne … pas)",

  // — Drill prompts —
  "prompt.translate": "Przetłumacz „{phrase}”",
  "prompt.replacePronoun": "Zamień „{phrase}” na poprawny zaimień",
  "prompt.personSlot": "Która osoba to „{phrase}”?",
  "prompt.singularOrPlural": "Czy „{phrase}” jest l. pojedynczej czy mnogiej?",
  "prompt.gender": "Czy „{phrase}” jest rodzaju męskiego czy żeńskiego?",
  "prompt.whichAuxiliary": "Który czasownik posiłkowy dla „{phrase}”?",
  "prompt.conjugate": "Odmień: {subject} + {phrase}",
  "prompt.participle": "Imiesłów przeszły: {phrase}",
  "prompt.passeCompose": "Passé composé: {subject} / {phrase}",
  "prompt.negation": "Négation: {subject} / {phrase}",
  "prompt.etrePc": "Passé composé (être): {subject} + {phrase}",
  "prompt.futurProche": "Futur proche: {subject} + {phrase}",
  "prompt.mixedTense": "Présent → passé composé: {subject} + {phrase}",
  "prompt.toNegation": "Passé composé: {subject} / {phrase} → négation",

  // — Mastery bands —
  "band.mastered": "Opanowane",
  "band.solid": "Pewne",
  "band.developing": "Rozwijane",
  "band.fragile": "Chwiejne",
  "band.new": "Nowe",

  // — Exercise types —
  "exercise.translate_phrase": "Przetłumacz frazę",
  "exercise.recognize_subject": "Rozpoznaj zaimen osobowy",
  "exercise.classify_person": "Określ osobę gramatyczną",
  "exercise.classify_number": "Odróżnij l. pojedynczą od mnogiej",
  "exercise.classify_gender": "Określ rodzaj rzeczownika",
  "exercise.conjugate_present": "Odmień w czasie teraźniejszym",
  "exercise.form_participle": "Utwórz imiesłów przeszły",
  "exercise.build_passe_compose": "Zbuduj passé composé",
  "exercise.negate_passe_compose": "Zaneguj passé composé",
  "exercise.choose_auxiliary": "Wybierz czasownik posiłkowy",
  "exercise.apply_agreement": "Zastosuj zgodę z être",
  "exercise.express_near_future": "Wyraź przyszłość bliską",

  // — Grammar glosses —
  "gloss.je": "ja",
  "gloss.suis": "jestem",
  "gloss.tu": "ty",
  "gloss.es": "jesteś",
  "gloss.nous": "my",
  "gloss.sommes": "jesteśmy",
  "gloss.j'ai": "mam",
  "gloss.as": "masz",
  "gloss.a": "ma",
  "gloss.avons": "mamy",
  "gloss.avez": "macie",
  "gloss.ont": "mają",
  "gloss.il": "on",
  "gloss.elle": "ona",
  "gloss.ils": "oni",
  "gloss.elles": "one",
  "gloss.vous": "wy",
  "gloss.est": "jest",
  "gloss.sont": "są",
  "gloss.êtes": "jesteście",
  "gloss.unknown": "?",

  // — Account panel —
  "account.title": "Konto",
  "account.notConfigured": "Nieskonfigurowane",
  "account.notConfiguredBody":
    "Brakuje zmiennych środowiskowych Firebase, więc aplikacja działa tylko lokalnie, a postęp pozostaje na tym urządzeniu. Skopiuj .env.example do .env.local, uzupełnij wartości projektu, a następnie włącz logowanie e-mail/hasło i Google oraz Firestore w konsoli Firebase.",
  "account.checkingSession": "Sprawdzanie sesji…",
  "account.signedInAsPrefix": "Zalogowano jako",
  "account.emailSuffix": " ({email})",
  "account.lastSyncedAt": "Ostatnia synchronizacja {time}",
  "account.notSyncedYet": "Jeszcze nie synchronizowano",
  "account.sync.offline": "Tylko lokalnie",
  "account.sync.idle": "Brak synchronizacji",
  "account.sync.syncing": "Synchronizacja…",
  "account.sync.synced": "Zsynchronizowano",
  "account.sync.error": "Błąd synchronizacji",
  "account.syncNow": "Synchronizuj teraz",
  "account.signOut": "Wyloguj się",
  "account.createAccount": "Utwórz konto",
  "account.signIn": "Zaloguj się",
  "account.haveAccount": "Masz konto? Zaloguj się",
  "account.newHere": "Pierwszy raz? Utwórz konto",
  "account.emailPlaceholder": "you@example.com",
  "account.passwordPlaceholder": "Hasło",
  "account.working": "Przetwarzanie…",
  "account.or": "lub",
  "account.continueWithGoogle": "Kontynuuj z Google",

  // — Dashboard —
  "dashboard.badge": "Trener powtórek rozłożonych w czasie",
  "dashboard.heading": "Bonjour. Czas na trening?",
  "dashboard.intro":
    "Każda sesja łączy powtórki wymagane na dziś, Twoje najsłabsze zagadnienia i nowy materiał. Odpowiadaj uważnie — błędne lub wolne elementy wracają wcześniej.",
  "dashboard.startTraining": "Rozpocznij trening",
  "dashboard.viewProgress": "Zobacz postępy",
  "dashboard.stat.today": "Dziś",
  "dashboard.stat.todayHint": "Ukończone ćwiczenia",
  "dashboard.stat.streak": "Seria",
  "dashboard.stat.dueToday": "Na dziś",
  "dashboard.stat.weak": "Słabe",
  "dashboard.stat.weakHint": "Średnia siła {pct}%",
  "dashboard.todayPlan": "Plan na dziś",
  "dashboard.skipDebt":
    "Wczoraj było pominięte — dzisiejszy cel zwiększony do 40.",
  "dashboard.weakest": "Najsłabsze punkty",
  "dashboard.noWeak": "Brak słabych punktów — utrzymaj serię.",
  "dashboard.seeBreakdown": "Zobacz pełny podział →",
  "dashboard.accuracy7": "Dokładność — ostatnie 7 dni",
  "dashboard.correctHint": "{correct}/{answers} poprawnych",
  "dashboard.accuracyEmpty":
    "Ukończ sesję, aby zacząć śledzić swoją dokładność.",
  "dashboard.trainTitle": "Trening",
  "dashboard.trainBody":
    "Mieszane ćwiczenia dopasowane do Twoich mocnych i słabych stron.",
  "dashboard.libraryTitle": "Biblioteka",
  "dashboard.libraryBody":
    "Każde zagadnienie z prostym wyjaśnieniem.",
  "dashboard.progressTitle": "Postępy",
  "dashboard.progressBody":
    "Opanowanie, słabe punkty i historia ćwiczeń.",

  // — Train —
  "train.heading": "Trening",
  "train.subtitle":
    "Odpowiadaj na każde ćwiczenie — błędne lub wolne elementy wracają wcześniej.",
  "train.streak": "Seria {days}",
  "train.targetRaised": "Dzisiejszy cel podniesiony do 40",
  "train.weaknessFocus": "Skupienie na słabości",
  "train.reinforced": "Wzmocnione",
  "train.todayPlan": "Plan na dziś",
  "train.stat.session": "Sesja",
  "train.stat.elapsed": "Upłynęło",
  "train.stat.avg": "Śr. na odpowiedź",
  "train.stress.summary":
    "Dziś: {sessions} sesji, {answers} odpowiedzi, {acc}% dokładności, śr. {avg}s",
  "train.stress.decay": " — spadek {pct}%, spowolnienie {slow}s",
  "train.stress.weakest": " — najsłabszy: {name} ({pct}%)",
  "train.practice": "Praktyka",
  "train.recognition": "Rozpoznawanie",
  "train.infinitive": "Bezokolicznik:",
  "train.submit": "Wyślij",
  "train.feedback.expected": "{message} — oczekiwano: {answer}",
  "train.report.title": "Raport z sesji",
  "train.report.complete": "Zakończona",
  "train.report.score": "Wynik",
  "train.report.correctPct": "{pct}% poprawnych",
  "train.report.avg": "Śr. na odpowiedź",
  "train.report.duration": "Czas trwania",
  "train.report.weakestToday": "Najsłabszy dzisiaj: {name} ({pct}% z {total})",
  "train.report.byConcept": "Według zagadnienia",
  "train.report.startNew": "Rozpocznij nową sesję",

  // — Answer placeholders (by question mode) —
  "placeholder.conjugate": "np. je parle",
  "placeholder.participle": "np. parlé",
  "placeholder.passe_compose": "np. nous avons parlé",
  "placeholder.mixed_tense": "np. nous avons parlé",
  "placeholder.negation": "np. nous n'avons pas parlé",
  "placeholder.etre_pc": "np. elle est allée",
  "placeholder.futur_proche": "np. je vais parler",
  "placeholder.default": "Twoja odpowiedź",

  // — Answer input aids —
  "input.specialChars": "Francuskie znaki specjalne",

  // — Library —
  "library.heading": "Biblioteka gramatyki",
  "library.intro":
    "{trainable} zagadnień w rotacji treningowej w {chapters} rozdziałach. Zagadnienia oznaczone jako „Materiał referencyjny” służą tylko do praktyki ręcznej.",
  "library.rules": "Reguły",
  "library.inRotation": "W rotacji",
  "library.reference": "Materiał referencyjny",
  "library.chapter": "Rozdział {number}",
  "library.conceptMeta": "{kind} · trudność {difficulty}",
  "library.conceptMetaEncoded": "{kind} · trudność {difficulty} · zakodowane",

  // — Settings —
  "settings.heading": "Ustawienia",
  "settings.subtitle": "Konto i preferencje treningowe.",
  "settings.comingSoon": "Wkrótce",
  "settings.dailyTarget": "Dzienny cel ćwiczeń",
  "settings.contentPrefs": "Preferencje treści i danych generowanych przez AI",

  // — Dev diagnostics —
  "dev.heading": "Diagnostyka",
  "dev.badge": "Tylko dev",
  "dev.subtitle":
    "Surowy zapisany stan do debugowania. Nie jest częścią ścieżki ucznia.",
  "dev.disabled": "Diagnostyka jest wyłączona w wersjach produkcyjnych.",
  "dev.load": "Załaduj bieżący stan",
  "dev.enforcement": "Wymuszanie",
  "dev.ranking": "Ranking planisty ({count} zaległych)",
  "dev.history": "Historia dziennych metryk ({count} dni)",
  "dev.states": "Stany zagadnień",

  // — Progress —
  "progress.heading": "Postępy",
  "progress.subtitle":
    "Opanowanie w puli treningowej oraz Twoja historia ćwiczeń.",
  "progress.trainNow": "Trenuj teraz",
  "progress.stat.mastered": "Opanowane",
  "progress.stat.masteredHint": "Wysoka siła, stabilne przypominanie",
  "progress.stat.weak": "Słabe",
  "progress.stat.weakHint": "Poniżej progu powtórek",
  "progress.stat.dueToday": "Na dziś",
  "progress.stat.dueTodayHint": "Zaplanowane powtórki",
  "progress.stat.avgStrength": "Średnia siła",
  "progress.stat.avgStrengthHint": "Seria {days} dni",
  "progress.todayPlan": "Plan na dziś",
  "progress.raised": "Podniesiony do 40",
  "progress.completed": "Ukończone",
  "progress.masteryDistribution": "Rozkład opanowania",
  "progress.conceptsCount": "{count} zagadnień",
  "progress.accuracy14": "Dokładność — ostatnie 14 dni",
  "progress.correctHint": "{correct}/{answers} poprawnych",
  "progress.avgTime": "Średni czas na odpowiedź (s)",
  "progress.noSessions":
    "Brak zapisanych sesji — trend dokładności pojawi się po pierwszej sesji.",
  "progress.noTiming": "Czas odpowiedzi pojawi się po pierwszej praktyce.",
  "progress.weakConcepts": "Słabe zagadnienia",
  "progress.dueForReview": "Do powtórki",
  "progress.nothingWeak": "Nic poniżej progu — dobra robota.",
  "progress.everythingScheduled": "Wszystko jest zaplanowane na później.",
  "progress.byConcept": "Według zagadnienia",
  "progress.table.concept": "Zagadnienie",
  "progress.table.chapter": "Rozdział",
  "progress.table.level": "Poziom",
  "progress.table.strength": "Siła",
  "progress.table.stability": "Stabilność",
  "progress.table.failures": "Błędy",

  // — Training plan picker —
  "plan.focus": "Skupienie treningowe",
  "plan.poolCount": "{pool} z {total} zagadnień",
  "plan.reset": "Resetuj",
  "plan.chapters": "Rozdziały",
  "plan.exerciseTypes": "Typy ćwiczeń",
  "plan.hint":
    "Pusty wybór oznacza trening wszystkiego. Zmiana planu rozpoczyna nową sesję.",

  // — Charts —
  "chart.noData": "Brak danych.",
}

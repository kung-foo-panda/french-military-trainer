/**
 * Phase i18n-1 — the English message catalogue, and the source of truth for
 * every UI string. The `Messages` type is inferred from this object, so any
 * other locale is forced to define exactly the same keys (missing or extra
 * keys fail typecheck). Keys are flat and namespaced by area.
 *
 * Interpolation uses `{name}` placeholders.
 */
export const en = {
  // — App shell / metadata —
  "app.title": "French Military Trainer",
  "app.description": "Train French grammar with spaced repetition.",
  "app.brand": "French Military Trainer",
  "app.footer":
    "Private study tool. Grammar content derived from a purchased reference for personal use only.",

  // — Navigation —
  "nav.primary": "Primary",
  "nav.language": "Language",
  "nav.dashboard": "Dashboard",
  "nav.train": "Train",
  "nav.library": "Library",
  "nav.progress": "Progress",
  "nav.settings": "Settings",

  // — Units —
  "unit.dayShort": "d",

  // — Auth menu / sync status (raw values shown as-is in the header) —
  "sync.status.synced": "synced",
  "sync.status.syncing": "syncing",
  "sync.status.error": "error",
  "sync.status.idle": "idle",
  "sync.status.offline": "offline",
  "auth.localOnly": "Local only",
  "auth.signIn": "Sign in",
  "auth.signOut": "Sign out",
  "auth.signedIn": "Signed in",
  "auth.error": "Something went wrong",

  // — Answer evaluation feedback (surfaced in the train feedback banner) —
  "eval.correct": "Correct!",
  "eval.wrongAnswer": "Not correct",
  "eval.wrongAuxiliary": "Wrong auxiliary",
  "eval.wrongParticiple": "Wrong past participle",
  "eval.agreementError": "Agreement error",
  "eval.wrongAller": "Wrong form of aller",
  "eval.negationMissing": "Negation missing (ne … pas)",

  // — Drill prompts — French phrases/terminology stay French in every locale;
  //    only the surrounding scaffold is translated. {phrase} is always the
  //    French item under scrutiny, {subject} the French subject pronoun.
  "prompt.translate": "Translate \u201c{phrase}\u201d",
  "prompt.replacePronoun": "Replace \u201c{phrase}\u201d with the correct pronoun",
  "prompt.personSlot": "Which person slot is \u201c{phrase}\u201d?",
  "prompt.singularOrPlural": "Is \u201c{phrase}\u201d singular or plural?",
  "prompt.gender": "Is \u201c{phrase}\u201d masculine or feminine?",
  "prompt.whichAuxiliary": "Which auxiliary for \u201c{phrase}\u201d?",
  "prompt.conjugate": "Conjugate: {subject} + {phrase}",
  "prompt.participle": "Past participle: {phrase}",
  "prompt.passeCompose": "Pass\u00e9 compos\u00e9: {subject} / {phrase}",
  "prompt.negation": "N\u00e9gation: {subject} / {phrase}",
  "prompt.etrePc": "Pass\u00e9 compos\u00e9 (\u00eatre): {subject} + {phrase}",
  "prompt.futurProche": "Futur proche: {subject} + {phrase}",
  "prompt.mixedTense": "Pr\u00e9sent \u2192 pass\u00e9 compos\u00e9: {subject} + {phrase}",
  "prompt.toNegation": "Pass\u00e9 compos\u00e9: {subject} / {phrase} \u2192 n\u00e9gation",

  // — Mastery bands —
  "band.mastered": "Mastered",
  "band.solid": "Solid",
  "band.developing": "Developing",
  "band.fragile": "Fragile",
  "band.new": "New",

  // — Exercise types (training plan chips, library badges) —
  "exercise.translate_phrase": "Translate a phrase",
  "exercise.recognize_subject": "Recognize the subject pronoun",
  "exercise.classify_person": "Classify grammatical person",
  "exercise.classify_number": "Classify singular vs plural",
  "exercise.classify_gender": "Classify noun gender",
  "exercise.conjugate_present": "Conjugate in the present",
  "exercise.form_participle": "Form the past participle",
  "exercise.build_passe_compose": "Build the pass\u00e9 compos\u00e9",
  "exercise.negate_passe_compose": "Negate the pass\u00e9 compos\u00e9",
  "exercise.choose_auxiliary": "Choose the auxiliary",
  "exercise.apply_agreement": "Apply \u00eatre agreement",
  "exercise.express_near_future": "Express the near future",

  // — Grammar glosses shown under train answers —
  "gloss.je": "I",
  "gloss.suis": "am",
  "gloss.tu": "you",
  "gloss.es": "are",
  "gloss.nous": "we",
  "gloss.sommes": "are",
  "gloss.j'ai": "I have",
  "gloss.as": "have",
  "gloss.a": "has",
  "gloss.avons": "have",
  "gloss.avez": "have",
  "gloss.ont": "have",
  "gloss.il": "he",
  "gloss.elle": "she",
  "gloss.ils": "they",
  "gloss.elles": "they",
  "gloss.vous": "you",
  "gloss.est": "is",
  "gloss.sont": "are",
  "gloss.\u00eates": "are",
  "gloss.unknown": "?",

  // — Account panel —
  "account.title": "Account",
  "account.notConfigured": "Not configured",
  "account.notConfiguredBody":
    "Firebase env vars are missing, so the app runs local-only and progress stays on this device. Copy .env.example to .env.local, add your project values, then enable Email/Password and Google sign-in plus Firestore in the Firebase console.",
  "account.checkingSession": "Checking session…",
  "account.signedInAsPrefix": "Signed in as",
  "account.emailSuffix": " ({email})",
  "account.lastSyncedAt": "Last synced {time}",
  "account.notSyncedYet": "Not synced yet",
  "account.sync.offline": "Local only",
  "account.sync.idle": "Not syncing",
  "account.sync.syncing": "Syncing…",
  "account.sync.synced": "Synced",
  "account.sync.error": "Sync error",
  "account.syncNow": "Sync now",
  "account.signOut": "Sign out",
  "account.createAccount": "Create account",
  "account.signIn": "Sign in",
  "account.haveAccount": "Have an account? Sign in",
  "account.newHere": "New here? Create account",
  "account.emailPlaceholder": "you@example.com",
  "account.passwordPlaceholder": "Password",
  "account.working": "Working…",
  "account.or": "or",
  "account.continueWithGoogle": "Continue with Google",

  // — Dashboard —
  "dashboard.badge": "Spaced-repetition trainer",
  "dashboard.heading": "Bonjour. Ready to train?",
  "dashboard.intro":
    "Each session blends due reviews, your weakest concepts, and new material. Answer carefully — wrong or slow items come back sooner.",
  "dashboard.startTraining": "Start training",
  "dashboard.viewProgress": "View progress",
  "dashboard.stat.today": "Today",
  "dashboard.stat.todayHint": "Exercises completed",
  "dashboard.stat.streak": "Streak",
  "dashboard.stat.dueToday": "Due today",
  "dashboard.stat.weak": "Weak",
  "dashboard.stat.weakHint": "Avg strength {pct}%",
  "dashboard.todayPlan": "Today’s plan",
  "dashboard.skipDebt":
    "Yesterday was missed — today’s target is raised to 40.",
  "dashboard.weakest": "Where you’re weakest",
  "dashboard.noWeak": "No weak spots right now — keep the streak going.",
  "dashboard.seeBreakdown": "See full breakdown →",
  "dashboard.accuracy7": "Accuracy — last 7 days",
  "dashboard.correctHint": "{correct}/{answers} correct",
  "dashboard.accuracyEmpty":
    "Finish a session to start tracking your accuracy.",
  "dashboard.trainTitle": "Train",
  "dashboard.trainBody": "Mixed drills tuned to your current strengths and gaps.",
  "dashboard.libraryTitle": "Library",
  "dashboard.libraryBody": "Every concept with a plain-language explanation.",
  "dashboard.progressTitle": "Progress",
  "dashboard.progressBody": "Mastery, weak spots, and your practice history.",

  // — Train —
  "train.heading": "Train",
  "train.subtitle": "Answer each drill — wrong or slow items return sooner.",
  "train.streak": "Streak {days}",
  "train.targetRaised": "Today’s target raised to 40",
  "train.weaknessFocus": "Weakness focus",
  "train.reinforced": "Reinforced",
  "train.todayPlan": "Today’s plan",
  "train.stat.session": "Session",
  "train.stat.elapsed": "Elapsed",
  "train.stat.avg": "Avg / answer",
  "train.stress.summary":
    "Today: {sessions} session(s), {answers} answers, {acc}% acc, avg {avg}s",
  "train.stress.decay": " — decay {pct}%, slowdown {slow}s",
  "train.stress.weakest": " — weakest: {name} ({pct}%)",
  "train.practice": "Practice",
  "train.recognition": "Recognition",
  "train.infinitive": "Infinitive:",
  "train.submit": "Submit",
  "train.feedback.expected": "{message} — expected: {answer}",
  "train.report.title": "Session report",
  "train.report.complete": "Complete",
  "train.report.score": "Score",
  "train.report.correctPct": "{pct}% correct",
  "train.report.avg": "Avg / answer",
  "train.report.duration": "Duration",
  "train.report.weakestToday": "Weakest today: {name} ({pct}% over {total})",
  "train.report.byConcept": "By concept",
  "train.report.startNew": "Start new session",

  // — Answer placeholders (by question mode) —
  "placeholder.conjugate": "e.g. je parle",
  "placeholder.participle": "e.g. parlé",
  "placeholder.passe_compose": "e.g. nous avons parlé",
  "placeholder.mixed_tense": "e.g. nous avons parlé",
  "placeholder.negation": "e.g. nous n'avons pas parlé",
  "placeholder.etre_pc": "e.g. elle est allée",
  "placeholder.futur_proche": "e.g. je vais parler",
  "placeholder.default": "Your answer",

  // — Library —
  "library.heading": "Grammar Library",
  "library.intro":
    "{trainable} concepts in the training rotation across {chapters} chapters. Concepts marked “Reference” are kept for manual practice only.",
  "library.rules": "Rules",
  "library.inRotation": "In rotation",
  "library.reference": "Reference",
  "library.chapter": "Chapter {number}",
  "library.conceptMeta": "{kind} · difficulty {difficulty}",
  "library.conceptMetaEncoded": "{kind} · difficulty {difficulty} · encoded",

  // — Settings —
  "settings.heading": "Settings",
  "settings.subtitle": "Account and training preferences.",
  "settings.comingSoon": "Coming soon",
  "settings.dailyTarget": "Daily exercise target",
  "settings.contentPrefs": "Content and AI-generated data preferences",

  // — Dev diagnostics —
  "dev.heading": "Diagnostics",
  "dev.badge": "Dev only",
  "dev.subtitle": "Raw persisted state for debugging. Not part of the learner flow.",
  "dev.disabled": "Diagnostics are disabled in production builds.",
  "dev.load": "Load current state",
  "dev.enforcement": "Enforcement",
  "dev.ranking": "Scheduler ranking ({count} overdue)",
  "dev.history": "Daily metrics history ({count} day(s))",
  "dev.states": "Concept states",

  // — Progress —
  "progress.heading": "Progress",
  "progress.subtitle":
    "Mastery across the training pool, plus your practice history.",
  "progress.trainNow": "Train now",
  "progress.stat.mastered": "Mastered",
  "progress.stat.masteredHint": "High strength, stable recall",
  "progress.stat.weak": "Weak",
  "progress.stat.weakHint": "Below the review threshold",
  "progress.stat.dueToday": "Due today",
  "progress.stat.dueTodayHint": "Scheduled reviews",
  "progress.stat.avgStrength": "Avg strength",
  "progress.stat.avgStrengthHint": "Streak {days} day(s)",
  "progress.todayPlan": "Today’s plan",
  "progress.raised": "Raised to 40",
  "progress.completed": "Completed",
  "progress.masteryDistribution": "Mastery distribution",
  "progress.conceptsCount": "{count} concepts",
  "progress.accuracy14": "Accuracy — last 14 days",
  "progress.correctHint": "{correct}/{answers} correct",
  "progress.avgTime": "Avg time per answer (s)",
  "progress.noSessions":
    "No sessions recorded yet — your accuracy trend appears after your first session.",
  "progress.noTiming": "Answer timing appears once you have practiced.",
  "progress.weakConcepts": "Weak concepts",
  "progress.dueForReview": "Due for review",
  "progress.nothingWeak": "Nothing below the threshold — nice work.",
  "progress.everythingScheduled": "Everything is scheduled for later.",
  "progress.byConcept": "By concept",
  "progress.table.concept": "Concept",
  "progress.table.chapter": "Chapter",
  "progress.table.level": "Level",
  "progress.table.strength": "Strength",
  "progress.table.stability": "Stability",
  "progress.table.failures": "Failures",

  // — Training plan picker —
  "plan.focus": "Training focus",
  "plan.poolCount": "{pool} of {total} concepts",
  "plan.reset": "Reset",
  "plan.chapters": "Chapters",
  "plan.exerciseTypes": "Exercise types",
  "plan.hint":
    "Selecting nothing trains everything. Changing the focus starts a new session.",

  // — Charts —
  "chart.noData": "No data yet.",
}

export type Messages = typeof en
export type MessageKey = keyof Messages

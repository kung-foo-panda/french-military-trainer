import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

/**
 * Phase 3 — Firebase client. Config comes from NEXT_PUBLIC_* env vars so the
 * static export stays self-contained; when they are absent the app runs
 * local-only and no Firebase code paths are exercised.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId)
}

function app(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured (missing NEXT_PUBLIC_FIREBASE_* env)")
  }
  return getApps().length > 0 ? getApp() : initializeApp(config)
}

let cachedAuth: Auth | null = null
let cachedDb: Firestore | null = null

export function firebaseAuth(): Auth {
  if (!cachedAuth) cachedAuth = getAuth(app())
  return cachedAuth
}

export function firebaseDb(): Firestore {
  if (!cachedDb) cachedDb = getFirestore(app())
  return cachedDb
}

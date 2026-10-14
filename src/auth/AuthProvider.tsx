"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth"
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase"
import { toAuthUser, type AuthUser } from "./authTypes"

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  configured: boolean
  error: string | null
  signInEmail: (email: string, password: string) => Promise<void>
  registerEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(() => isFirebaseConfigured())
  const [error, setError] = useState<string | null>(null)
  const configured = isFirebaseConfigured()

  useEffect(() => {
    if (!configured) return

    const unsubscribe = onAuthStateChanged(firebaseAuth(), (firebaseUser) => {
      setUser(firebaseUser ? toAuthUser(firebaseUser) : null)
      setLoading(false)
    })
    return unsubscribe
  }, [configured])

  const run = useCallback(async (action: () => Promise<UserCredential>) => {
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(messageOf(err))
      throw err
    }
  }, [])

  const signInEmail = useCallback(
    (email: string, password: string) =>
      run(() => signInWithEmailAndPassword(firebaseAuth(), email, password)),
    [run]
  )

  const registerEmail = useCallback(
    (email: string, password: string) =>
      run(() => createUserWithEmailAndPassword(firebaseAuth(), email, password)),
    [run]
  )

  const signInGoogle = useCallback(
    () => run(() => signInWithPopup(firebaseAuth(), new GoogleAuthProvider())),
    [run]
  )

  const signOut = useCallback(async () => {
    setError(null)
    await firebaseSignOut(firebaseAuth())
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured,
      error,
      signInEmail,
      registerEmail,
      signInGoogle,
      signOut,
    }),
    [user, loading, configured, error, signInEmail, registerEmail, signInGoogle, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within <AuthProvider>")
  return context
}

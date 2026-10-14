/** Phase 3 — UI-agnostic view of the signed-in user. */
export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  providers: string[]
}

/**
 * Structural subset of a Firebase `User`, so this mapping stays pure and
 * testable without importing the Firebase SDK.
 */
export type FirebaseUserLike = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  providerData: { providerId: string }[]
}

export function toAuthUser(user: FirebaseUserLike): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providers: user.providerData.map((p) => p.providerId),
  }
}

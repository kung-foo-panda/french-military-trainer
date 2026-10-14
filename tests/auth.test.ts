import test from "node:test"
import assert from "node:assert/strict"
import { toAuthUser, type FirebaseUserLike } from "../src/auth/authTypes"

test("toAuthUser maps profile fields and providers", () => {
  const firebaseUser: FirebaseUserLike = {
    uid: "abc123",
    email: "learner@example.com",
    displayName: "Learner",
    photoURL: "https://example.com/p.png",
    providerData: [{ providerId: "google.com" }, { providerId: "password" }],
  }

  const user = toAuthUser(firebaseUser)
  assert.equal(user.uid, "abc123")
  assert.equal(user.email, "learner@example.com")
  assert.equal(user.displayName, "Learner")
  assert.deepEqual(user.providers, ["google.com", "password"])
})

test("toAuthUser tolerates missing optional fields", () => {
  const user = toAuthUser({
    uid: "u1",
    email: null,
    displayName: null,
    photoURL: null,
    providerData: [],
  })
  assert.equal(user.email, null)
  assert.deepEqual(user.providers, [])
})

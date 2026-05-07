// ─────────────────────────────────────────────
// Firebase Client SDK — lazy async initialisation
//
// NEXT_PUBLIC_* vars are not baked into the bundle at build time on
// Cloudflare Workers (secrets are write-only, unavailable during build).
// Instead we fetch the config from /api/firebase-config at runtime —
// the Worker can read its own env vars server-side and return them.
//
// Call getFirebase() inside any async handler; it caches the result so
// subsequent calls are instant.  Call it in useEffect on mount to
// pre-warm the promise before the user's first interaction.
// ─────────────────────────────────────────────

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

export interface FirebaseInstances {
  auth: Auth;
  googleProvider: GoogleAuthProvider;
}

let _promise: Promise<FirebaseInstances> | null = null;

async function _init(): Promise<FirebaseInstances> {
  const res = await fetch("/api/firebase-config");
  if (!res.ok) throw new Error("Could not load Firebase config from server.");
  const config = await res.json();

  const app: FirebaseApp =
    getApps().length === 0 ? initializeApp(config) : getApps()[0];

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  return { auth, googleProvider };
}

/**
 * Returns Firebase auth instances, initialising on first call.
 * The promise is cached — every subsequent call resolves immediately.
 */
export function getFirebase(): Promise<FirebaseInstances> {
  if (!_promise) _promise = _init();
  return _promise;
}

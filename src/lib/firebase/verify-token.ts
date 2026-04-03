// ─────────────────────────────────────────────
// Firebase ID Token Verification — Edge Compatible
//
// Firebase ID tokens are RS256 JWTs signed by Google.
// We verify them using Google's public JWKS endpoint
// via `jose` — no Firebase Admin SDK, no Node.js needed.
// ─────────────────────────────────────────────

import { createRemoteJWKSet, jwtVerify } from "jose";

const GOOGLE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

// Cached JWKS set — jose handles automatic key rotation internally
const JWKS = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));

export interface FirebaseTokenPayload {
  uid: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Verify a Firebase ID token and return the user payload.
 * Returns null if the token is invalid or expired.
 *
 * Works on Cloudflare Workers edge — uses Web Crypto + fetch only.
 */
export async function verifyFirebaseToken(
  idToken: string
): Promise<FirebaseTokenPayload | null> {
  try {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ??
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
      console.error("[Firebase] FIREBASE_PROJECT_ID is not set.");
      return null;
    }

    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const email = (payload.email as string) ?? "";
    const rawName = (payload.name as string) ?? "";
    // Fall back to the part of email before @ if display name not set
    const name = rawName.trim() || email.split("@")[0];

    return {
      uid: payload.sub as string,
      email,
      name,
      picture: payload.picture as string | undefined,
    };
  } catch {
    return null;
  }
}

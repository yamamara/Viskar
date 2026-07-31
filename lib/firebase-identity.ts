"use client"

import { getFirebaseApiKey } from "@/lib/firebase-config"

// Thin wrapper over the Identity Toolkit REST API. Teachers sign in with
// email and password; students get an anonymous account so that Firestore
// rules have a request.auth.uid to key off.

export interface FirebaseIdentity {
  uid: string
  email: string
  idToken: string
  refreshToken: string
  expiresAt: number
}

interface IdentityResponse {
  idToken: string
  refreshToken: string
  expiresIn: string
  localId: string
  email?: string
}

async function parseIdentityResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.error || "Firebase auth request failed")
  }

  return payload as T
}

async function identityRequest<T>(endpoint: string, body: object) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${getFirebaseApiKey()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  return parseIdentityResponse<T>(response)
}

function toIdentity(payload: IdentityResponse): FirebaseIdentity {
  return {
    uid: payload.localId,
    email: payload.email || "",
    idToken: payload.idToken,
    refreshToken: payload.refreshToken,
    expiresAt: Date.now() + Number(payload.expiresIn) * 1000,
  }
}

export async function signInWithPassword(email: string, password: string) {
  const payload = await identityRequest<IdentityResponse>("signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  })
  return toIdentity(payload)
}

export async function signUpWithPassword(email: string, password: string) {
  const payload = await identityRequest<IdentityResponse>("signUp", {
    email,
    password,
    returnSecureToken: true,
  })
  return toIdentity(payload)
}

export async function signInAnonymously() {
  const payload = await identityRequest<IdentityResponse>("signUp", {
    returnSecureToken: true,
  })
  return toIdentity(payload)
}

export async function sendPasswordResetEmail(email: string) {
  await identityRequest("sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  })
  return { success: true }
}

export async function exchangeRefreshToken(refreshToken: string) {
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${getFirebaseApiKey()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  const payload = await parseIdentityResponse<{
    id_token: string
    refresh_token: string
    expires_in: string
    user_id: string
  }>(response)

  return {
    uid: payload.user_id,
    idToken: payload.id_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + Number(payload.expires_in) * 1000,
  }
}

// Static export means every Firebase call happens in the browser, so only
// NEXT_PUBLIC_* values exist here. There is no service account anymore —
// access is governed by Firestore security rules (see firestore.rules).

export function getFirebaseApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY")
  }
  return apiKey
}

export function getFirebaseProjectId() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID")
  }
  return projectId
}

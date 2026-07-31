const requiredServerEnv = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"] as const

export function getFirebaseApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY")
  }
  return apiKey
}

export function getFirebaseProjectId() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID")
  }
  return projectId
}

export function getFirebaseServiceAccount() {
  const missing = requiredServerEnv.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing Firebase server env vars: ${missing.join(", ")}`)
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  }
}

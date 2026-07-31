#!/usr/bin/env node
// Publishes firestore.rules through the Firebase Rules REST API.
//
// firebase-tools is not used here on purpose: before deploying anything it
// checks that firestore.googleapis.com is enabled, and that check needs
// Service Usage permissions on top of the rules permissions. This talks to
// firebaserules.googleapis.com only, so the service account needs exactly one
// role: Firebase Rules Admin.
//
// Credentials come from FIREBASE_SERVICE_ACCOUNT (raw JSON) or
// GOOGLE_APPLICATION_CREDENTIALS (path to the JSON key).

import { createSign } from "node:crypto"
import { readFileSync } from "node:fs"

const RULES_FILE = "firestore.rules"
const RELEASE_ID = "cloud.firestore"

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS
  const raw = inline || (path && readFileSync(path, "utf8"))

  if (!raw) {
    fail("Set FIREBASE_SERVICE_ACCOUNT to the service account JSON, or GOOGLE_APPLICATION_CREDENTIALS to its path.")
  }

  let account
  try {
    account = JSON.parse(raw)
  } catch {
    fail("The service account credentials are not valid JSON. Paste the whole key file, unmodified.")
  }

  for (const field of ["client_email", "private_key", "project_id"]) {
    if (!account[field]) fail(`The service account JSON is missing "${field}".`)
  }

  return account
}

function toBase64Url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

async function getAccessToken(account) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claimSet = toBase64Url(
    JSON.stringify({
      iss: account.client_email,
      sub: account.client_email,
      aud: "https://oauth2.googleapis.com/token",
      scope: "https://www.googleapis.com/auth/cloud-platform",
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  )

  const signer = createSign("RSA-SHA256")
  signer.update(`${header}.${claimSet}`)
  signer.end()
  const assertion = `${header}.${claimSet}.${toBase64Url(signer.sign(account.private_key.replace(/\\n/g, "\n")))}`

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    fail(`Could not get an access token: ${payload.error_description || payload.error || response.status}`)
  }

  return payload.access_token
}

async function rulesRequest(url, accessToken, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  const payload = await response.json().catch(() => ({}))
  return { ok: response.ok, status: response.status, payload }
}

async function main() {
  const account = loadServiceAccount()
  const projectId = process.env.FIREBASE_PROJECT_ID || account.project_id
  const source = readFileSync(RULES_FILE, "utf8")
  const accessToken = await getAccessToken(account)
  const base = `https://firebaserules.googleapis.com/v1/projects/${projectId}`

  console.log(`Publishing ${RULES_FILE} to ${projectId}...`)

  const created = await rulesRequest(`${base}/rulesets`, accessToken, {
    method: "POST",
    body: JSON.stringify({
      source: { files: [{ name: RULES_FILE, content: source }] },
    }),
  })

  if (!created.ok) {
    // A syntax error in the rules is reported here, with line numbers.
    const issues = created.payload?.error?.details?.flatMap((detail) => detail.issues || []) || []
    for (const issue of issues) {
      console.error(`  ${RULES_FILE}:${issue.sourcePosition?.line}: ${issue.description}`)
    }
    fail(created.payload?.error?.message || `Could not create ruleset (HTTP ${created.status})`)
  }

  const rulesetName = created.payload.name
  console.log(`Created ruleset ${rulesetName}`)

  const releaseName = `projects/${projectId}/releases/${RELEASE_ID}`
  const body = JSON.stringify({ release: { name: releaseName, rulesetName } })

  // The release exists on every project that has ever had rules; create it only
  // if this is the first publish.
  let released = await rulesRequest(`${base}/releases/${RELEASE_ID}`, accessToken, { method: "PATCH", body })
  if (!released.ok && released.status === 404) {
    released = await rulesRequest(`${base}/releases`, accessToken, {
      method: "POST",
      body: JSON.stringify({ name: releaseName, rulesetName }),
    })
  }

  if (!released.ok) {
    fail(released.payload?.error?.message || `Could not update the release (HTTP ${released.status})`)
  }

  console.log(`Released to ${RELEASE_ID}. Rules are live.`)
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)))

"use client"

const SKIP_AUTO_RESUME_KEY = "viskar_skip_auto_resume_once"

export function markSkipAutoResumeOnce() {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(SKIP_AUTO_RESUME_KEY, "1")
}

export function consumeSkipAutoResumeOnce() {
  if (typeof window === "undefined") return false

  const shouldSkip = window.sessionStorage.getItem(SKIP_AUTO_RESUME_KEY) === "1"
  if (shouldSkip) {
    window.sessionStorage.removeItem(SKIP_AUTO_RESUME_KEY)
  }

  return shouldSkip
}

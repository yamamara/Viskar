import type { ReactNode } from "react"
import { Info } from "lucide-react"

/**
 * The design system's information callout: a violet left rule, an icon, and an
 * optional bold lead-in that markdown authors write as `> **Title**`.
 */
export function LessonCallout({ children }: { children?: ReactNode }) {
  return (
    <div className="not-prose my-8 flex items-start gap-4 rounded-r-xl border-l-4 border-primary bg-surface-container-high/50 p-6">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className="callout-body text-body-md text-on-surface-variant">{children}</div>
    </div>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Geist, JetBrains_Mono, Literata } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { TeacherAuthProvider } from "@/components/teacher-auth-provider"
import "./globals.css"

// Obsidian Midnight: Geist for chrome and headings, Literata for long-form
// lesson copy, JetBrains Mono for code.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const literata = Literata({ subsets: ["latin"], variable: "--font-literata" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })

export const metadata: Metadata = {
  title: "Viskar",
  description: "Interactive Python learning platform for students and teachers",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${literata.variable} ${jetbrainsMono.variable}`}
    >
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TeacherAuthProvider>{children}</TeacherAuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Sidebar from "./components/sidebar"
import { ThemeProvider } from "./components/theme-provider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "MDX Manager",
  description: "Manage and edit your MDX content",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
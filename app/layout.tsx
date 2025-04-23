import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from "@/components/main-nav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Smart Data Assistant",
  description: "An intelligent data management and chat application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-purple-50 to-blue-50 dark:from-background dark:via-purple-950/10 dark:to-blue-950/10">
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
              <div className="container flex h-16 items-center">
                <MainNav />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-4 bg-background/80 backdrop-blur-sm">
              <div className="container flex justify-between items-center">
                <p className="text-sm text-muted-foreground">© 2023 Smart Data Assistant</p>
                <p className="text-sm text-muted-foreground">Powered by AI</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

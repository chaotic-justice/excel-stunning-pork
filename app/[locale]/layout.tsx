import GoogleAnalytics from "@/app/GoogleAnalytics"
import { auth } from "@/auth"
import Footer from "@/components/footer/Footer"
import Header from "@/components/header/Header"
import { TailwindIndicator } from "@/components/TailwindIndicator"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import "@/styles/loading.css"
import { Analytics } from "@vercel/analytics/react"
import { Viewport } from "next"
import { SessionProvider } from "next-auth/react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Inter as FontSans } from "next/font/google"
import { notFound } from "next/navigation"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  icons: siteConfig.icons,
  metadataBase: siteConfig.metadataBase,
  openGraph: siteConfig.openGraph,
}
export const viewport: Viewport = {
  themeColor: siteConfig.themeColors,
}

export default async function LocaleLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("flex flex-col min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>
            <Header />
            <main className="flex flex-col items-center py-6">
              {children}
              <Toaster />
            </main>
            <Footer />
          </SessionProvider>
        </NextIntlClientProvider>
        <Analytics />
        <TailwindIndicator />
        {process.env.NODE_ENV === "development" ? (
          <></>
        ) : (
          <>
            <GoogleAnalytics />
          </>
        )}
      </body>
    </html>
  )
}

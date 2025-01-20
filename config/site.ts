import { SiteConfig } from "@/types/siteConfig"

export const BASE_URL = "https://lichess.org/"

const baseSiteConfig = {
  name: "Excel Peachy",
  description: "",
  url: BASE_URL,
  metadataBase: "/",
  keywords: [],
  authors: [
    {
      name: "nitgo-cdplayer",
      url: "https://lichess.org/@/soft-orca",
    },
  ],
  creator: "@nitgo",
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  defaultNextTheme: "system", // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png", // apple-touch-icon.png
  },
}

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en-US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
    images: [`${baseSiteConfig.url}og.webp`],
  },
}

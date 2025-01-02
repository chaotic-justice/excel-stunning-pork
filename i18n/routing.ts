import { createNavigation } from "next-intl/navigation"
import { defineRouting, LocalePrefix } from "next-intl/routing"

export const routingConfig = {
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed" as LocalePrefix,
}

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed" as LocalePrefix,
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

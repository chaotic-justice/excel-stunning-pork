// import { auth } from "@/auth"
import authConfig from "@/auth.config"
import { routing } from "@/i18n/routing"
import { isAdmin } from "@/lib/utils"
import NextAuth from "next-auth"
import createIntlMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

interface AppRouteHandlerFnContext {
  params?: Record<string, string | string[]>
}

const { auth } = NextAuth(authConfig)

const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix,
})

const homePages = ["/", "/signin"]
const authPages = ["/workers", "/images-uploader"]
const adminPages = ["/secret"]

const getPathnameRegex = (pages: string[]) => RegExp(`^(/(${routing.locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`, "i")

const homePathnameRegex = getPathnameRegex(homePages)
const authPathnameRegex = getPathnameRegex(authPages)
const adminPathnameRegex = getPathnameRegex(adminPages)

const authMiddleware = (request: NextRequest, ctx: AppRouteHandlerFnContext) => {
  return auth((req) => {
    const path = req.nextUrl.pathname
    const session = req.auth

    const isHomePage = homePathnameRegex.test(path)
    const isProtected = authPathnameRegex.test(path)
    const isAdminPage = adminPathnameRegex.test(path)

    if (session) {
      if (isHomePage) {
        return NextResponse.redirect(new URL("/workers", req.nextUrl.origin))
      } else if (isAdminPage) {
        if (!isAdmin(session.user.email)) {
          console.log("not an admin", session.user.email)
          return NextResponse.redirect(new URL("/not-found", req.nextUrl.origin))
        }
      }
    } else {
      if (isProtected || isAdminPage) {
        return NextResponse.redirect(new URL("/signin", req.nextUrl.origin))
      }
    }

    return intlMiddleware(request)
  })(request, ctx)
}

export const middleware = (request: NextRequest, ctx: AppRouteHandlerFnContext): NextResponse => {
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  return authMiddleware(request, ctx) as NextResponse
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}

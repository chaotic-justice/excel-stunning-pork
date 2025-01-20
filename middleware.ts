import { auth } from "@/auth"
import { routing } from "@/i18n/routing"
import createIntlMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

interface AppRouteHandlerFnContext {
  params?: Record<string, string | string[]>
}

const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix,
})

const homePages = ["/", "/signin"]
const authPages = ["/secret", "/swans", "/images-uploader"]

const getPathnameRegex = (pages: string[]) => RegExp(`^(/(${routing.locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`, "i")

const homePathnameRegex = getPathnameRegex(homePages)
const authPathnameRegex = getPathnameRegex(authPages)

const authMiddleware = (request: NextRequest, ctx: AppRouteHandlerFnContext) => {
  return auth((req) => {
    const path = req.nextUrl.pathname
    const isAuth = req.auth

    const isHomePage = homePathnameRegex.test(path)
    const isAuthPage = authPathnameRegex.test(path)

    if (isAuth && isHomePage) {
      return NextResponse.redirect(new URL("/swans", req.url))
    } else if (!isAuth) {
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/signin", req.url))
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
  matcher: ["/((?!api|_next|_vercel|styles|.*\\..*).*)"],
}

"use client"

import { safeSignout } from "@/actions/auth"
import { Link } from "@/i18n/routing"
import { Session } from "next-auth"
import { useLocale, useTranslations } from "next-intl"

const IndexComponent = ({ session }: { session: Session | null }) => {
  const t = useTranslations("Index")
  const locale = useLocale()
  return (
    <div>
      {session ? (
        <>
          <p>{t("loggedIn", { username: session.user?.name })}</p>
          <p>
            <Link href={locale + "/secret"}>{t("secret")}</Link>
          </p>
          <button onClick={safeSignout} type="button">
            {t("logout")}
          </button>
        </>
      ) : (
        <>
          <p>{t("loggedOut")}</p>
          <Link href={locale + "/login"}>{t("login")}</Link>
        </>
      )}
    </div>
  )
}

export default IndexComponent

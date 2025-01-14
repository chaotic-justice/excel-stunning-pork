"use client"

import { safeSignout } from "@/actions/auth"
import PageLayout from "@/components/PageLayout"
import { Session } from "next-auth"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"

type Props = {
  session: Session | null
}

export default function Index({ session }: Props) {
  const t = useTranslations("Index")
  const locale = useLocale()
  console.log("session", session)

  return (
    <PageLayout title={t("title")}>
      {/* <IndexComponent session={session} /> */}
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
    </PageLayout>
  )
}

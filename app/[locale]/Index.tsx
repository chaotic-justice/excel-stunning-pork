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

  return (
    <PageLayout title={t("title")}>
      {session ? (
        <>
          <p>{t("loggedIn", { username: session.user?.name })}</p>
          <p>
            <Link href={locale + "/secret"}>{t("secret")}</Link>
          </p>
          <p>
            <Link href={locale + "/images-uploader"}>docu center</Link>
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

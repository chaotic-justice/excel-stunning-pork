"use client"

import { generateCfToken } from "@/actions/auth"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function Secret({ session }: { session: Session | null }) {
  const t = useTranslations("Secret")
  const sessionObj = JSON.stringify(session, null, 2)
  const [token, setToken] = useState("")

  const getAuth = async () => {
    console.log(".getAuth")
  }

  const getCfAuthToken = async () => {
    const cfToken = await generateCfToken()
    console.log("cfToken", cfToken)
    setToken(cfToken)
  }

  return (
    <PageLayout title={t("title")}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{sessionObj}</pre>
      <div>{token}</div>
      <Button onClick={getAuth}>me query</Button>
      <Button onClick={getCfAuthToken}>dark cape</Button>
      <p>{t("description")}</p>
    </PageLayout>
  )
}

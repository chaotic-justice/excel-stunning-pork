"use client"

import { safeSignout } from "@/actions/auth"
import AuthListener from "@/app/[locale]/AuthListener"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { MeDocument, MeQuery } from "../../../gql/generated/graphql"
import { generateCfToken } from "@/lib/utils"

export default function Secret({ session }: { session: Session | null }) {
  const t = useTranslations("Secret")
  const sessionObj = JSON.stringify(session, null, 2)
  const [meResponse, setMeResponse] = useState<MeQuery["me"] | null>(null)
  const [token, setToken] = useState("")

  const getAuth = async () => {
    const data = { document: MeDocument.toString() }
    const fetched = await fetch("/api/gql-request-with-bearer", { method: "POST", body: JSON.stringify(data) })
    const res = await fetched.json()
    console.log("res", res)
    if (res.errorCaught) {
      console.log("res.errorCaught", res.errorCaught)
      await safeSignout()
    }
    setMeResponse(res.data)
  }

  const getCfAuthToken = async () => {
    const cfToken = await generateCfToken()
    console.log("cfToken", cfToken)
    setToken(cfToken)
  }

  return (
    <PageLayout title={t("title")}>
      <AuthListener session={session} />
      <pre style={{ whiteSpace: "pre-wrap" }}>{sessionObj}</pre>
      {meResponse && <div>{meResponse.email}</div>}
      <div>{token}</div>
      <Button onClick={getAuth}>me query</Button>
      <Button onClick={getCfAuthToken}>dark cape</Button>
      <p>{t("description")}</p>
    </PageLayout>
  )
}

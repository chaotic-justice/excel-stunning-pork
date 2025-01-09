"use client"

import { safeSignout } from "@/actions/auth"
import AuthListener from "@/app/[locale]/AuthListener"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { loginSchema } from "@/types/auth"
import { Session } from "next-auth"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { z } from "zod"
import { MeDocument, MeQuery } from "../../../gql/generated/graphql"

export default function Secret({ session }: { session: Session | null }) {
  const t = useTranslations("Secret")
  const sessionObj = JSON.stringify(session, null, 2)
  const [meResponse, setMeResponse] = useState<MeQuery["me"] | null>(null)

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

  const bruteLogin = async () => {
    const logged = await fetch("/api/bruteLogin", { method: "POST" })
    const res = await logged.json()
    // console.log("brute force logged??", res)

    try {
      const success = loginSchema.parse(res)
      console.log("success??", success)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors)
      }
      throw new Error("Invalid API response")
    }
  }

  return (
    <PageLayout title={t("title")}>
      <AuthListener session={session} />
      <pre style={{ whiteSpace: "pre-wrap" }}>{sessionObj}</pre>
      {meResponse && (
        <div>
          {meResponse.email}
          {meResponse.id}
        </div>
      )}
      <Button onClick={getAuth}>me query</Button>
      <Button onClick={bruteLogin}>dark cape</Button>
      <p>{t("description")}</p>
    </PageLayout>
  )
}

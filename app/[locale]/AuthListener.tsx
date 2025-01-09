"use client"

import { safeSignout } from "@/actions/auth"
import { Session } from "next-auth"
import { useEffect } from "react"

const AuthListener = ({ session }: { session: Session | null }) => {
  useEffect(() => {
    const awaitedSignout = async () => {
      await safeSignout()
    }
    if (session?.error) {
      console.log("listener triggered, user is exiting...", session.error)
      awaitedSignout()
    }
  }, [session])

  return null
}

export default AuthListener

"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"

export const Social = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || "/swans",
    })
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => onClick("google")}>
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  )
}

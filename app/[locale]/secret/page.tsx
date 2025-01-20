import Secret from "@/app/[locale]/secret/component"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function page() {
  const session = await auth()
  if (!session) {
    redirect("/")
  }

  return (
    <>
      <Secret session={session} />
    </>
  )
}

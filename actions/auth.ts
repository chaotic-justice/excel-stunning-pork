"use server"

import { signOut } from "@/auth"

export const safeSignout = async () => {
  // BUG: react-hook signout() will log the user back in
  // temp solution: use authjs signout() wrap it in async server action
  console.log("logging out via server action")
  await signOut({ redirect: true, redirectTo: "/login" })
}

"use server"

import { signOut } from "@/auth"
import * as jose from "jose"

export const safeSignout = async () => {
  // BUG: react-hook signout() will log the user back in
  // temp solution: use authjs signout() wrap it in async server action
  console.log("logging out via server action")
  await signOut({ redirect: true, redirectTo: "/signin" })
}

export async function generateCfToken() {
  const secret = new TextEncoder().encode(process.env.CF_SECRET_KEY)
  const alg = "HS256"

  const jwt = await new jose.SignJWT({ sub: process.env.CF_SUB, snack: process.env.CF_SNACK }).setProtectedHeader({ alg }).setIssuedAt().setIssuer("excel-peachy").setExpirationTime("15m").sign(secret)

  return jwt
}
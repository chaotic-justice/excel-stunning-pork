"use server"

import { signOut } from "@/auth"
import * as jose from "jose"

export const safeSignout = async () => {
  await signOut({ redirect: true, redirectTo: "/signin" })
}

export async function generateCfToken() {
  const secret = new TextEncoder().encode(process.env.CF_SECRET_KEY)
  const alg = "HS256"

  const jwt = await new jose.SignJWT({ sub: process.env.CF_SUB, snack: process.env.CF_SNACK }).setProtectedHeader({ alg }).setIssuedAt().setIssuer("excel-peachy").setExpirationTime("2h").sign(secret)

  return jwt
}

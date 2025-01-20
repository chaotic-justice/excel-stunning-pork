import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode"
import { twMerge } from "tailwind-merge"
import * as jose from "jose"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSliceFromArray<T>(array: T[], indexes: number[]): T[] {
  return indexes.map((index) => array[index]).filter((item) => !!item)
}

export async function generateCfToken() {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_CF_SECRET_KEY)
  const alg = "HS256"

  const jwt = await new jose.SignJWT({ sub: process.env.NEXT_PUBLIC_CF_SUB, snack: process.env.NEXT_PUBLIC_CF_SNACK }).setProtectedHeader({ alg }).setIssuedAt().setIssuer("excel-peachy").setExpirationTime("15m").sign(secret)

  return jwt
}

export function isAdmin(s: string): boolean {
  const admins = process.env.NEXT_PUBLIC_ADMINS.split(", ").map((email) => email.trim())
  return admins.indexOf(s) > -1
}

export function isExpired(token?: string): boolean {
  if (!token) return false

  const decodedToken = jwtDecode(token)
  return Date.now() > decodedToken.exp! * 1000
}

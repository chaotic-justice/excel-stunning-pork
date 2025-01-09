import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isExpired(token?: string): boolean {
  if (!token) return false

  const decodedToken = jwtDecode(token)
  return Date.now() > decodedToken.exp! * 1000
}

import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode"
import { twMerge } from "tailwind-merge"
import * as jose from "jose"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/*
string related functions
*/
export function getSliceFromArray<T>(array: T[], indexes: number[]): T[] {
  return indexes.map((index) => array[index]).filter((item) => !!item)
}

export function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return 'Unknown'

  const words = fullName.trim().split(/\s+/) // Split by whitespace
  return words.map((word) => word.charAt(0).toUpperCase()).join("")
}

/*
auth related functions
*/
export function isAdmin(s: string): boolean {
  const admins = process.env.NEXT_PUBLIC_ADMINS.split(", ").map((email) => email.trim())
  return admins.indexOf(s) > -1
}

export function isExpired(token?: string): boolean {
  if (!token) return false

  const decodedToken = jwtDecode(token)
  return Date.now() > decodedToken.exp! * 1000
}

import authConfig from "@/auth.config"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      address?: string
      provider?: string
    } & DefaultSession["user"]
    error?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  ...authConfig,
})

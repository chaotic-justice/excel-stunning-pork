import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

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
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // @ts-ignore
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true
      // email verification logic here
      return true
    },
    // @ts-ignore
    async session({ token, session }) {
      if (token.userId && session.user) {
        session.user.id = token.userId as string
      }

      return session
    },
    async jwt({ token }: { token: any }) {
      return token
    },
  },
  providers: [
    Google({
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
})

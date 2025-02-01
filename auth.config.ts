import { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  session: {
    strategy: "jwt",
  },
  // callbacks: {
  //   // @ts-ignore
  //   async signIn({ user, account }) {
  //     //Allow OAuth without email verification
  //     if (account?.provider !== "credentials") return true
  //     // email verification logic here
  //     return true
  //   },
  //   // @ts-ignore
  //   async session({ token, session }) {
  //     if (token.userId && session.user) {
  //       session.user.id = token.userId as string
  //     }

  //     return session
  //   },
  //   async jwt({ token }: { token: any }) {
  //     return token
  //   },
  // },
  providers: [
    Google({
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
} satisfies NextAuthConfig

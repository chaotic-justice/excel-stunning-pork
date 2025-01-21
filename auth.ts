import { bareGqlClient } from "@/gql"
import { OAuthLoginDocument, OAuthLoginMutation, RefreshTokenDocument, RefreshTokenMutation } from "@/gql/generated/graphql"
import { isExpired } from "@/lib/utils"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    error?: string
    userId?: string
  }
}
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
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true
      // email verification logic here
      return true
    },
    async session({ token, session }) {
      if (token.userId && session.user) {
        session.user.id = token.userId
      }

      if (isExpired(token.accessToken)) {
        if (isExpired(token.refreshToken)) {
          session.error = "Refresh token expired."
        }
        try {
          const res: RefreshTokenMutation = await bareGqlClient.request(RefreshTokenDocument.toString(), {
            token: token.refreshToken,
          })
          const { refreshToken } = res
          token.accessToken = refreshToken.accessToken
          token.refreshToken = refreshToken.refreshToken
        } catch (error) {
          session.error = "Refresh token expired."
        }
      }
      return session
    },
    async jwt({ token, account }) {
      token.provider = account?.provider
      if (account) {
        const { access_token, refresh_token } = account
        console.log("inside jwt account scope...")
        // console.log("access_token", access_token)
        // console.log("refreshToken", refresh_token)
      }
      const oauthToken = {
        name: token.name as string,
        email: token.email as string,
        picture: token.picture,
        provider: (token.provider as string) || "google", // adjust this later when adding magiclink
      }
      if (!token.accessToken) {
        // set initial access & refresh tokens
        try {
          const backendOauth: OAuthLoginMutation = await bareGqlClient.request(OAuthLoginDocument.toString(), {
            data: oauthToken,
          })
          token.accessToken = backendOauth.oAuthLogin.accessToken
          token.refreshToken = backendOauth.oAuthLogin.refreshToken
          token.userId = backendOauth.oAuthLogin.user.id
        } catch (err: Error | any) {
          console.log("error inside jwt block", err.message)
          token.error = `Oauth login error: ${err.message}`
        }
      }

      if (!token.sub) return token

      return token
    },
  },
  providers: [
    Google({
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
})

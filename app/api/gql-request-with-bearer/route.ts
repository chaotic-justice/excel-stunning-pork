import { bareGqlClient } from "@/gql"
import { RefreshTokenDocument, RefreshTokenMutation } from "@/gql/generated/graphql"
import { isExpired } from "@/lib/utils"
import { GraphQLError } from "graphql"
import { GraphQLClient } from "graphql-request"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const sessionToken = await getToken({ req, cookieName: process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-authjs.session-token", secret: process.env.AUTH_SECRET })

  let accessToken = sessionToken?.accessToken
  if (isExpired(accessToken)) {
    if (isExpired(sessionToken?.refreshToken)) {
      console.log("refresh token expired")
      return NextResponse.json(
        {
          errorCaught: "Refresh token expired",
        },
        { status: 200 }
      )
    }
    try {
      const res: RefreshTokenMutation = await bareGqlClient.request(RefreshTokenDocument.toString(), {
        token: sessionToken?.refreshToken,
      })
      const { refreshToken } = res
      accessToken = refreshToken.accessToken
    } catch (error: GraphQLError | any) {
      const errorCaught = error.response.errors[0]
      console.log("error caught while refreshing tokens", errorCaught)
      return NextResponse.json(
        {
          errorCaught,
        },
        { status: 200 }
      )
    }
  }

  const graphQLClient = new GraphQLClient(process.env.NEXT_GRAPHQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })

  try {
    const res: object = await graphQLClient.request(reqBody.document)
    return NextResponse.json({ data: Object.values(res)[0] }, { status: 200 })
  } catch (error: GraphQLError | any) {
    const errorCaught = error.response.errors[0]
    console.log("error inside catch block", errorCaught)
    return NextResponse.json(
      {
        errorCaught,
      },
      { status: 200 }
    )
  }
}

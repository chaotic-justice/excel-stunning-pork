import { bareGqlClient } from "@/gql"
import { LoginDocument, LoginMutation } from "@/gql/generated/graphql"
import { GraphQLError } from "graphql"
import { NextResponse } from "next/server"

type ErrorCaught = { message: string; code: string }

interface LoginResponse {
  data?: LoginMutation["login"]
  error?: ErrorCaught
}

export async function POST(req: Request) {
  const variables = {
    email: "fun@knit.com",
    password: "passw000d",
  }

  try {
    const loginRes: LoginMutation = await bareGqlClient.request(LoginDocument.toString(), variables)
    console.log("loginRes", loginRes.login)
    return NextResponse.json(
      {
        data: loginRes.login,
      },
      { status: 200 }
    )
  } catch (error: GraphQLError | any) {
    const errorCaught = error.response.errors[0]
    console.log("error inside catch block", errorCaught)
    return NextResponse.json(
      {
        error: errorCaught,
      },
      { status: 200 }
    )
  }
}

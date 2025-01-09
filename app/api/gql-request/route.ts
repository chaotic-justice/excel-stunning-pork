import { GraphQLError } from "graphql"
import { GraphQLClient } from "graphql-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const bareGqlClient = new GraphQLClient(process.env.NEXT_GRAPHQL_ENDPOINT)

  try {
    const res: object = await bareGqlClient.request(reqBody.document)
    return NextResponse.json({ data: Object.values(res)[0] }, { status: 200 })
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

import { GraphQLClient } from "graphql-request"

export const bareGqlClient = new GraphQLClient(process.env.NEXT_GRAPHQL_ENDPOINT)

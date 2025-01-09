import { z } from "zod"
import { LoginMutation } from "../gql/generated/graphql"

type LoginTokens = LoginMutation["login"]

export const loginSchema = z.object({
  data: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .optional(),
  error: z.object({ message: z.string(), code: z.string() }).optional(),
})

export type LoginResponse = z.infer<typeof loginSchema>

import { generateCfToken } from "@/actions/auth"
import { ZodSchema } from "zod"

type Method = "GET" | "POST" | "PUT" | "DELETE"

type FetcherParams<T> = {
  endpoint: string
  schema: ZodSchema<T>
  method: Method
  variables?: Partial<T>
}

type DeleteFetcherParams<T> = Omit<FetcherParams<T>, "schema">

export const useFetcher = async <T>({ endpoint, method, schema, variables }: FetcherParams<T>): Promise<{ data: T | null; error: string | null }> => {
  try {
    const accessToken = await generateCfToken()
    console.log("Bearer", accessToken)
    const response = await fetch(`${process.env.CF_WORKER_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: method === "POST" && variables ? JSON.stringify(variables) : undefined,
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // Validate the response using Zod
    const result = await response.json()
    const res = schema.safeParse(result.data)
    if (!res.success) {
      return { data: null, error: res.error.message }
    }
    return { data: res.data, error: null }
  } catch (err: Error | any) {
    return { data: null, error: err.message }
  }
}

export const useFetcherToDelete = async <T>({ endpoint, method }: DeleteFetcherParams<T>): Promise<boolean> => {
  try {
    const accessToken = await generateCfToken()
    const response = await fetch(`${process.env.CF_WORKER_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    return response.status === 200
  } catch (err: Error | any) {
    console.log("err", err.message)
    return false
  }
}

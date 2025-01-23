import { generateCfToken } from "@/actions/auth"
import { ZodSchema } from "zod"

export type Method = "GET" | "POST" | "PUT" | "DELETE"

type CoreFetcherParams<T, M extends Method> = {
  endpoint: string
  method: M
  variables: M extends "POST" ? Partial<T> | FormData : undefined
}

type FetcherParams<T, M extends Method> = CoreFetcherParams<T, M> & {
  schema: ZodSchema<T>
}

// type DeleteFetcherParams<T> = Omit<FetcherParams<T>, "schema">

interface FetcherResponse<T> {
  data: T | null
  error: string | null
}

interface DeletionResponse<T> extends Omit<FetcherResponse<T>, "data"> {
  data: boolean | null
}

export const useFetcher = async <T, M extends Method>({ endpoint, method, schema, variables }: FetcherParams<T, M>): Promise<FetcherResponse<T>> => {
  let data: T | null = null
  let error: string | null = null
  try {
    const accessToken = await generateCfToken()
    console.log("Bearer", accessToken)
    const response = await fetch(`${process.env.CF_WORKER_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // @ts-ignore
      body: method === "POST" && variables ? (endpoint.indexOf("upload") > -1 ? variables : JSON.stringify(variables)) : undefined,
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // Validate the response using Zod
    const result = await response.json()
    const res = schema.safeParse(result.data)
    if (!res.success) {
      error = res.error.message
    }
    data = res.data || null
  } catch (err) {
    error = err instanceof Error ? err.message : "An unexpected error occurred" + err
  }
  return { data, error }
}

export const useFetcherToDelete = async <T, M extends Method>({ endpoint, method }: CoreFetcherParams<T, M>): Promise<DeletionResponse<T>> => {
  let data: boolean | null = null
  let error: string | null = null
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
      // throw new Error(`Error: ${response.statusText}`)
      error = response.statusText
    }
    data = response.status === 200
  } catch (err) {
    error = err instanceof Error ? err.message : "An unexpected error occurred"
  }
  return { data, error }
}

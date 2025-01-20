import { generateCfToken } from "@/actions/auth"
import { ZodSchema } from "zod"

export const useFetcherToGet = async <T>(endpoint: string, schema: ZodSchema<T>): Promise<{ data: T | null; error: string | null }> => {
  try {
    const accessToken = await generateCfToken()

    const response = await fetch(`${process.env.CF_WORKER_BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const result = await response.json()

    // Validate the response using Zod
    const res = schema.safeParse(result)
    if (!res.success) {
      return { data: null, error: res.error.message }
    }
    return { data: res.data, error: null }
  } catch (err: Error | any) {
    return { data: null, error: err.message }
  } finally {
    // setLoading(false)
  }
}

export const useFetcherToPost = async <T>(endpoint: string, variables: Record<string, any>, schema: ZodSchema<T>): Promise<{ data: T | null; error: string | null }> => {
  try {
    const accessToken = await generateCfToken()

    const response = await fetch(`${process.env.CF_WORKER_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        body: JSON.stringify(variables),
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const result = await response.json()

    // Validate the response using Zod
    const res = schema.safeParse(result)
    if (!res.success) {
      return { data: null, error: res.error.message }
    }
    return { data: res.data, error: null }
  } catch (err: Error | any) {
    return { data: null, error: err.message }
  } finally {
    // setLoading(false)
  }
}

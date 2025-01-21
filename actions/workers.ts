"use server"

import { useFetcher, useFetcherToDelete } from "@/hooks/use-fetcher"
import { Worker } from "@/types/schemas"
import { revalidatePath } from "next/cache"
import { newWorkerSchema } from "../types/schemas"

export const createNewWorker = async (values: Worker) => {
  const res = await useFetcher<Worker>({ endpoint: `api/math/workers`, method: "POST", schema: newWorkerSchema, variables: values })
  console.log("res", res)
  revalidatePath("/workers")
  // try {
  //   const res = await fetch(process.env.CF_WORKER_BASE_URL + "/api/math/workers", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(values),
  //   })

  return { success: true, error: null }
  //   return { success: false, error: "Could not create" }
  // } catch (error: Error | any) {
  //   return { success: false, error: error.message }
  // }
}

export const deleteWorker = async (values: Partial<Worker>) => {
  await useFetcherToDelete({ endpoint: `api/math/workers/${values.id}`, method: "DELETE" })
  revalidatePath("/workers")
}

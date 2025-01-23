"use server"

import { useFetcher, useFetcherToDelete } from "@/hooks/use-fetcher"
import { Worker } from "@/types/schemas"
import { revalidatePath } from "next/cache"
import { newWorkerSchema } from "../types/schemas"
import { redirect } from "next/navigation"

export const createNewWorker = async (values: Worker) => {
  const res = await useFetcher<Worker>({ endpoint: `api/math/workers`, method: "POST", schema: newWorkerSchema, variables: values })
  console.log("res", res)
  revalidatePath("/workers")
  if (res.error) {
    return { success: false, error: "failed to create" }
  }
  redirect(`/workers/${res.data?.id}`)
  return { success: true, error: null }
}

export const deleteWorker = async (values: Partial<Worker>) => {
  await useFetcherToDelete({ endpoint: `api/math/workers/${values.id}`, method: "DELETE" })
  revalidatePath("/workers")
}

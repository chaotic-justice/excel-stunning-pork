"use server"

import { useFetcher, useFetcherToDelete } from "@/hooks/use-fetcher"
import { Document, newDocumentSchema, Worker } from "@/types/schemas"
import { revalidatePath } from "next/cache"
import { newWorkerSchema } from "../types/schemas"
import { redirect } from "next/navigation"

export const getWorkerById = async (workerId: string) => {
  const res = await useFetcher<Worker, "GET">({ endpoint: `api/math/workers/${workerId}`, method: "GET", schema: newWorkerSchema, variables: undefined })
  return res
}

export const getDocumentsByWorkerId = async (workerId: string) => {
  const res = await useFetcher<Document[], "GET">({ endpoint: `api/math/docs/${workerId}`, method: "GET", schema: newDocumentSchema.array(), variables: undefined })
  return res
}

export const createNewWorker = async (values: Worker) => {
  const res = await useFetcher<Worker, "POST">({ endpoint: `api/math/workers`, method: "POST", schema: newWorkerSchema, variables: values })
  revalidatePath("/workers")
  return res
}

export const deleteWorker = async (values: Partial<Worker>) => {
  await useFetcherToDelete<Worker, "DELETE">({ endpoint: `api/math/workers/${values.id}`, method: "DELETE", variables: undefined })
  revalidatePath("/workers")
}

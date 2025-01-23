import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
})

export const newDocumentSchema = z.object({
  name: z.string(),
  workerId: z.number(),
  id: z.union([z.number(), z.undefined()]).optional(),
})

export const newWorkerSchema = z.object({
  name: z.string(),
  kind: z
    .union([z.literal("unknown"), z.literal("costco"), z.literal("sales-agents"), z.literal("banking"), z.undefined()])
    .optional()
    .nullable(),
  id: z.union([z.number(), z.undefined()]).optional(),
  createdAt: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: z.union([z.string(), z.undefined()]).optional(),
})

export type Worker = z.infer<typeof newWorkerSchema>
export type Document = z.infer<typeof newDocumentSchema>

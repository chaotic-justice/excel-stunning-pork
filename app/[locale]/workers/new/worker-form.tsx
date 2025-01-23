"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { createNewWorker } from "@/actions/workers"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/i18n/routing"
import { Worker, newWorkerSchema } from "@/types/schemas"
import { useTransition } from "react"

const WorkerForm = () => {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<Worker>({
    resolver: zodResolver(newWorkerSchema),
    defaultValues: {
      kind: "banking",
      name: "dummy",
    },
  })

  function onSubmit(values: Worker) {
    startTransition(() => {
      createNewWorker(values)
        .then((res) => {
          if (res.data) {
            router.push(`/workers/${res.data.id}`)
            toast({ description: "created" })
          } else {
            toast({ description: res.error, variant: "destructive" })
          }
        })
        .catch((error) => {
          toast({ title: "While creating a worker", description: `${error.message}`, variant: "destructive" })
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default WorkerForm

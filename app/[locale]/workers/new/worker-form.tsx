"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { createNewWorker } from "@/actions/workers"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
      authorId: 1,
      kind: "banking",
      name: "dummy",
    },
  })

  function onSubmit(values: Worker) {
    startTransition(() => {
      createNewWorker(values)
        .then((data) => {
          if (data.success) {
            toast({ description: "created" })
            router.push("/workers")
          } else {
            toast({ description: "failed", variant: "destructive" })
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="not_started" />
                    </FormControl>
                    <FormLabel className="font-normal">Not Started</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="started" />
                    </FormControl>
                    <FormLabel className="font-normal">Started</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="failed" />
                    </FormControl>
                    <FormLabel className="font-normal">Failed</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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

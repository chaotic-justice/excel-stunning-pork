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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const WorkerForm = () => {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<Worker>({
    resolver: zodResolver(newWorkerSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: Worker) {
    startTransition(() => {
      createNewWorker(values)
        .then((res) => {
          if (res.data) {
            router.push(`/workers/${res.data.id}`)
            toast({ description: "worker created" })
          } else {
            toast({ description: res.error, variant: "destructive" })
          }
        })
        .catch((err) => {
          const error = err instanceof Error ? err.message : "An unexpected error occurred"
          toast({ description: `${error}`, variant: "destructive" })
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Worker name</FormLabel>
              <FormControl>
                <Input placeholder="example: december-costco" {...field} />
              </FormControl>
              <FormDescription>Give a name to your worker, a name that provides a clue as to what the worker is expected to do.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kind"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What kind of worker is this?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={undefined} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="unknown" />
                    </FormControl>
                    <FormLabel className="font-normal">Unknown</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="costco" />
                    </FormControl>
                    <FormLabel className="font-normal">Costco</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="sales-agents" />
                    </FormControl>
                    <FormLabel className="font-normal">Sales Agents</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="banking" />
                    </FormControl>
                    <FormLabel className="font-normal">Banking</FormLabel>
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

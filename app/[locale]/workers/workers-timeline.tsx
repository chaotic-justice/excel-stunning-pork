"use client"

import { createNewWorker, deleteWorker } from "@/actions/workers"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Link } from "@/i18n/routing"
import { Worker, newWorkerSchema } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { startTransition, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { RiAddLargeFill } from "react-icons/ri"

type Props = {
  workers: Worker[] | null
}

const FeedTimeline = ({ workers }: Props) => {
  const [loading, setLoading] = useState(false)

  const form = useForm<Worker>({
    resolver: zodResolver(newWorkerSchema),
    defaultValues: {
      authorId: 1,
      kind: "banking",
      name: "dummy",
    },
  })

  function onSubmit(values: Worker) {
    console.log("submitting..", values)
    startTransition(() => {
      createNewWorker(values)
        .then((data) => {
          if (data.success) {
            toast({ description: "created" })
          } else {
            toast({ description: "failed" })
          }
        })
        .catch((error) => {
          toast({ title: "While creating a worker", description: `${error.message}` })
        })
    })
  }

  const groupedFeedItems = useMemo(() => {
    const grouped = (workers || []).reduce((acc, item) => {
      const date = new Date(item.createdAt!)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(item)
      return acc
    }, {} as Record<string, Worker[]>)

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]))
  }, [workers])

  const currentMonthYear = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }, [])

  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split("-")
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Worker Station</h1>
      <Button variant="outline">
        <RiAddLargeFill className="h-5 w-5" />
        <Link href="/workers/new">new entry</Link>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <RiAddLargeFill className="h-5 w-5" />
            new entry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Accordion type="multiple" defaultValue={[currentMonthYear]} className="w-full">
        {groupedFeedItems.map(([monthYear, items]) => (
          <AccordionItem key={monthYear} value={monthYear}>
            <AccordionTrigger>{formatMonthYear(monthYear)}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-8">
                {items?.map((item, index) => (
                  <div key={item.id} className="relative">
                    {index !== 0 && <Separator orientation="vertical" className="absolute left-9 top-0 h-full -translate-x-1/2 bg-muted-foreground/20" />}
                    <div className="grid gap-4 grid-cols-[40px_1fr] items-start">
                      <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-primary text-primary-foreground text-sm font-medium">{item.id}</div>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>{item.name}</CardTitle>
                          <CardDescription>{new Date(item.createdAt!).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{item.kind}</p>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              deleteWorker({ id: item.id })
                            }}
                          >
                            <X size={20} />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-4 text-center">
        <Button onClick={() => undefined}>{loading ? "Loading..." : "Load More"}</Button>
      </div>
    </div>
  )
}

export default FeedTimeline

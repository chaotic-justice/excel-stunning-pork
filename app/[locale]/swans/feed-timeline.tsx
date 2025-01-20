"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { NewGroup } from "@/types"
import { useMemo, useState } from "react"
import { RiAddLargeFill } from "react-icons/ri"

type Props = {
  groups: NewGroup[] | null
}

const FeedTimeline = ({ groups }: Props) => {
  const [loading, setLoading] = useState(false)

  const groupedFeedItems = useMemo(() => {
    const grouped = (groups || []).reduce((acc, item) => {
      const date = new Date(item.createdAt!)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(item)
      return acc
    }, {} as Record<string, NewGroup[]>)

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]))
  }, [groups])

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
      <h1 className="text-3xl font-bold mb-6">Swan Station</h1>
      <div className="flex justify-center">
        <Button>
          <RiAddLargeFill className="h-5 w-5" />
          new entry
        </Button>
      </div>
      <Accordion type="multiple" defaultValue={[currentMonthYear]} className="w-full">
        {groupedFeedItems.map(([monthYear, items]) => (
          <AccordionItem key={monthYear} value={monthYear}>
            <AccordionTrigger>{formatMonthYear(monthYear)}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-8">
                {groups?.map((item, index) => (
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
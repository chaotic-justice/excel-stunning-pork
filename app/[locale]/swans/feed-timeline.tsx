"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMemo, useState } from "react"
import { RiAddCircleFill, RiAddLargeFill } from "react-icons/ri"

interface FeedItem {
  id: number
  timestamp: string
  title: string
  description: string
}

const initialFeedItems: FeedItem[] = [
  {
    id: 1,
    timestamp: "2023-05-01T09:00:00Z",
    title: "New Feature Released",
    description: "We've just launched our latest feature. Check it out in your dashboard!",
  },
  {
    id: 2,
    timestamp: "2023-05-02T14:30:00Z",
    title: "System Maintenance",
    description: "Scheduled maintenance will occur tonight from 2 AM to 4 AM UTC.",
  },
  {
    id: 3,
    timestamp: "2023-06-03T11:15:00Z",
    title: "User Milestone Reached",
    description: "Congratulations! You've reached 1000 active users on your platform.",
  },
  {
    id: 4,
    timestamp: "2023-06-04T16:45:00Z",
    title: "New Integration Available",
    description: "We now support integration with Popular CRM. Connect your account now!",
  },
  {
    id: 5,
    timestamp: "2023-07-05T08:20:00Z",
    title: "Community Spotlight",
    description: "Check out this month's featured community project on our blog.",
  },
]

export default function FeedTimeline() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems)
  const [loading, setLoading] = useState(false)

  const groupedFeedItems = useMemo(() => {
    const grouped = feedItems.reduce((acc, item) => {
      const date = new Date(item.timestamp)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(item)
      return acc
    }, {} as Record<string, FeedItem[]>)

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]))
  }, [feedItems])

  const currentMonthYear = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }, [])

  const loadMoreItems = () => {
    setLoading(true)
    // Simulating an API call to load more items
    setTimeout(() => {
      const newItems: FeedItem[] = [
        {
          id: feedItems.length + 1,
          timestamp: new Date().toISOString(),
          title: `New Item ${feedItems.length + 1}`,
          description: "This is a newly loaded feed item.",
        },
        {
          id: feedItems.length + 2,
          timestamp: new Date().toISOString(),
          title: `New Item ${feedItems.length + 2}`,
          description: "This is another newly loaded feed item.",
        },
      ]
      setFeedItems([...feedItems, ...newItems])
      setLoading(false)
    }, 1000)
  }

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
                {items.map((item, index) => (
                  <div key={item.id} className="relative">
                    {index !== 0 && <Separator orientation="vertical" className="absolute left-9 top-0 h-full -translate-x-1/2 bg-muted-foreground/20" />}
                    <div className="grid gap-4 grid-cols-[40px_1fr] items-start">
                      <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-primary text-primary-foreground text-sm font-medium">{item.id}</div>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{new Date(item.timestamp).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{item.description}</p>
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
        <Button onClick={loadMoreItems} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  )
}

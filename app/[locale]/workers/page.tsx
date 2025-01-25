import FeedTimeline from "@/app/[locale]/workers/workers-timeline"
import { useFetcher } from "@/hooks/use-fetcher"
import { Worker, newWorkerSchema } from "@/types/schemas"

export default async function Page() {
  const { data, error } = await useFetcher<Worker[], "GET">({ endpoint: "api/math/allWorkers", method: "GET", schema: newWorkerSchema.array(), variables: undefined })
  if (error) {
    console.log("error", error)
  }
  console.log("data len:", data?.length)
  return (
    <div className="container">
      <FeedTimeline workers={data} />
    </div>
  )
}

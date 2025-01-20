import FeedTimeline from "@/app/[locale]/swans/feed-timeline"
import { useFetcherToGet } from "@/hooks/use-fetcher"
import { NewGroup } from "@/types"
import { newGroupSchema } from "@/types/schemas"

export default async function page() {
  const { data, error } = await useFetcherToGet<NewGroup[]>("api/math/groups", newGroupSchema.array())
  console.log("data", data)
  console.log("error", error)
  return (
    <div className="container">
      <FeedTimeline groups={data} />
    </div>
  )
}

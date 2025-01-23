import { getDocumentsByWorkerId, getWorkerById } from "@/actions/workers"
import WorkerInDetails from "@/app/[locale]/workers/[id]/component"
import { FileTreeDemo } from "@/app/[locale]/workers/[id]/dummy-card"

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const workerResponse = await getWorkerById(id)
  const docsResponse = await getDocumentsByWorkerId(id)

  return (
    <div className="container">
      <WorkerInDetails worker={workerResponse.data} documents={docsResponse.data} />
    </div>
  )
}

export default page

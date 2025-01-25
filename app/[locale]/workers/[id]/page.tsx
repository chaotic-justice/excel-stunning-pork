import { getDocumentsByWorkerId, getWorkerById } from "@/actions/workers"
import WorkerInDetails from "@/app/[locale]/workers/[id]/component"

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const workerResponse = await getWorkerById(id)
  const docsResponse = await getDocumentsByWorkerId(id)
  const worker = workerResponse.data
  const documents = docsResponse.data

  return (
    <div className="container">
      <div className="mb-12 md:mb-8">
        <p className="font-bold text-2xl text-center mb-8 md:mb-16">Worker Details</p>
        <div className="flex flex-col md:flex-row justify-evenly space-y-4">
          <div className="md:self-center shadow-sm shadow-card-foreground p-3">
            <h2>{worker?.name}</h2>
            <h5 className="text-muted-foreground">kind: {worker?.kind}</h5>
            <h5 className="text-muted-foreground">created at: {worker?.createdAt}</h5>
          </div>
          <div className="text-left">
            {documents?.map((doc, index) => (
              <div key={index} className="grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{doc.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {worker && <WorkerInDetails worker={worker} documents={docsResponse.data} />}
    </div>
  )
}

export default page

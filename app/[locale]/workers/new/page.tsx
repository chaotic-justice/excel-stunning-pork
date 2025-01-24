import WorkerForm from "@/app/[locale]/workers/new/worker-form"

export default function page() {
  return (
    <div className="container">
      <p className="font-semibold text-center text-2xl md:text-3xl mb-12">Create a New Worker</p>
      <WorkerForm />
    </div>
  )
}

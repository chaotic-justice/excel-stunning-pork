import { ImageUploader } from "@/app/[locale]/images-uploader/component"

const page = async () => {
  return (
    <div className="container">
      <ImageUploader />
    </div>
  )
}

export default page

import { ImageUploader } from "@/app/[locale]/images-uploader/ImagesUploader"

const page = async () => {
  return (
    <div className="container">
      <ImageUploader />
    </div>
  )
}

export default page

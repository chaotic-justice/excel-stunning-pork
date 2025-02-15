"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getSliceFromArray } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import Image from "next/image"
import React from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { FaRegFile } from "react-icons/fa6"
import { z } from "zod"

export const ImageUploader: React.FC = () => {
  const [previews, setPreviews] = React.useState<Array<string | ArrayBuffer | null>>([])
  const { toast } = useToast()

  const formSchema = z.object({
    images: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload image(s)")
      .array(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      images: [],
    },
  })
  const imageValues = form.watch("images")

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newNames = acceptedFiles.map((f) => f.name)
      const dedupedIndices = imageValues.map((img, i) => (newNames.indexOf(img.name) === -1 ? i : -1)).filter((i) => i > -1)
      setPreviews((prev) => getSliceFromArray(prev, dedupedIndices))
      try {
        acceptedFiles.forEach((f) => {
          const reader = new FileReader()
          reader.onload = () => setPreviews((prev) => prev.concat(reader.result))
          reader.readAsDataURL(f)
        })
        form.setValue("images", getSliceFromArray(imageValues, dedupedIndices).concat(acceptedFiles))
        form.clearErrors("images")
      } catch (err: Error | any) {
        setPreviews([])
        form.resetField("images")
        toast({ description: err.message })
      }
    },
    [imageValues, form, toast]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 10,
    maxSize: 1000000 * 5,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promises = values.images.map(async (img, _) => {
      const formData = new FormData()
      formData.append("file", img)
      return fetch("https://first-build.simpler-times.workers.dev/api/v1/upload", {
        headers: {
          Authorization: `Bearer my-secret-token`,
        },
        method: "POST",
        body: formData,
      })
        .then(async (uploaded) => {
          const res = await uploaded.json()
          console.log("uploaded?", res)
          return true
        })
        .catch(() => {
          return false
        })
    })
    try {
      Promise.all(promises)
        .then(() => {
          form.resetField("images")
          setPreviews([])
          form.clearErrors("images")
          return "uploaded successfully 🎉"
        })
        .catch((err: Error | any) => {
          form.resetField("images")
          setPreviews([])
          toast({ description: err.message })
        })
    } catch (err: Error | any) {
      form.resetField("images")
      setPreviews([])
      toast({ description: err.message })
    }
  }

  const deleteMe = (idx: number) => {
    form.setValue(
      "images",
      imageValues.filter((_, j) => j !== idx)
    )
    setPreviews((prev) => prev.filter((_, j) => j !== idx))
  }

  const clearAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    form.resetField("images")
    setPreviews([])
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="mx-auto w-full md:w-3/5 lg:w-1/2">
                <FormMessage>{fileRejections.length !== 0 && <>Image must be less than 5MB and of type png, jpg, or jpeg</>}</FormMessage>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <FormControl>
                      <div {...getRootProps()} className={`border-2 border-dashed ${isDragActive ? "border-green-200" : "border-foreground-200"} rounded-lg flex flex-col gap-1 p-6 items-center`}>
                        <FaRegFile className="w-12 h-12" />
                        <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
                        <span className="text-xs text-gray-500">PDF, image, video, or audio</span>
                        <Input {...getInputProps()} type="file" />
                      </div>
                    </FormControl>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-2 md:gap-6">
                    <Button variant="destructive" onClick={clearAll} disabled={form.formState.isSubmitting} size="lg">
                      Clear
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
                      Upload
                    </Button>
                  </CardFooter>
                </Card>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="max-w-md mx-auto mt-8">
        <ul className="bg-white shadow-md rounded-lg overflow-hidden">
          {imageValues.map((img, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
              {previews && previews[i] && <Image src={previews[i] as string} alt={img.name} width={60} height={70} className="object-cover" />}
              <span className="text-gray-700">{img.name}</span>
              <Button variant="destructive" onClick={() => deleteMe(i)}>
                <X size={20} />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

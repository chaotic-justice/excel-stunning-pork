"use client"

import { uploadDocument } from "@/actions/workers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getAcceptableFileTypes, getSliceFromArray } from "@/lib/utils"
import { Document, Worker } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import React from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { FaRegFile } from "react-icons/fa6"
import { RiFile3Line } from "react-icons/ri"
import { z } from "zod"

type Props = { worker: Worker; documents: Document[] | null }

const WorkerInDetails = ({ worker, documents }: Props) => {
  const { toast } = useToast()

  const formSchema = z.object({
    docs: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload document(s)")
      .array(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      docs: [],
    },
  })
  const docValues = form.watch("docs")

  /* drop zone */
  const acceptables = getAcceptableFileTypes(worker.kind)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newNames = acceptedFiles.map((f) => f.name)
      const dedupedIndices = docValues.map((doc, i) => (newNames.indexOf(doc.name) === -1 ? i : -1)).filter((i) => i > -1)
      try {
        acceptedFiles.forEach((f) => {
          const reader = new FileReader()
          reader.readAsDataURL(f)
        })
        form.setValue("docs", getSliceFromArray(docValues, dedupedIndices).concat(acceptedFiles))
        form.clearErrors("docs")
      } catch (err: Error | any) {
        form.resetField("docs")
        toast({ description: err.message })
      }
    },
    [docValues, form, toast]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    onDropRejected(fileRejections, _) {
      const firstError = fileRejections[0].errors[0]
      toast({ variant: "destructive", title: firstError.code, description: firstError.message })
    },
    maxFiles: 20,
    maxSize: 1000000 * 5,
    accept: acceptables["acceptables"],
    disabled: !acceptables["isValid"],
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promises = values.docs.map(async (doc, _) => {
      const formData = new FormData()
      formData.append("file", doc)

      return uploadDocument({ worker, variables: formData })
        .then((res) => {
          return true
        })
        .catch(() => {
          return false
        })
    })
    try {
      Promise.all(promises)
        .then(async (vals) => {
          const revalidated = await fetch(`/api/revalidate?tag=getDocs/${worker.id}`)
          const revalidation = await revalidated.json()
          console.log("revalidation", revalidation)
          form.resetField("docs")
          form.clearErrors("docs")
          toast({ description: "uploaded successfully 🎉" + vals.every((v) => !!v) })
        })
        .catch((err: Error | any) => {
          form.resetField("docs")
          toast({ description: err.message })
        })
    } catch (err: Error | any) {
      toast({ description: err.message })
    }
  }

  const deleteMe = (idx: number) => {
    form.setValue(
      "docs",
      docValues.filter((_, j) => j !== idx)
    )
  }

  const clearAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    form.resetField("docs")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="docs"
            render={() => (
              <FormItem className="mx-auto w-full md:w-3/5 lg:w-1/2">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <FormControl>
                      <div {...getRootProps()} className={`border-2 border-dashed ${isDragActive ? "border-green-200" : "border-foreground-200"} rounded-lg flex flex-col gap-1 p-6 items-center`}>
                        <FaRegFile className="w-12 h-12" />
                        <span className="text-sm font-medium text-gray-500">Drag and drop file(s) or click to browse</span>
                        <span className="text-xs text-gray-500">PDF, image, or excel file (.XLSX)</span>
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
          {docValues.map((doc, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
              <RiFile3Line className="text-xl" />
              <span className="text-gray-700">{doc.name}</span>
              <Button variant="destructive" onClick={() => deleteMe(i)}>
                <X size={20} />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default WorkerInDetails

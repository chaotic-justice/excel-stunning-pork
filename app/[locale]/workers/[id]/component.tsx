"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, X } from "lucide-react"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { RiFileExcel2Fill } from "react-icons/ri"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FaRegFile } from "react-icons/fa6"
import Image from "next/image"
import { getSliceFromArray } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Document, newDocumentSchema, Worker } from "@/types/schemas"
import { File as TFile, Folder, Tree, TreeViewElement } from "@/components/ui/file-tree"
import { generateCfToken } from "@/actions/auth"
import { Method, useFetcher } from "@/hooks/use-fetcher"

type Props = { worker: Worker | null; documents: Document[] | null }

const WorkerInDetails = ({ worker, documents }: Props) => {
  const [previews, setPreviews] = React.useState<Array<string | ArrayBuffer | null>>([])
  const { toast } = useToast()
  const rootNode: TreeViewElement = {
    id: String(worker?.id) || "0",
    name: worker?.kind || "Unknown kind",
    isSelectable: true,
    children: documents?.map((doc, idx) => {
      return {
        id: String(doc?.id) || "0",
        name: doc?.name || "untitled document",
        isSelectable: true,
      }
    }),
  }

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

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newNames = acceptedFiles.map((f) => f.name)
      const dedupedIndices = docValues.map((doc, i) => (newNames.indexOf(doc.name) === -1 ? i : -1)).filter((i) => i > -1)
      setPreviews((prev) => getSliceFromArray(prev, dedupedIndices))
      try {
        acceptedFiles.forEach((f) => {
          const reader = new FileReader()
          reader.onload = () => setPreviews((prev) => prev.concat(reader.result))
          reader.readAsDataURL(f)
        })
        form.setValue("docs", getSliceFromArray(docValues, dedupedIndices).concat(acceptedFiles))
        form.clearErrors("docs")
      } catch (err: Error | any) {
        setPreviews([])
        form.resetField("docs")
        toast({ description: err.message })
      }
    },
    [docValues]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 10,
    maxSize: 1000000 * 5,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const cfToken = await generateCfToken()
    const promises = values.docs.map(async (doc, _) => {
      const formData = new FormData()
      formData.append("file", doc)
      /*
      fetch(`https://excel-peachy-serverless.simpler-times.workers.dev/api/r2/upload?kind=${worker?.kind}&workerId=${worker?.id}`, {
        headers: {
          Authorization: `Bearer ${cfToken}`,
        },
        method: "POST",
        body: formData,
      })
      */
      return useFetcher<Document, "POST">({ endpoint: `api/r2/upload?kind=${worker?.kind}&workerId=${worker?.id}`, method: "POST", schema: newDocumentSchema, variables: formData })
        .then(async (res) => {
          console.log("uploaded?", res.data)
          return true
        })
        .catch(() => {
          return false
        })
    })
    try {
      Promise.all(promises)
        .then(() => {
          form.resetField("docs")
          setPreviews([])
          form.clearErrors("docs")
          toast({ description: "uploaded successfully 🎉" })
        })
        .catch((err: Error | any) => {
          form.resetField("docs")
          setPreviews([])
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
    setPreviews((prev) => prev.filter((_, j) => j !== idx))
  }

  const clearAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    form.resetField("docs")
    setPreviews([])
  }

  return (
    <>
      <div>{worker?.name}</div>
      <Tree className="overflow-hidden rounded-md bg-background p-2" initialSelectedId={String(worker?.id) || "0"} initialExpandedItems={[String(worker?.id) || "0"]} elements={[rootNode]}>
        <Folder element={rootNode.name} value={rootNode.id}>
          {rootNode.children?.map((ele, idx) => {
            return (
              <TFile key={idx} value={ele.id}>
                <p>{ele.name}</p>
              </TFile>
            )
          })}
        </Folder>
      </Tree>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="docs"
            render={() => (
              <FormItem className="mx-auto w-full md:w-3/5 lg:w-1/2">
                <FormMessage>{fileRejections.length !== 0 && <>Image must be less than 1MB and of type png, jpg, or jpeg</>}</FormMessage>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <FormControl>
                      <div {...getRootProps()} className={`border-2 border-dashed ${isDragActive ? "border-green-200" : "border-foreground-200"} rounded-lg flex flex-col gap-1 p-6 items-center`}>
                        <FaRegFile className="w-12 h-12" />
                        <span className="text-sm font-medium text-gray-500">Drag and drop file(s) or click to browse</span>
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
          {docValues.map((doc, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
              {previews && previews[i] && <Image src={previews[i] as string} alt={doc.name} width={60} height={70} className="object-cover" />}
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

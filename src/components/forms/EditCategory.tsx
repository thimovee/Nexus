"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import { isArrayOfFile } from "@/lib/utils"
import { categorySchema } from "@/lib/validations/category"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDialog } from "@/components/FileDialog"
import { updateCategory } from "@/app/_actions/category"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { Edit, Loader, Plus } from "lucide-react"
import { Category, FeaturedStatus } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { FileWithPreview, ImageFile } from "@/types"
import { Zoom } from "../ImageZoom"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToaster } from "@/hooks/useToaster"


type Inputs = z.infer<typeof categorySchema>
const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export default function EditCategoryForm({ category }: { category: Category }) {
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
    const [isPending, startTransition] = React.useTransition()
    const { isUploading, startUpload } = useUploadThing("categoryImage")

    React.useEffect(() => {
        const files = category.thumbnail as ImageFile[]
        if (files && files.length > 0) {
            setFiles(
                files.map((image) => {
                    const file = new File([], image.name, {
                        type: "image",
                    })
                    const fileWithPreview = Object.assign(file, {
                        preview: image.url,
                    })
                    return fileWithPreview
                })
            )
        }
    }, [category])

    const form = useForm<Inputs>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            status: category.status,
        }
    })

    const router = useRouter()
    const toast = useToaster()

    function onSubmit(data: Inputs) {
        console.log(data)
        startTransition(async () => {
            try {
                const thumbnail = isArrayOfFile(data.thumbnail)
                    ? await startUpload(data.thumbnail).then((res) => {
                        const formattedImages = res?.map((image) => ({
                            id: image.key,
                            name: image.key.split("_")[1] ?? image.key,
                            url: image.url,
                        }))
                        return formattedImages ?? null
                    })
                    : null

                await updateCategory({
                    ...data,
                    id: category.id,
                    thumbnail: thumbnail,
                })
                router.push("/dashboard/categories")
                toast({
                    title: "Category updated successfully.",
                    variant: "success"
                })
            } catch (error) {
                error instanceof Error
                    ? toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive"
                    })
                    : toast({
                        title: "Error",
                        description: "Something went wrong. Please try again.",
                        variant: "destructive"
                    })
            }
        })
    }
    return (
        <Form {...form}>
            <form
                className="grid w-full max-w-2xl gap-5"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <FormItem>
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                        <Input
                            aria-invalid={!!form.formState.errors.name}
                            placeholder="Type product name here."
                            {...form.register("name")}
                            defaultValue={category.name}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.name?.message}
                    />
                </FormItem>
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-primary font-semibold">Featured</FormLabel>
                            <FormControl>
                                <Select defaultValue={category.status} onValueChange={(value: string) => field.onChange(value)} >
                                    <SelectTrigger className="bg-popover w-full capitalize">
                                        <SelectValue placeholder={field.name} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectGroup>
                                            {Object.values(FeaturedStatus).map((status) => (
                                                <SelectItem key={status} value={status} className="capitalize" >
                                                    {status === "NOT_FEATURED" ? "Not Featured" : status === "ACTIVE" ? "Featured" : "Archived"}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem className="flex w-full flex-col gap-1.5">
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                        <FileDialog
                            setValue={form.setValue}
                            name="thumbnail"
                            maxFiles={1}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            disabled={isPending}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.thumbnail?.message}
                    />
                </FormItem>
                {files?.length && (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-base font-medium">Uploaded image</h2>
                        {files.map((file, i) => (
                            <Zoom key={i}>
                                <Image loading="lazy" width={1500} height={1500} className="w-1/4 h-20 object-cover rounded-sm" src={file.preview} alt={file.name} />
                            </Zoom>
                        ))}
                    </div>
                )}
                <div className="flex space-x-2">
                    <Button variant="cta" className="w-full " disabled={isPending}>
                        {isPending && (
                            <Loader
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Update category
                        <span className="sr-only">Update category</span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}
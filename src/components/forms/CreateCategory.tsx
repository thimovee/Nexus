"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addCategory } from "@/app/_actions/category"
import { Loader, Plus } from "lucide-react"
import { categorySchema } from "@/lib/validations/category"
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FeaturedStatus } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { FileWithPreview } from "@/types"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { FileDialog } from "../FileDialog"
import Image from "next/image"
import { Zoom } from "../ImageZoom"
import { useRouter } from "next/navigation"
import { useToaster } from "@/hooks/useToaster"

type Inputs = z.infer<typeof categorySchema>
const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function CreateCategory() {
    const router = useRouter()
    const toast = useToaster()
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
    const { isUploading, startUpload } = useUploadThing("categoryImage")
    const [isPending, startTransition] = React.useTransition()
    const form = useForm<Inputs>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            status: "NOT_FEATURED",
        },
    })

    function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                const thumbnail = data.thumbnail as FileWithPreview
                    // @ts-ignore
                    ? await startUpload(data.thumbnail).then((res) => {
                        const formattedImages = res?.map((image) => ({
                            id: image.key,
                            name: image.key.split('_')[1] ?? image.key,
                            url: image.url,
                        }))
                        return formattedImages
                    })
                    : null
                await addCategory({
                    ...data,
                    thumbnail: thumbnail,
                })
                toast({
                    title: "Category created successfully!",
                    variant: "success",
                })
                form.resetField("name")
                form.resetField("thumbnail")
                form.resetField("status")
                setFiles(null)
                router.push("/dashboard/categories")
            } catch (error) {
                error instanceof Error
                    ? toast({
                        title: error.message,
                        variant: "destructive",
                    })
                    : toast({
                        title: "Something went wrong, please try again.",
                        variant: "destructive",
                    })
            }
        })
    }



    return (
        <Form {...form}>
            <form
                className="grid w-full max-w-2xl py-4 gap-5"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <FormItem>
                    <FormLabel className="text-primary font-semibold">Category Name</FormLabel>
                    <FormControl>
                        <Input
                            aria-invalid={!!form.formState.errors.name}
                            placeholder="Example: Electronics"
                            {...form.register("name")}
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
                            <FormLabel className="text-primary font-semibold">Featured status</FormLabel>
                            <FormControl>
                                <Select value={field.value.toString()} onValueChange={(value: string) => field.onChange(value)} >
                                    <SelectTrigger className="bg-popover w-full capitalize">
                                        <SelectValue placeholder={field.name} />
                                    </SelectTrigger>
                                    <SelectContent>
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
                    <FormLabel className="text-primary font-semibold">Thumbnail</FormLabel>
                    <FormControl>
                        <>
                            <FileDialog
                                setValue={form.setValue}
                                name="thumbnail"
                                maxFiles={1}
                                maxSize={1024 * 1024 * 5}
                                files={files}
                                setFiles={setFiles}
                                isUploading={isUploading}
                                disabled={isPending}
                            />
                        </>
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.thumbnail?.message}
                    />
                    {files && files?.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <h2 className="text-base font-medium">Uploaded image</h2>
                            <Zoom>
                                <Image loading="lazy" width={1500} height={1500} className="w-1/4 h-20 object-cover rounded-sm" src={files[0].preview} alt={files[0].path!} />
                            </Zoom>
                        </div>
                    )}
                </FormItem>
                <Button variant={"cta"} className=" mt-8 w-full " disabled={isPending}>
                    {isPending && (
                        <Loader
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Create Category
                    <span className="sr-only">Create Category</span>
                </Button>
            </form>
        </Form>
    )
}
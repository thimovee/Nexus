"use client"

import * as React from "react"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"
import { isArrayOfFile } from "@/lib/utils"
import { productSchema } from "@/lib/validations/product"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/FileDialog"
import { addProduct } from "@/app/_actions/product"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { Category } from "@prisma/client"

type Inputs = z.infer<typeof productSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function CreateProduct({ categories }: { categories: Category[] }) {
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
    const [isPending, startTransition] = React.useTransition()
    const { isUploading, startUpload } = useUploadThing("productImages")
    const router = useRouter()
    const form = useForm<Inputs>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            categoryId: 12,
        },
    })

    function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                const images = isArrayOfFile(data.images)
                    ? await startUpload(data.images).then((res) => {
                        const formattedImages = res?.map((image) => ({
                            id: image.fileKey,
                            name: image.fileKey.split('_')[1] ?? image.fileKey,
                            url: image.fileUrl,
                        }))
                        return formattedImages
                    })
                    : null
                await addProduct({
                    ...data,
                    // @ts-ignore
                    images,
                })
                toast.success("Product added successfully.")
                form.resetField("name")
                form.resetField("description")
                form.resetField("price")
                form.resetField("images")
                form.resetField("categoryId")
                form.resetField("inventory")
                setFiles(null)
                router.push("/dashboard/products")
            } catch (error) {
                error instanceof Error
                    ? toast.error(error.message)
                    : toast.error("Something went wrong, please try again.")
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input
                            aria-invalid={!!form.formState.errors.name}
                            placeholder="Type product name here."
                            {...form.register("name")}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.name?.message}
                    />
                </FormItem>
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value.toString()}
                                    onValueChange={(value: string) =>
                                        field.onChange(Number(value))
                                    }
                                >
                                    <SelectTrigger className="capitalize">
                                        <SelectValue placeholder={field.name} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categories.length > 0 && categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                    className="capitalize"
                                                >
                                                    {category.name}
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

                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Type product description here."
                            {...form.register("description")}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.description?.message}
                    />
                </FormItem>
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                </div>
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                    <FormItem className="w-full">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Type product price here."
                                {...form.register("price")}
                            />
                        </FormControl>
                        <UncontrolledFormMessage
                            message={form.formState.errors.price?.message}
                        />
                    </FormItem>
                    <FormItem className="w-full">
                        <FormLabel>Inventory</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="Type product inventory here."
                                {...form.register("inventory", {
                                    valueAsNumber: true,
                                })}
                            />
                        </FormControl>
                        <UncontrolledFormMessage
                            message={form.formState.errors.inventory?.message}
                        />
                    </FormItem>
                </div>
                <FormItem className="flex w-full flex-col gap-1.5">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                        <FileDialog
                            setValue={form.setValue}
                            name="images"
                            maxFiles={3}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            disabled={isPending}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.images?.message}
                    />
                </FormItem>
                <Button className="w-full bg-slate-900 text-slate-100" disabled={isPending}>
                    {isPending && (
                        <Loader
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Add Product
                    <span className="sr-only">Add Product</span>
                </Button>
            </form>
        </Form>
    )
}
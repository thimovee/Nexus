"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { isArrayOfFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDialog } from "@/components/FileDialog";
import { Edit, Loader, Plus } from "lucide-react";
import { Category, Product } from "@prisma/client";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { FileWithPreview, ImageFile } from "@/types";
import { Zoom } from "../ImageZoom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToaster } from "@/hooks/useToaster";
import { productSchema } from "@/lib/validations/product";
import { updateProduct } from "@/app/_actions/product";
import { OurFileRouter } from "@/app/api/uploadthing/core";

type Inputs = z.infer<typeof productSchema>;
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function EditProductForm({ product, categories }: { product: Product, categories: Category[] }) {
    const [files, setFiles] = React.useState<FileWithPreview[]>([]);
    const [isPending, startTransition] = React.useTransition();
    const { isUploading, startUpload } = useUploadThing("productImages");

    React.useEffect(() => {
        const files = product.images as ImageFile[];
        if (files && files.length > 0) {
            setFiles(
                files.map((image) => {
                    const file = new File([], image.name, {
                        type: "image",
                    });
                    const fileWithPreview = Object.assign(file, {
                        preview: image.url,
                    });
                    return fileWithPreview;
                })
            );
        }
    }, [product]);

    const form = useForm<Inputs>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description ?? "",
            categoryId: product.categoryId,
            price: product.price,
            inventory: product.inventory,
        }
    });

    const router = useRouter();
    const toast = useToaster();

    function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                let existingImages = product.images ?? [];
                const newImages = isArrayOfFile(data.images)
                    ? await startUpload(data.images).then((res) => {
                        const formattedImages = res?.map((image) => ({
                            id: image.key,
                            name: image.key.split("_")[1] ?? image.key,
                            url: image.url,
                        }));
                        return formattedImages ?? [];
                    })
                    : [];

                const combinedImages = [...existingImages, ...newImages];

                await updateProduct({
                    ...data,
                    id: product.id,
                    images: combinedImages,
                });
                router.push("/dashboard/products");
                toast({
                    title: "Product updated successfully.",
                    variant: "success"
                });
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
                    });
            }
        });
    }

    return (
        <Form {...form}>
            <form
                className="grid w-full max-w-2xl gap-5"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <FormItem>
                    <FormLabel>Product name</FormLabel>
                    <FormControl>
                        <Input
                            aria-invalid={!!form.formState.errors.name}
                            placeholder="Type product name here."
                            {...form.register("name")}
                            defaultValue={product.name}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.name?.message}
                    />
                </FormItem>
                <FormItem className="w-full">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            inputMode="numeric"
                            placeholder="Type product price here."
                            {...form.register("price", { valueAsNumber: true })}
                            defaultValue={product.price}
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
                            defaultValue={product.inventory}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.inventory?.message}
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input
                            aria-invalid={!!form.formState.errors.description}
                            placeholder="Type product description here."
                            {...form.register("description")}
                            defaultValue={product.description}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.description?.message}
                    />
                </FormItem>

                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                        <Select
                            aria-invalid={!!form.formState.errors.categoryId}
                            {...form.register("categoryId")}
                            defaultValue={product.categoryId.toString()}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            {categories.map((category) => (
                                <SelectContent key={category.id}>
                                    <SelectItem value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                </SelectContent>
                            ))}
                        </Select>
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.categoryId?.message}
                    />
                </FormItem>

                <FormItem className="flex w-full flex-col gap-1.5">
                    <FormLabel>Product images</FormLabel>
                    <FormControl>
                        <FileDialog
                            setValue={form.setValue}
                            name="images"
                            maxFiles={4}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            defaultValue={Array.from(product.images) as string[]}
                            isUploading={isUploading}
                            disabled={isPending}
                            appendImages={true}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.images?.message}
                    />
                </FormItem>
                {files?.length && (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-base font-medium">Uploaded images</h2>
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
                        Update product
                        <span className="sr-only">Update product</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}

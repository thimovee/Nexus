"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Edit, EditIcon, Loader, Plus } from "lucide-react"
import { useToaster } from "@/hooks/useToaster"
import { attributeGroupSchema } from "@/lib/validations/attributes"
import { updateAttributeGroup } from "@/app/_actions/attributes"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ExtendedAttributeGroup } from "@/types"

type Inputs = z.infer<typeof attributeGroupSchema>

export default function EditAttributeGroupForm({ attribute }: { attribute: ExtendedAttributeGroup }) {
    const [isPending, startTransition] = React.useTransition()


    const form = useForm<Inputs>({
        resolver: zodResolver(attributeGroupSchema),
    })

    const toast = useToaster()

    function onSubmit(data: Inputs) {
        console.log(data)
        startTransition(async () => {
            try {
                await updateAttributeGroup({
                    ...data,
                    id: attribute.id,
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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <EditIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit attribute</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="grid w-full max-w-2xl gap-5"
                        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
                    >
                        <FormItem>
                            <FormLabel>Attribute name</FormLabel>
                            <FormControl>
                                <Input
                                    aria-invalid={!!form.formState.errors.name}
                                    placeholder="Type attribute name here."
                                    {...form.register("name")}
                                    defaultValue={attribute.name}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.name?.message}
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Attribute description</FormLabel>
                            <FormControl>
                                <Input
                                    aria-invalid={!!form.formState.errors.description}
                                    placeholder="Type attribute description here."
                                    {...form.register("description")}
                                    defaultValue={attribute.description ?? ""}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.description?.message}
                            />
                        </FormItem>
                        <div className="flex space-x-2">
                            <Button variant="cta" className="w-full " disabled={isPending}>
                                {isPending && (
                                    <Loader
                                        className="mr-2 h-4 w-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                )}
                                Update attribute
                                <span className="sr-only">Update attribute</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormItem, FormLabel, UncontrolledFormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { attributeGroupSchema } from "@/lib/validations/attributes"
import { createNewAttributeGroup } from "@/app/_actions/attributes"

type Inputs = z.infer<typeof attributeGroupSchema>


export function CreateAttributeGroup() {
    const [isPending, startTransition] = React.useTransition()
    const form = useForm<Inputs>({
        resolver: zodResolver(attributeGroupSchema),
    })

    function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                await createNewAttributeGroup({ ...data })
            } catch (error) {
                error instanceof Error
                    ? toast.error(error.message)
                    : toast.error("Something went wrong, please try again.")
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2" variant="cta">
                    <Plus className="w-4 h-4" />
                    <span>Add Attribute Group</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
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
                                    placeholder="Type attribute group name here."
                                    {...form.register("name")}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.name?.message}
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type attribute group description here."
                                    {...form.register("description")}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.description?.message}
                            />
                        </FormItem>
                        <Button className="w-full bg-cta text-background" disabled={isPending}>
                            {isPending && (
                                <Loader
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Add Attribute Group
                            <span className="sr-only">Add Attribute Group</span>
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>


    )
}
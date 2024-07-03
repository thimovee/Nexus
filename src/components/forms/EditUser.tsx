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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Customer, ExtendedAttributeGroup } from "@/types"
import { editUserSchema } from "@/lib/validations/users"
import { updateUser } from "@/app/_actions/users"

type Inputs = z.infer<typeof editUserSchema>

export default function EditUser({ customer }: { customer: Customer }) {
    const [isPending, startTransition] = React.useTransition()


    const form = useForm<Inputs>({
        resolver: zodResolver(editUserSchema),
    })

    const toast = useToaster()

    function onSubmit(data: Inputs) {
        console.log(data)
        startTransition(async () => {
            try {
                await updateUser({
                    ...data,
                    id: customer.id,
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
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="grid w-full max-w-2xl gap-5"
                        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
                    >
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input
                                    aria-invalid={!!form.formState.errors.firstName}
                                    placeholder="Type the users firstname here."
                                    {...form.register("firstName")}
                                    defaultValue={customer.firstName}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.firstName?.message}
                            />
                        </FormItem>

                        <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input
                                    aria-invalid={!!form.formState.errors.lastName}
                                    placeholder="Type the users lastname here."
                                    {...form.register("lastName")}
                                    defaultValue={customer.lastName}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.lastName?.message}
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    aria-invalid={!!form.formState.errors.primaryEmailAddressId}
                                    placeholder="Type the users email here."
                                    {...form.register("primaryEmailAddressId")}
                                    defaultValue={customer.primaryEmailAddressId}
                                />
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.primaryEmailAddressId?.message}
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select
                                    aria-invalid={!!form.formState.errors.role}
                                    {...form.register("role")}
                                    defaultValue={customer.role === "admin" ? "admin" : "user"}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue defaultValue={customer.role === "admin" ? "Admin" : "User"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <UncontrolledFormMessage
                                message={form.formState.errors.role?.message}
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
        </Dialog >
    )
}
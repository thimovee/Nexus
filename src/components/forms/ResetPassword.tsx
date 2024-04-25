"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { catchClerkError } from "@/lib/utils"
import { checkEmailSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"

type Inputs = z.infer<typeof checkEmailSchema>

export function ResetPassword() {
    const router = useRouter()
    const { isLoaded, signIn } = useSignIn()
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<Inputs>({
        resolver: zodResolver(checkEmailSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(data: Inputs) {
        if (!isLoaded) return

        startTransition(async () => {
            try {
                const firstFactor = await signIn.create({
                    strategy: "reset_password_email_code",
                    identifier: data.email,
                })

                if (firstFactor.status === "needs_first_factor") {
                    router.push("/sign-in/forgot-password/step2")
                    toast.message("Check your email", {
                        description: "We sent you a 6-digit verification code.",
                    })
                }
            } catch (err) {
                catchClerkError(err)
            }
        })
    }

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="youremail@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant="cta" type="submit" disabled={isPending}>
                    {isPending && (
                        <Loader
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Continue
                    <span className="sr-only">Continue to password reset verification</span>
                </Button>
            </form>
        </Form>
    )
}
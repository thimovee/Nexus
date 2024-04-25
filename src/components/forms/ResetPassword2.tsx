"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { catchClerkError, cn } from "@/lib/utils"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader } from "lucide-react"

type Inputs = z.infer<typeof resetPasswordSchema>

export function ResetPasswordStep2() {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const { isLoaded, signIn, setActive } = useSignIn()
    const [isPending, startTransition] = React.useTransition()
    const form = useForm<Inputs>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            code: "",
        },
    })

    function onSubmit(data: Inputs) {
        if (!isLoaded) return

        startTransition(async () => {
            try {
                const attemptFirstFactor = await signIn.attemptFirstFactor({
                    strategy: "reset_password_email_code",
                    code: data.code,
                    password: data.password,
                })

                if (attemptFirstFactor.status === "needs_second_factor") {
                } else if (attemptFirstFactor.status === "complete") {
                    await setActive({
                        session: attemptFirstFactor.createdSessionId,
                    })
                    router.push(`${window.location.origin}/`)
                    toast.success("Password reset successfully.")
                } else {
                    console.error(attemptFirstFactor)
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className={cn("pr-10 bg-popover placeholder:text-primary/50")}
                                        placeholder="********"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        disabled={field.value === "" || field.disabled}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-4 w-4" aria-hidden="true" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className={cn("pr-10 bg-popover placeholder:text-primary/50")}
                                        placeholder="********"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        disabled={field.value === "" || field.disabled}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-4 w-4" aria-hidden="true" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="123456"
                                    {...field}
                                    onChange={(e) => {
                                        e.target.value = e.target.value.trim()
                                        field.onChange(e)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant="cta" disabled={isPending}>
                    {isPending && (
                        <Loader
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Reset password
                    <span className="sr-only">Reset password</span>
                </Button>
            </form>
        </Form>
    )
}
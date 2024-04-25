"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { catchClerkError, cn } from "@/lib/utils"
import { authSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { Eye, EyeOff, Loader } from "lucide-react"

type Inputs = z.infer<typeof authSchema>

export function SignInForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const { isLoaded, signIn, setActive } = useSignIn()
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<Inputs>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: Inputs) {
        if (!isLoaded) return

        startTransition(async () => {
            try {
                const result = await signIn.create({
                    identifier: data.email,
                    password: data.password,
                })

                if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId })
                    router.push(`${window.location.origin}/`)
                } else {
                    console.log(result)
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
                                <Input
                                    type="text"
                                    placeholder="youremail@gmail.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                        className={cn("pr-10")}
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
                <Button variant="cta" type="submit" disabled={isPending}>
                    {isPending && (
                        <Loader
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Sign in
                    <span className="sr-only">Sign in</span>
                </Button>
            </form>
        </Form>
    )
}
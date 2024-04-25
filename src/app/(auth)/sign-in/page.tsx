
import Link from "next/link";
import { SignInForm } from "./SignInForm";
import { OAuthSignIn } from "./OAuthSignIn";

export const runtime = "edge";

export default function SignInPage() {
    return (
        <div className="flex flex-col p-5 rounded-md max-w-md w-full border border-border bg-card">
            <h1 className="font-semibold text-primary text-2xl">Sign In</h1>
            <p className="text-primary/50 text-sm mt-2 mb-6">Choose your preffered sign in method</p>
            <OAuthSignIn />
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-primary/50">
                        Or continue with
                    </span>
                </div>
            </div>
            <SignInForm />
            <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex gap-1 items-center">
                    <p className="text-primary/50">Don&apos;t have an account?</p>
                    <Link className="hover:underline underline-offset-4 text-primary font-medium" href="/sign-up">Sign up</Link>
                </div>
                <Link className="hover:underline underline-offset-4 text-primary font-medium leading-none" href="/sign-in/forgot-password">Forgot password?</Link>
            </div>
        </div>
    )
}

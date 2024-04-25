import Link from "next/link";
import { OAuthSignIn } from "../sign-in/OAuthSignIn";
import { SignUpForm } from "./SignUpForm";


export const runtime = "edge";

export default function SignUpPage() {
    return (
        <div className="flex flex-col p-5 rounded-md max-w-md w-full border border-border bg-card">
            <h1 className="font-semibold text-primary text-2xl">Sign Up</h1>
            <p className="text-primary/50 text-sm mt-2 mb-6">Choose your preffered sign up method</p>
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
            <SignUpForm />
            <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex gap-1 items-center">
                    <p className="text-primary/50">Already have an account?</p>
                    <Link className="hover:underline underline-offset-4 text-primary font-medium" href="/sign-in">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

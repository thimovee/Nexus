import { VerifyEmailForm } from "./VerifyEmailForm";

export default function VerifyEmailPage() {
    return (
        <div className="flex flex-col p-5 rounded-md max-w-md w-full border border-border bg-card">
            <h1 className="font-semibold text-primary text-2xl">Verify email</h1>
            <p className="text-primary/50 text-sm mt-2 mb-6">Verify your email address to complete your account creation</p>
            <VerifyEmailForm />
        </div>
    )
}
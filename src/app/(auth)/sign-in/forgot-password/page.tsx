import { ResetPassword } from "@/components/forms/ResetPassword";

export default function ResetPasswordStep2Page() {
    return (
        <div className="flex flex-col p-5 rounded-md max-w-md w-full border border-border bg-card">
            <h1 className="font-semibold text-primary text-2xl">Reset password</h1>
            <p className="text-primary/50 text-sm mt-2 mb-6">Enter your email address and we will send you a verification code</p>
            <ResetPassword />
        </div>
    )
}
import { ResetPasswordStep2 } from "@/components/forms/ResetPassword2";

export default function ResetPasswordStep2Page() {
    return (
        <div className="flex flex-col p-5 rounded-md max-w-md w-full border border-border bg-card">
            <h1 className="font-semibold text-primary text-2xl">New password</h1>
            <p className="text-primary/50 text-sm mt-2 mb-6">Enter your new password below using your verification code.</p>
            <ResetPasswordStep2 />
        </div>
    )
}
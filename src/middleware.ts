import { NextResponse } from "next/server"
import { authMiddleware, clerkClient } from "@clerk/nextjs"
import { type UserRole } from "./types"
export default authMiddleware({
    publicRoutes: [
        "/",
        "/sign-in(.*)",
        "/sign-up(.*)",
        "/sso-callback(.*)",
        "/categories(.*)",
        "/product(.*)",
        "/products(.*)",
        "/blog(.*)",
        "/about(.*)",
        "/api(.*)",
    ],
    async afterAuth(auth, req) {
        if (auth.isPublicRoute) {
            return NextResponse.next()
        }
        const url = new URL(req.nextUrl.origin)
        if (!auth.userId) {
            url.pathname = "/sign-in"
            return NextResponse.redirect(url)
        }
        const user = await clerkClient.users.getUser(auth.userId)
        if (!user) {
            throw new Error("User not found.")
        }
        if (!user.privateMetadata.role) {
            await clerkClient.users.updateUserMetadata(auth.userId, {
                privateMetadata: {
                    role: "user" satisfies UserRole,
                },
            })
        }
    },
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
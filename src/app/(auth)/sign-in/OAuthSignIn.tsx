"use client";
import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Loader } from "lucide-react";

export function OAuthSignIn() {
    const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
    const { signIn, isLoaded: signInLoaded } = useSignIn();

    const oauthSignIn = async (provider: OAuthStrategy) => {
        if (!signInLoaded) return null;
        try {
            setIsLoading(provider);
            await signIn.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (cause) {
            console.error(cause);
            setIsLoading(null);
            toast.error("Something went wrong, please try again.")
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                variant="outline"
                className="bg-popover"
                onClick={() => oauthSignIn("oauth_github")}
            >
                {isLoading === "oauth_github" ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.github className="mr-2 h-4 w-4" />
                )}
                Github
            </Button>
            <Button
                variant="outline"
                className="bg-popover"
                onClick={() => oauthSignIn("oauth_google")}
            >
                {isLoading === "oauth_google" ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}
                Google
            </Button>
        </div>
    );
}
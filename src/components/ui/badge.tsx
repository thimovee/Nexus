import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center h-6  items-center rounded-full border px-2.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-background text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-background text-primary hover:bg-background/80",
                outline: "border-border border bg-transparent text-primary",
                archived: "text-yellow-700  bg-yellow-100/75 border border-yellow-400/25",
                destructive:
                    "border-redborder bg-redbackground text-redtext",
                success: "border-greenborder bg-greenbackground text-greentext",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }

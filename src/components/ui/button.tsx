import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

const buttonVariants = cva(
    'active:scale-95 inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 justify-center rounded-md text-sm font-medium transition-colors  disabled:opacity-40  disabled:pointer-events-none ',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary ',
                destructive: 'text-white bg-red-600 ',
                danger: 'text-white bg-yellow-500 ',
                outline:
                    'bg-transparent text-foreground outline outline-1 outline-border hover:bg-border',
                subtle:
                    'hover:bg-zinc-200 bg-gray-200/75 text-zinc-900',
                ghost:
                    'bg-transparent hover:bg-primary/5 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-transparent data-[state=open]:bg-transparent',
                link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
                cta: 'bg-cta hover:bg-cta/90 text-background font-medium',
                secondary_cta: 'bg-cta/20 hover:bg-cta/30 text-cta font-medium',
            },
            size: {
                default: 'h-9 py-2 px-4',
                sm: 'h-9 px-[10px] rounded-md',
                md: 'h-10 py-2 px-3 rounded-md',
                xs: 'h-8 px-1.5 rounded-sm',
                lg: 'h-11 px-8 rounded-md',
                icon: "h-9 w-9 rounded-full",
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant, isLoading, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading}
                {...props}>
                {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
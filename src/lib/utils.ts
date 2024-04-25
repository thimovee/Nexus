import { isClerkAPIResponseError } from '@clerk/nextjs'
import { ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(
    price: number
) {
    const isWholeNumber = Math.floor(price) === price;
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: isWholeNumber ? 0 : 2,
        maximumFractionDigits: isWholeNumber ? 0 : 2,
    }).format(Number(price));

    return formattedPrice;
}

export function formatDate(date: Date | string) {
    return dayjs(date).format("MMMM D, YYYY")
}

export function catchError(err: unknown) {
    if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue) => {
            return issue.message
        })
        return toast(errors.join("\n"))
    } else if (err instanceof Error) {
        return toast(err.message)
    } else {
        return toast("Something went wrong, please try again later.")
    }
}

export function catchClerkError(err: unknown) {
    const unknownErr = "Something went wrong, please try again later."

    if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue) => {
            return issue.message
        })
        return toast(errors.join("\n"))
    } else if (isClerkAPIResponseError(err)) {
        return toast.error(err.errors[0]?.longMessage ?? unknownErr)
    } else {
        return toast.error(unknownErr)
    }
}

export function isArrayOfFile(files: unknown): files is File[] {
    const isArray = Array.isArray(files)
    if (!isArray) return false
    return files.every((file) => file instanceof File)
}

// const truncatedName = item.name.length > 10 ? `${item.name.substring(0, 10)}..` : item.name;

export function truncate(str: string, n: number) {
    return str.length > n ? str.substring(0, n) + ".." : str;
}
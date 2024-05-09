import { FeaturedStatus } from "@prisma/client"
import * as z from "zod"

export const categorySchema = z.object({
    name: z.string().min(3, "Category name must be at least 3 characters long").max(255, "Category name can't be longer than 256 characters"),
    thumbnail: z.unknown(),
    status: z.enum([FeaturedStatus.ACTIVE, FeaturedStatus.NOT_FEATURED, FeaturedStatus.ARCHIVED])
})
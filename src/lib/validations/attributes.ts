import * as z from "zod"

export const attributeGroupSchema = z.object({
    name: z.string().min(3).max(255),
    description: z.string().optional(),
})

export const attributeSchema = z.object({
    name: z.string().min(3).max(255),
    attributeGroupId: z.number(),
})
import * as z from "zod";

export const editUserSchema = z.object({
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(3).max(255),
    primaryEmailAddressId: z.string().optional().nullable().default(null),
    emailAddresses: z
        .array(
            z.object({
                id: z.string(),
                emailAddress: z.string().email().min(3).max(255),
                verification: z.object({
                    status: z.literal("verified").optional().nullable().default(null),
                    strategy: z.literal("from_oauth_google").optional().nullable().default(null),
                    externalVerificationRedirectURL: z.string().optional().nullable().default(null),
                    attempts: z.number().optional().nullable().default(null),
                    expireAt: z.number().optional().nullable().default(null),
                    nonce: z.string().optional().nullable().default(null)
                })
            })
        )
        .optional()
        .nullable()
        .default(null),
    phoneNumbers: z
        .array(z.string().optional().nullable().default(null))
        .optional()
        .nullable()
        .default(null),
    role: z.literal("admin").or(z.literal("user")).optional().nullable().default(null),
});

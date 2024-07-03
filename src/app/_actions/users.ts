"use server"

import { editUserSchema } from "@/lib/validations/users";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getAllUsers() {
    const users = await clerkClient.users.getUserList();
    const serializableUsers = users.map((user) => ({
        id: user.id,
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses.map((emailAddress) => ({
            emailAddress: emailAddress.emailAddress,
        })),
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        role: user.privateMetadata.role,
    }));
    return serializableUsers;
}

export async function deleteUser(userId: string) {
    await clerkClient.users.deleteUser(userId);
    revalidatePath("/dashboard/customers");
}

export async function updateUser(input: z.infer<typeof editUserSchema> & {
    id: string
}) {
    const primaryEmailId = await clerkClient.users.getUser(input.id).then((user) => user.emailAddresses[0].id);

    await clerkClient.users.updateUser(input.id, {
        privateMetadata: {
            role: input.role
        },
        firstName: input.firstName,
        lastName: input.lastName,
    });
    revalidatePath("/dashboard/customers");
}

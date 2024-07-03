"use server"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from 'slugify';
import { attributeGroupSchema } from "@/lib/validations/attributes";

export async function createNewAttributeValue(attributeId: number, value: string) {
    const attributeValue = await db.attributeValue.create({
        data: {
            attributeId,
            value,
        },
    });

    revalidatePath(`/dashboard/attributes`);

    return attributeValue;
}

export async function deleteAttributeValue(id: number) {
    const attributeValue = await db.attributeValue.delete({
        where: {
            id,
        },
    });

    revalidatePath(`/dashboard/attributes`);

    return attributeValue;
}

export async function createNewAttributeGroup(data: z.infer<typeof attributeGroupSchema>) {
    const sameNameAttributeGroup = await db.attribute.findFirst({
        where: {
            name: data.name,
        },
    });

    if (sameNameAttributeGroup) {
        throw new Error("Attribute group with the same name already exists.");
    }

    const attributeGroup = await db.attribute.create({
        data: {
            ...data,
        },
    });

    revalidatePath(`/dashboard/attributes`);

    return attributeGroup;
}

export async function deleteAttributeGroup(id: number) {

    const attributeValues = await db.attributeValue.findMany({
        where: {
            attributeId: id,
        },
    });

    for (const attributeValue of attributeValues) {
        await db.attributeValue.delete({
            where: {
                id: attributeValue.id,
            },
        });
    }

    const attributeGroup = await db.attribute.delete({
        where: {
            id,
        },
    });

    revalidatePath(`/dashboard/attributes`);

    return attributeGroup;
}

export async function updateAttributeGroup(data: z.infer<typeof attributeGroupSchema> & { id: number }) {
    const attributeGroup = await db.attribute.update({
        where: {
            id: data.id,
        },
        data: {
            ...data,
        },
    });

    revalidatePath(`/dashboard/attributes`);

    return attributeGroup;
}

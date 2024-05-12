"use server"
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validations/category";
import { ImageFile } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from 'slugify';
import { FeaturedStatus } from "@prisma/client";

export async function getCategories() {
    return await db.category.findMany({
        where: {
            isDeleted: false,
        },
    });
}

export async function getCategoriesWithProductCount() {
    const categories = await db.category.findMany({
        where: {
            isDeleted: false,
        },
    });

    const categoryIds = categories.map((category) => category.id);

    const productCounts = await db.product.groupBy({
        by: ['categoryId'],
        _count: {
            categoryId: true,
        },
        where: {
            categoryId: {
                in: categoryIds,
            },
        },
    });

    const categoriesWithProductCount = categories.map((category) => {
        const productCount = productCounts.find((count) => count.categoryId === category.id);
        return {
            ...category,
            productCount: productCount?._count?.categoryId || 0,
        };
    });

    return categoriesWithProductCount
}

export async function addCategory(input: z.infer<typeof categorySchema>) {
    const categoryWithSameName = await db.category.findFirst({
        where: {
            name: input.name
        }
    });

    if (categoryWithSameName) {
        throw new Error("A category with this name already exists.");
    }
    const thumbnail = input.thumbnail as ImageFile[];
    const slug = slugify(input.name, { lower: true, replacement: '-' });
    const { ...otherData } = input;

    const categoryData = {
        ...otherData,
        slug,
        thumbnail: thumbnail,
    };

    await db.category.create({
        data: categoryData
    });
    revalidatePath("/dashboard/categories");
}

export async function deleteCategories(ids: number[]) {
    const isFeatured = await db.category.findMany({
        where: {
            id: {
                in: ids,
            },
            status: "ACTIVE",
        },
    });
    const hasLinkedProducts = await db.product.findMany({
        where: {
            categoryId: {
                in: ids,
            }
        },
    });

    if (hasLinkedProducts.length > 0) {
        throw new Error("Category has linked products");
    }

    if (isFeatured.length > 0) {
        throw new Error("Cannot delete featured category");
    }

    else {
        await db.category.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                isDeleted: true
            },
        });
        revalidatePath("/dashboard/categories");
    }
}

export async function undoDeleteCategories(ids: number[]) {
    await db.category.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            isDeleted: false
        }
    });

    revalidatePath("/dashboard/categories");
}

export async function updateCategory(input: z.infer<typeof categorySchema> & {
    id: number
}) {
    if (typeof input.id !== "number") {
        throw new Error("Invalid input, provide a number.")
    }

    const category = await db.category.findFirst({
        where: {
            id: input.id
        }
    })

    if (!category) {
        throw new Error("Category not found.")
    }

    const newSlug = slugify(input.name, { lower: true, replacement: '-' });
    const thumbnail = input.thumbnail as ImageFile[];
    let updateData: Record<string, unknown> = {
        ...input,
        slug: newSlug
    };

    if (thumbnail && thumbnail.length > 0) {
        updateData.thumbnail = {
            set: thumbnail,
        };
    } else {
        delete updateData.thumbnail;
    }

    await db.category.update({
        where: {
            id: input.id
        },
        data: updateData
    })
    revalidatePath("/dashboard/categories");
}

export async function changeCategoriesStatus(ids: number[], status: FeaturedStatus) {
    await db.category.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            status: status
        }
    });
    revalidatePath("/dashboard/categories");
}


// merge categories
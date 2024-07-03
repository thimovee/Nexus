"use server"
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations/product";
import { z } from "zod";
import slugify from "slugify";
import { ImageFile } from "@/types";

export async function getExtentedProducts(
) {
    const products = await db.product.findMany({
        include: {
            category: true,
            reviews: true,
            orders: {
                select: {
                    id: true,
                },
            },
        },
        where: {
            isDeleted: false,
        }
    });

    const extentedProducts = products.map((product) => {
        const categoryName = product.category?.name;
        const reviews = product.reviews || [];
        const averageRating = reviews.reduce(
            (total, { rating }) => total + rating,
            0
        ) / reviews.length;
        const orderCount = product.orders.length;

        return {
            ...product,
            category: categoryName,
            rating: averageRating,
            orders: orderCount,
        };
    });

    return extentedProducts;
}

export async function addProduct(input: z.infer<typeof productSchema>) {
    const productWithSameName = await db.product.findFirst({
        where: {
            name: input.name
        }
    });

    if (productWithSameName) {
        throw new Error("A product with this name already exists.");
    }
    const images = input.images as ImageFile[];
    const slug = slugify(input.name, { lower: true, replacement: '-' });
    const { ...otherData } = input;

    const productData = {
        ...otherData,
        slug,
        images: images,
        price: parseFloat(input.price.toString()),
        description: input.description || '',
    };

    await db.product.create({
        data: productData
    });
    revalidatePath("/dashboard/products");
}

export async function deleteProducts(ids: number[]) {
    await db.product.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            isDeleted: true
        }
    });
    revalidatePath("/dashboard/products");
}

export async function undoDeleteProducts(ids: number[]) {
    await db.product.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            isDeleted: false
        }
    });
    revalidatePath("/dashboard/products");
}

export async function updateProduct(input: z.infer<typeof productSchema> & {
    id: number
}) {
    if (typeof input.id !== "number") {
        throw new Error("Invalid input, provide a number.")
    }

    const product = await db.product.findFirst({
        where: {
            id: input.id
        }
    })

    if (!product) {
        throw new Error("Product not found.")
    }
    const price = parseFloat(input.price.toString());
    if (isNaN(price)) {
        throw new Error("Invalid price value");
    }
    const newSlug = slugify(input.name, { lower: true, replacement: '-' });
    const images = input.images as ImageFile[];
    let updateData: Record<string, unknown> = {
        ...input,
        price,
        slug: newSlug
    };

    if (images && images.length > 0) {
        updateData.images = {
            set: images,
        };
    } else {
        delete updateData.images;
    }


    await db.product.update({
        where: {
            id: input.id
        },
        data: updateData
    })
    revalidatePath("/dashboard/products");
}
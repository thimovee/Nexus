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
            brand: true,
            color: true,
            reviews: true,
            orders: {
                select: {
                    id: true,
                },
            },
        },
    });

    const extentedProducts = products.map((product) => {
        const categoryName = product.category?.name;
        const brandName = product.brand?.name;
        const colorName = product.color?.name;
        const colorHex = product.color?.hex;
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
            brand: brandName,
            color: colorName,
            colorHex: colorHex,
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
        price: parseFloat(input.price),
        description: input.description || '',
    };

    await db.product.create({
        data: productData
    });
    revalidatePath("/dashboard/products");
}

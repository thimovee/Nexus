import { userPrivateMetadataSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { type FileWithPath } from "react-dropzone"
import { Category, Product, Tag } from "@prisma/client";
export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>

export type FileWithPreview = FileWithPath & {
    preview: string
}

export type ImageFile = {
    id: string;
    name: string;
    url: string;
};

export type ExtentedCategory = Category & {
    productCount: number;
}

export type ExtentedProduct = Product & {
    category: string;
    rating: number;
    tags: string[];
    brand: string;
    brandIcon: string;
    color: string;
    colorHex: string;
}

import { userPrivateMetadataSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { type FileWithPath } from "react-dropzone"
import { Attribute, AttributeValue, Category, Order, Product } from "@prisma/client";
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

export type ExtendedProduct = Product & {
    category: string;
    rating: number;
    brand: string;
    color: string;
    colorHex: string;
    orders: number;
}

export type ExtendedAttributeGroup = Attribute & {
    attributeValues: AttributeValue[];
    attributeCount: number;
};

export type Customer = {
    id: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
    emailAddresses: {
        emailAddress: string;
    }[];
    createdAt: number;
    lastSignInAt: number;
    role: string;
    privateMetadata: {
        role: UserRole;
    };
};






import EditProductForm from "@/components/forms/EditProduct";
import { db } from "@/lib/db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";




export default async function ProductPage({ params }: { params: { productSlug: string } }) {
    const categories = await db.category.findMany()
    const product = await db.product.findFirst({
        where: {
            slug: params.productSlug,
        },
    });

    if (!product) {
        return notFound();
    }


    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>
                Edit Product
            </h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <Link className='hover:text-primary duration-300' href='/dashboard/categories'>Products</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Edit</span>
            </div>
            <section className='mt-10'>
                <EditProductForm product={product} categories={categories} />
            </section>
        </div>
    );
}
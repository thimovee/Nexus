import EditCategoryForm from "@/components/forms/EditCategory";
import { db } from "@/lib/db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";




export default async function ProductPage({ params }: { params: { categorySlug: string } }) {
    const category = await db.category.findFirst({
        where: {
            slug: params.categorySlug,
        },
    });

    if (!category) {
        return notFound();
    }


    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>
                Edit Category
            </h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <Link className='hover:text-primary duration-300' href='/dashboard/categories'>Categories</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Edit</span>
            </div>
            <section className='mt-10'>
                <EditCategoryForm category={category} />
            </section>
        </div>
    );
}
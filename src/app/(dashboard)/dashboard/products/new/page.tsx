import { getCategories } from "@/app/_actions/category";
import { CreateCategory } from "@/components/forms/CreateCategory";
import { CreateProduct } from "@/components/forms/CreateProduct";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function CreateCategoryPage() {
    const categories = await getCategories();
    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>
                Create Product
            </h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <Link className='hover:text-primary duration-300' href='/dashboard/categories'>Products</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>New</span>
            </div>
            <section className='mt-10'>
                {categories && <CreateProduct categories={categories} />}
            </section>
        </div>
    );
}
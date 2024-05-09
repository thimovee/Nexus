import { CreateCategory } from "@/components/forms/CreateCategory";
import { ChevronRight } from "lucide-react";
import Link from "next/link";




export default async function CreateCategoryPage() {


    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>
                Create Category
            </h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <Link className='hover:text-primary duration-300' href='/dashboard/categories'>Categories</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>New</span>
            </div>
            <section className='mt-10'>
                <CreateCategory />
            </section>
        </div>
    );
}
import { Input } from '@/components/ui/input'
import { ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './data-table'
import { db } from '@/lib/db'
import { columns } from './columns'
import { getCategoriesWithProductCount } from '@/app/_actions/category'

const page = async () => {
    const categories = await getCategoriesWithProductCount()

    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>Categories</h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Categories</span>
            </div>
            <section className='mt-10'>
                <DataTable data={categories} columns={columns} />
            </section>
        </div>
    )
}

export default page
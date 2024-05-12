import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { getExtentedProducts } from '@/app/_actions/product'
import { ExtendedProduct } from '@/types'

const page = async () => {
    const products = await getExtentedProducts() as ExtendedProduct[]

    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>Products</h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Products</span>
            </div>
            <section className='mt-10'>
                <DataTable data={products} columns={columns} />
            </section>
        </div>
    )
}

export default page
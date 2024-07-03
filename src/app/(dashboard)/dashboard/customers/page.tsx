import { clerkClient } from '@clerk/nextjs/server';
import React from 'react'
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { Customer } from '@/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getAllUsers } from '@/app/_actions/users';


const page = async () => {
    const customers = await getAllUsers()
    const allCustomers = await clerkClient.users.getUserList()
    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>Customers</h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Customers</span>
            </div>
            <section className='mt-10'>
                <DataTable data={customers} columns={columns} />
            </section>
        </div>
    )
}

export default page
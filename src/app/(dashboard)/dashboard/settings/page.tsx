import AreaChartComponent from '@/components/ui/AreaChart'
import DonutChart from '@/components/ui/DonutChart'
import { Badge } from '@/components/ui/badge'
import { Box, ChevronRight, LucideDollarSign, Minus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { db } from '@/lib/db'
import { UserProfile } from '@clerk/nextjs'

const page = async () => {
    return (
        <div className='flex flex-col w-full p-6 pb-20 '>
            <h1 className='text-3xl font-semibold'>Settings</h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Settings</span>
            </div>
            <section className='-ml-8 mt-10 max-w-7xl'>
                <UserProfile appearance={{
                    elements: {
                        card: {
                            padding: 'p-4',
                            borderRadius: 'rounded-lg',
                            shadow: 'shadow-md',
                            backgroundColor: 'bg-white',
                        }
                    }
                }} />
            </section>
        </div>
    )
}

export default page
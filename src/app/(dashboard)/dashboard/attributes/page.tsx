import AreaChartComponent from '@/components/ui/AreaChart'
import DonutChart from '@/components/ui/DonutChart'
import { Badge } from '@/components/ui/badge'
import { Box, ChevronRight, LucideDollarSign, Minus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { db } from '@/lib/db'
import { ExtendedAttributeGroup } from '@/types'

const page = async () => {
    const attributes = await db.attribute.findMany({
        include: {
            attributeValues: true
        }
    })
    const attributesWithCount = attributes.map((attribute: ExtendedAttributeGroup) => {
        attribute.attributeCount = attribute.attributeValues.length
        return attribute
    })

    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>Attributes</h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Attributes</span>
            </div>
            <section>
                <DataTable data={attributesWithCount} columns={columns} />
            </section>
        </div>
    )
}

export default page
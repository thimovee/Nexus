import AreaChartComponent from '@/components/ui/AreaChart'
import DonutChart from '@/components/ui/DonutChart'
import { Badge } from '@/components/ui/badge'
import { Box, ChevronRight, LucideDollarSign, Minus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { db } from '@/lib/db'

const page = async () => {
    const orders = await db.order.findMany()
    const data = [
        {
            "month": "Jan",
            "orders": 4000,
        },
        {
            "month": "Feb",
            "orders": 3000,
        },
        {
            "month": "Mar",
            "orders": 2000,
        },
        {
            "month": "Apr",
            "orders": 2780,
        },
        {
            "month": "May",
            "orders": 1890,
        },
        {
            "month": "Jun",
            "orders": 2390,
        },
        {
            "month": "Jul",
            "orders": 3490,
        },
        {
            "month": "Aug",
            "orders": 4100,
        },
        {
            "month": "Sep",
            "orders": 3800,
        },
        {
            "month": "Oct",
            "orders": 3950,
        },
        {
            "month": "Nov",
            "orders": 4400,
        },
        {
            "month": "Dec",
            "orders": 4750,
        }
    ]

    const orderStatuses = [
        {
            "status": "Delivered",
            "orders": 4000,
        },
        {
            "status": "Pending",
            "orders": 3000,
        },
        {
            "status": "Processing",
            "orders": 2000,
        },
        {
            "status": "Cancelled",
            "orders": 2780,
        },
        {
            "status": "Refunded",
            "orders": 1890,
        },
    ]

    const piechartPanel = (
        <>
            <div className="flex flex-col">
                <span className='text-xs font-medium text-primary/50'>Total Orders</span>
                <div className="flex gap-1 items-center">
                    <span>413</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className='text-xs font-medium text-primary/50'>Total Revenue</span>
                <div className="flex gap-1 items-center">
                    <span>$19,102.27</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className='text-xs font-medium text-primary/50'>Average Order Value</span>
                <div className="flex gap-1 items-center">
                    <span>$46.27</span>
                </div>
            </div>
        </>
    )

    return (
        <div className='flex flex-col w-full p-6 '>
            <h1 className='text-3xl font-semibold'>Orders</h1>
            <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                <ChevronRight size={16} />
                <span className='hover:cursor-pointer'>Orders</span>
            </div>
            <section className="my-10 grid grid-cols-3 gap-6">
                <div className=" h-[220px] py-2  bg-gray-100 rounded">
                    <AreaChartComponent data={data} xKey='month' yKeys={['orders']} title='$19,102.27' description='Total Revenue' showLines={false} />
                </div>
                <div className=" h-[220px] py-2  bg-gray-100 rounded">
                    <DonutChart panel={piechartPanel} legend dataKey='orders' nameKey='status' data={orderStatuses} title='Order status' description='Status of all Orders' />
                </div>
                <div className="h-[220px] py-2 flex flex-col gap-2 bg-gray-100 rounded">
                    <div className='grid grid-cols-1 h-full py-2 gap-2 px-4'>
                        <div className='bg-background shadow-sm rounded-md p-4 flex justify-between'>
                            <div className='flex flex-col gap-1 justify-between'>
                                <span className='text-primary/50 text-sm leading-none'>Monthly Order Fulfillment Times</span>
                                <span className='text-3xl font-bold'>
                                    3 hours
                                </span>
                            </div>
                            <Badge className='rounded-md' variant="success">
                                +12,1%
                            </Badge>
                        </div>
                        <div className='bg-background shadow-sm rounded-md p-4 flex justify-between'>
                            <div className='flex flex-col gap-1 justify-between'>
                                <span className='text-primary/50 text-sm leading-none'>Monthly Return Rate</span>
                                <span className='text-3xl font-bold'>
                                    10%
                                </span>
                            </div>
                            <Badge className='rounded-md' variant="destructive">
                                +12,1%
                            </Badge>
                        </div>

                    </div>
                </div>
            </section>
            <section>
                <DataTable data={orders} columns={columns} />
            </section>
        </div>
    )
}

export default page
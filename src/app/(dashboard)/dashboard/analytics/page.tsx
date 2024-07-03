import AreaChartComponent from '@/components/ui/AreaChart'
import DonutChart from '@/components/ui/DonutChart'
import { Badge } from '@/components/ui/badge'
import { Box, ChevronRight, LucideDollarSign, Minus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { db } from '@/lib/db'
import { ExtendedAttributeGroup } from '@/types'
import { Button } from '@/components/ui/button'

const page = async () => {
    return (
        <div className='flex flex-col w-full p-6 '>
            <div className='w-full flex justify-between'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl font-semibold'>Analytics</h1>
                    <div className='font-medium text-primary/75 mt-2 flex gap-1 text-sm items-center'>
                        <Link className='hover:text-primary duration-300' href='/dashboard'>Dashboard</Link>
                        <ChevronRight size={16} />
                        <span className='hover:cursor-pointer'>Analytics</span>
                    </div>
                </div>
                <div className='flex gap-2 h-10'>
                    <Button variant="ghost">Today</Button>
                    <Button variant="ghost">This month</Button>
                    <input type='date' />
                </div>
            </div>
            <section className='flex flex-col gap-10'>
                <div className='grid grid-cols-3'>
                    <div>Total Revenue: Display the total revenue generated within a specified period as a line graph or bar chart.</div>
                    <div>Total Orders: Show the total number of orders placed during the chosen period, using a line graph or bar chart.</div>
                    <div>Average Order Value (AOV): Present the average value of orders as a line graph, allowing admins to track changes over time.</div>
                </div>
                <div>Revenue and Order Trends: Provide line graphs or charts depicting revenue and order trends over time (e.g., daily, weekly, monthly).</div>
                <div className="grid grid-cols-3">
                    <div>Top-Selling Products: Highlight the most popular products by units sold or revenue generated, using a bar chart or table.</div>
                    <div>Sales by Category: Break down sales data by product categories to understand which categories perform best, using a pie chart or bar graph.</div>
                    <div>Revenue Breakdown: Show a pie chart or bar graph illustrating the proportion of revenue generated from different sources (e.g., product sales, shipping fees, etc.).</div>
                </div>
                <div className="grid grid-cols-3">
                    <div>New vs. Returning Customers</div>
                    <div>Customer Retention</div>
                    <div>Customer Acquisition</div>
                </div>
                <div>Fulfillment Performance</div>
                <div className='grid grid-cols-3'>
                    <div>Returns &amp; Refunds</div>
                    <div>Inventory</div>
                    <div>Shipping &amp; Logistics</div>
                </div>
            </section>
        </div>
    )
}

export default page
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { ChevronLeft } from 'lucide-react'

const RequestAccess = ({ }) => {
    return (
        <section className='mx-auto mt-32 flex flex-col justify-center items-center'>
            <h1 className='text-lg md:text-xl xl:text-3xl font-bold'>You don&apos;t have access to this page</h1>
            <p className='text-primary/60'>Please contact an admin to request access.</p>
            <Link className={cn(buttonVariants({ variant: 'cta', size: 'default', className: 'mt-8' }))} href='/'>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Go back to home</Link>
        </section>
    )
}

export default RequestAccess
import React from 'react'

const page = async () => {

    return (
        <div className='grid grid-cols-3 w-full pr-8'>
            <div className='p-6 bg-background flex w-full justify-between rounded-lg border border-slate-200 dark:border-neutral-700'>
                <div className='flex flex-col'>
                    <p className='text-sm text-primary/50'>
                        Total Sales
                    </p>
                    <h2 className='text-3xl font-bold text-primary'> $3,450 </h2>
                </div>
                <div className='px-2 h-6 flex items-center leading-none py-1 rounded-md bg-[#d1fae5] text-[#065f46] font-medium'>
                    +12,1%
                </div>
            </div>
        </div>

    )
}

export default page
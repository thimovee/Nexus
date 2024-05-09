import { Button } from '@/components/ui/button'
import { Bell, Search } from 'lucide-react'
import React, { FC } from 'react'
import { UserAccountNav } from '../UserAccountNav'
import type { User } from "@clerk/nextjs/server"
import { Input } from '@/components/ui/input'

interface DashboardHeaderProps {
    user: User
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ user }) => {
    return (
        <header className='shrink-0 border-b w-full flex justify-between items-center px-6 border-border h-[60px] bg-gray-100/40'>
            <div className='w-1/3 relative'>
                <Search className='absolute text-primary/50 left-3 top-1/2 transform -translate-y-1/2' size={20} />
                <Input placeholder="Search for content, tools, or information..." type="search" className='pl-10 w-full' />
            </div>
            <div className='flex gap-3 items-center'>
                {/* conditionally render the notification amount div */}
                {<Button className='relative' size="icon" variant="subtle">
                    <Bell size={18} />
                    <div className='absolute bg-red-500 text-xs -top-1 -right-1 flex justify-center items-center rounded-full w-[18px] h-[18px] font-semibold text-background '>3</div>
                </Button>}
                <UserAccountNav user={user} />
            </div>
        </header>
    );
}

export default DashboardHeader;
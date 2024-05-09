"use client"
import { cn } from '@/lib/utils'
import { Book, ChevronsRight, HomeIcon, LayoutGridIcon, LineChartIcon, LogOut, MailIcon, PackageIcon, Settings, ShoppingCartIcon, TagIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
const Sidebar = () => {

    const routes = [
        { name: 'products', icon: <PackageIcon className="h-5 w-5" />, },
        { name: 'categories', icon: <LayoutGridIcon className="h-5 w-5" />, },
        { name: 'attributes', icon: <TagIcon className="h-5 w-5" />, },
        { name: 'orders', icon: <ShoppingCartIcon className="h-5 w-5" />, },
        { name: 'customers', icon: <UsersIcon className="h-5 w-5" />, },
        { name: 'analytics', icon: <LineChartIcon className="h-5 w-5" />, },
        { name: 'newsletter', icon: <MailIcon className="h-5 w-5" />, },
        { name: 'blog', icon: <Book className="h-5 w-5" />, },
    ]

    const pathname = usePathname()

    return (
        <aside className="shrink-0 max-h-screen flex flex-col bg-gray-100/40 w-[300px] border-r border-border h-full">
            <Link href="/dashboard" className='border-b flex gap-2 text-black font-semibold items-center border-border h-[60px] pl-4'>
                <ChevronsRight size={24} />
                <span>Nexus</span>
            </Link>
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start gap-2 px-4 text-base font-medium">
                    <Link href="/dashboard" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-primary/50", pathname === "/dashboard" && "bg-cta text-background hover:text-background")}>
                        <HomeIcon className="h-5 w-5" />
                        Home
                    </Link>
                    {routes.map(route => (
                        <Link key={route.name} href={`/dashboard/${route.name}`} className={cn("capitalize last:mt-auto flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-primary/50", pathname === `/dashboard/${route.name}` && "bg-cta text-background hover:text-background")}>
                            {route.icon}
                            {route.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink overflow-auto py-6">
                <div className=" grid items-start px-4 text-base font-medium">
                    <Link href="/settings" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-primary/50", pathname === "/settings" && "bg-cta text-background hover:text-background")}>
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                    <SignOutButton>
                        <button className="hover:cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-primary/50">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { User } from "@clerk/nextjs/server"
import { LogOut, LayoutDashboard, User2 } from 'lucide-react'
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { SignOutButton } from "@clerk/nextjs"

interface UserAccountNavProps {
    user: User | null
}

export function UserAccountNav({ user }: UserAccountNavProps) {
    const email = user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? ""
    const initials = `${user?.firstName?.charAt(0) ?? ""} ${user?.lastName?.charAt(0) ?? ""}`
    const role = user?.privateMetadata.role
    return (
        <>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="ml-2" asChild>
                        <Avatar className="h-9 w-9 cursor-pointer">
                            <AvatarImage src={user.imageUrl} alt={user.username ?? ""} role='img' />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-primary">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="text-primary">
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <User2 className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            {role === "admin" && <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <span className="w-full">
                                <SignOutButton>
                                    <span className="flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Log out
                                    </span>
                                </SignOutButton>
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            ) : (
                <Link className={cn(buttonVariants(), "bg-foreground text-primary-foreground")} href="/sign-in">
                    <span>Sign In</span>
                </Link>
            )
            }
        </>
    )
}
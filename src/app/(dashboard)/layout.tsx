import { currentUser } from "@clerk/nextjs"


export default async function DashboardLayout({ children }: React.PropsWithChildren) {
    const user = await currentUser()
    const userRole = user?.privateMetadata.role
    return (
        <div className="flex flex-col">
            {userRole === "admin" ? (<div className="flex">
                Dashboard
                <main className="flex-grow">
                    <div className='w-full'>{children}</div>
                </main>
            </div>) : "Vraag toegang aan"}
        </div>
    )
} 
import RequestAccess from "@/components/RequestAcces"
import DashboardHeader from "@/components/navigation/dashboard/DashboardHeader"
import Sidebar from "@/components/navigation/dashboard/Sidebar"
import { currentUser } from "@clerk/nextjs"


export default async function DashboardLayout({ children }: React.PropsWithChildren) {
    const user = await currentUser()
    const userRole = user?.privateMetadata.role
    return (
        <>
            {userRole === "admin" ? (<div className="grid min-h-screen w-full grid-cols-[300px_1fr]">
                <Sidebar />
                <div className="flex-grow flex-col">
                    <DashboardHeader user={user!} />
                    <main className='w-full'>{children}</main>
                </div>
            </div>) : <RequestAccess />}
        </>
    )
} 
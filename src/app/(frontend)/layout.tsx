import { currentUser } from "@clerk/nextjs"

export default async function StoreLayout({ children }: React.PropsWithChildren) {
    const user = await currentUser()

    return (
        <div className="flex flex-col">
            Storesheader
            <main>{children}</main>
        </div>
    )
}

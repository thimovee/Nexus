import { ChevronsRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AuthLayout({ children }: React.PropsWithChildren) {

    return (
        <main className="min-h-screen flex w-full">
            <Link href="/" className="absolute left-8 top-6 z-20 flex items-center text-lg text-white font-bold tracking-tight" >
                <ChevronsRight className="mr-2 h-6 w-6" aria-hidden="true" />
                <span>NEXUS</span>
            </Link>
            <div className="w-1/2 h-screen  relative">
                <Image quality={0} fill className="object-cover" src="https://images.unsplash.com/photo-1581091595283-04de15a05a01?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Authentication screen image" />
                <div className="bg-black/50 h-full w-full absolute top-0 left-0" />
            </div>
            <section className="h-screen w-1/2 flex justify-center items-center">{children}</section>
        </main>
    )
}

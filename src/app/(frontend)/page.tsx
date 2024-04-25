import { Badge } from "@/components/ui/badge"
import { SignOutButton, currentUser } from "@clerk/nextjs"


export default async function Home() {
  const user = await currentUser()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Homepage
      <Badge variant="success">
        +12,1%
      </Badge>
      <Badge variant="destructive">
        -12,1%
      </Badge>
      {user && (
        <pre>
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
      <SignOutButton>
        Sign Out
      </SignOutButton>
    </main>
  )
}

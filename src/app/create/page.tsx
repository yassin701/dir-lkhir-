"use client"

import { Navbar } from "@/components/ui/navbar"
import { useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import CreateNeedForm from "@/components/needs/create-need-form"

export default function CreateHelpRequestPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const isLoggedIn = !!session

  useEffect(() => {
    if (!isPending && !isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, isPending, router])

  if (isPending) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />
      <main className="flex flex-1 items-start justify-center px-4 py-12">
        <CreateNeedForm />
      </main>
    </div>
  )
}

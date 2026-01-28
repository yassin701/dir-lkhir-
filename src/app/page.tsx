"use client"

import { Navbar } from "@/components/ui/navbar"
import { HelpRequestCard } from "@/components/ui/help-request-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

const helpRequests = [
  {
    title: "Need help moving furniture",
    city: "Casablanca",
    description: "Looking for someone to help move some heavy furniture from my apartment to a new location. Would need about 2-3 hours of help.",
  },
  {
    title: "Tutoring for high school math",
    city: "Rabat",
    description: "Seeking a tutor to help my daughter with algebra and geometry. Preferably someone with teaching experience.",
  },
  {
    title: "Grocery shopping assistance",
    city: "Marrakech",
    description: "Elderly person looking for help with weekly grocery shopping. I can provide a list and payment for groceries.",
  },
  {
    title: "Car repair advice needed",
    city: "Fes",
    description: "My car is making strange noises. Looking for someone knowledgeable about car mechanics to diagnose the issue.",
  },
  {
    title: "Translation help needed",
    city: "Tangier",
    description: "Need help translating official documents from Arabic to French for administrative purposes.",
  },
  {
    title: "Computer setup assistance",
    city: "Agadir",
    description: "Just bought a new computer and need help setting it up, installing software, and transferring files from my old device.",
  },
]

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const isLoggedIn = !!session

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push("/create")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Dir-Khir
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
                A community platform where neighbors help neighbors. Request assistance or offer your skills to make a difference in someone&apos;s life.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2" onClick={handleCreateClick}>
                  Create Help Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {!isLoggedIn && (
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login / Register
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Help Requests Grid */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Open Requests</h2>
              <p className="mt-1 text-muted-foreground">People in your community who need help</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {helpRequests.map((request, index) => (
              <HelpRequestCard
                key={index}
                title={request.title}
                city={request.city}
                description={request.description}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Dir-Khir. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Building stronger communities together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

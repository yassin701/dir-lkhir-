import { db } from "@/db"
import { needs } from "@/db/schema"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getServerSession } from "@/lib/auth/get-session"
import NeedCard from "@/components/needs/need-card"
import { EmptyNeeds } from "@/components/empty-states"

const moroccanCities = [
  "Tangier",
  "Tetouan",
  "Fez",
  "Meknes",
  "Rabat",
  "Casablanca",
  "Marrakech",
  "Agadir",
  "Essaouira",
  "Laayoune",
]

const categories = [
  { value: "education", label: "📚 Education" },
  { value: "cleaning", label: "🧹 Cleaning" },
  { value: "financial", label: "💰 Financial" },
  { value: "health", label: "❤️ Health" },
  { value: "food", label: "🍴 Food" },
  { value: "other", label: "🤝 Other" },
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>
}) {
  const session = await getServerSession()
  const params = await searchParams

  // Fetch needs from database
  let allNeeds = await db.query.needs.findMany({
    with: {
      author: true,
      volunteers: true,
    },
    orderBy: (needs, { desc }) => [desc(needs.createdAt)],
  })

  // Filter by city if provided
  if (params.city) {
    allNeeds = allNeeds.filter(
      (need) => need.city.toLowerCase() === params.city!.toLowerCase()
    )
  }

  // Filter by category if provided
  if (params.category) {
    allNeeds = allNeeds.filter((need) => need.category === params.category)
  }

  // Filter unresolved needs
  const activeNeeds = allNeeds.filter((need) => !need.isResolved)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-2 border-primary/15 bg-linear-to-b from-primary/8 via-secondary/5 to-transparent px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-primary">
            L'entraide de quartier
          </h1>
          <p className="mt-3 text-xl font-semibold text-secondary">
            De Tanger à Lagouira 🤝
          </p>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Coordonnez l'aide de proximité dans vos quartiers. Publiez un besoin ou aidez quelqu'un d'autre.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link href={session ? "/proposer-un-besoin" : "/register"}>
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl">
                Publier un besoin <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            {session && (
              <Link href="/mon-espace">
                <Button size="lg" variant="outline" className="gap-2 border-2">
                  Mon Espace
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Stats */}
          <div className="mb-12 grid gap-5 sm:grid-cols-3">
            <Card className="border-primary/20 hover:border-primary/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wider">Besoins actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{activeNeeds.length}</div>
                <p className="text-sm text-secondary font-semibold mt-1">Demandes en attente</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-secondary uppercase tracking-wider">Volontaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary">
                  {activeNeeds.reduce((sum, n) => sum + n.volunteerCount, 0)}
                </div>
                <p className="text-sm text-primary font-semibold mt-1">Personnes qui aident</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:border-accent/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-accent uppercase tracking-wider">Résolus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allNeeds.filter((n) => n.isResolved).length}
                </div>
                <p className="text-xs text-muted-foreground">Besoins complétés</p>
              </CardContent>
            </Card>
          </div>

          {/* Needs Grid */}
          {activeNeeds.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {activeNeeds.map((need) => (
                <NeedCard key={need.id} need={need} session={session} />
              ))}
            </div>
          ) : (
            <EmptyNeeds />
          )}
        </div>
      </section>
    </div>
  )
}

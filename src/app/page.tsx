import { db } from "@/db"
import { needs } from "@/db/schema"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, MapPin, Users, Target, Filter } from "lucide-react"
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
  { value: "financial", label: "💰 Financial Aid" },
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50 pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              نشط عبر المغرب
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 via-amber-800 to-emerald-700 bg-clip-text text-transparent">
              Connectez-vous & Aidez Ensemble
            </h1>
            
            <p className="text-xl text-emerald-700 max-w-2xl mx-auto leading-relaxed">
              Une plateforme communautaire où les voisins s'entraident. Partagez des besoins, offrez de l'aide, et faites la différence dans votre communauté.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href={session ? "/create" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-3 bg-gradient-to-r from-emerald-700 to-amber-600 hover:from-emerald-800 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all">
                  <span>Partager un Besoin</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              {session && (
                <Link href="/mon-espace" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-emerald-900">
                    <Target className="h-5 w-5" />
                    Tableau de Bord
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Besoins Actifs</p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">{activeNeeds.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-sm text-emerald-700 mt-3">Demandes en attente d'aide</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Volontaires</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">
                      {activeNeeds.reduce((sum, n) => sum + (n.volunteers?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-sm text-amber-700 mt-3">Gens aidant les autres</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Résolus</p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">
                      {allNeeds.filter((n) => n.isResolved).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-emerald-700 mt-3">Terminés avec succès</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Filters */}
      {(params.city || params.category) && (
        <section className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              <div className="flex gap-2">
                {params.city && (
                  <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-800">
                    <MapPin className="h-3 w-3" />
                    {params.city}
                  </Badge>
                )}
                {params.category && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {categories.find(c => c.value === params.category)?.label || params.category}
                  </Badge>
                )}
              </div>
              <Link 
                href="/" 
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Needs Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Needs</h2>
                <p className="text-gray-600 mt-2">Browse requests from your community</p>
              </div>
              {activeNeeds.length > 0 && (
                <span className="text-sm font-medium text-gray-500">
                  {activeNeeds.length} {activeNeeds.length === 1 ? 'request' : 'requests'} found
                </span>
              )}
            </div>
          </div>

          {activeNeeds.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
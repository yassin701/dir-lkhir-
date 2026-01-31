import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "@/lib/auth/get-session";
import { db } from "@/db";
import { needs, needVolunteers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Users, CheckCircle, Calendar } from "lucide-react";
import DashboardActions from "@/components/dashboard/dashboard-actions";
import { EmptyMyNeeds, EmptyVolunteer } from "@/components/empty-states";
import { Plus } from "lucide-react";
export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user's created needs
  const userNeeds = await db.query.needs.findMany({
    where: eq(needs.userId, session.user.id),
    with: {
      volunteers: true,
      author: true,
    },
    orderBy: (needs, { desc }) => [desc(needs.createdAt)],
  });

  // Get needs where user volunteered
  const volunteeredNeedIds = await db.query.needVolunteers.findMany({
    where: eq(needVolunteers.userId, session.user.id),
  });

  const volunteeredNeeds = await Promise.all(
    volunteeredNeedIds.map((v) =>
      db.query.needs.findFirst({
        where: eq(needs.id, v.needId),
        with: {
          author: true,
          volunteers: true,
        },
      })
    )
  );

  const activeVolunteeredNeeds = volunteeredNeeds.filter(
    (n) => n && !n.isResolved
  );
  const resolvedVolunteeredNeeds = volunteeredNeeds.filter((n) => n && n.isResolved);

  const activeUserNeeds = userNeeds.filter((n) => !n.isResolved);
  const resolvedUserNeeds = userNeeds.filter((n) => n.isResolved);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">My Dashboard</h1>
              <p className="text-lg text-gray-600 mt-2">Welcome back, {session.user.name}! 👋</p>
            </div>
            <Link href="/create-need">
              <Button size="lg" className="gap-2 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="h-5 w-5" />
                New Need
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">My Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-gray-900">{activeUserNeeds.length}</div>
                  <span className="text-sm text-gray-500">active</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Needs you've created</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">My Commitments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-gray-900">{activeVolunteeredNeeds.length}</div>
                  <span className="text-sm text-gray-500">active</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Needs you're helping with</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {resolvedUserNeeds.length + resolvedVolunteeredNeeds.length}
                  </div>
                  <span className="text-sm text-gray-500">total</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Successfully resolved</p>
              </CardContent>
            </Card>
          </div>

          {/* My Requests */}
          <section className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
                  <p className="text-gray-600 mt-1">Needs I've published</p>
                </div>
              </div>
            </div>

            {activeUserNeeds.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeUserNeeds.map((need) => (
                  <Card key={need.id} className="group hover:shadow-lg transition-all duration-300 border hover:border-blue-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {need.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <CardDescription className="text-sm font-medium text-gray-700">
                              {need.city}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {need.category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {need.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {need.volunteers.length} volunteer{need.volunteers.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <DashboardActions needId={need.id} isOwner={true} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyMyNeeds />
            )}
          </section>

          {/* My Volunteering */}
          <section className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-green-600 rounded-full"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Commitments</h2>
                  <p className="text-gray-600 mt-1">Needs I'm participating in</p>
                </div>
              </div>
            </div>

            {activeVolunteeredNeeds.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeVolunteeredNeeds.map((need) => (
                  <Card key={need?.id} className="group hover:shadow-lg transition-all duration-300 border hover:border-green-200">
                    <CardHeader className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            {need?.title}
                          </CardTitle>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {need?.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Posted by {need?.author?.name}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {need?.description}
                      </p>

                      <div className="pt-4 border-t">
                        <DashboardActions needId={need?.id || ""} isOwner={false} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyVolunteer />
            )}
          </section>

          {/* Completed Tasks */}
          {(resolvedUserNeeds.length > 0 || resolvedVolunteeredNeeds.length > 0) && (
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Completed Tasks</h2>
                    <p className="text-gray-600 mt-1">Successfully resolved needs</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {resolvedUserNeeds.map((need) => (
                  <Card key={need.id} className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              ✓ Resolved
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {need.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{need.title}</h3>
                          <p className="text-sm text-gray-600">
                            Helped by {need.volunteers.length} volunteer{need.volunteers.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {resolvedVolunteeredNeeds.map((need) => (
                  <Card key={need?.id} className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-gray-300 text-gray-700">
                              ✓ Completed
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{need?.title}</h3>
                          <p className="text-sm text-gray-600">
                            Posted by {need?.author?.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
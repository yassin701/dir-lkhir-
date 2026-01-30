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
import { MapPin, Users, Trash2 } from "lucide-react";
import DashboardActions from "@/components/dashboard/dashboard-actions";
import { EmptyMyNeeds, EmptyVolunteer } from "@/components/empty-states";

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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b-2 border-primary/10 pb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary">Mon Espace</h1>
              <p className="text-lg text-secondary font-semibold mt-2">Bienvenue, {session.user.name}! 👋</p>
            </div>
            <Link href="/proposer-un-besoin">
              <Button size="lg" className="gap-2 shadow-lg">+ Nouveau besoin</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-3">
            <Card className="border-primary/20 hover:border-primary/40 bg-linear-to-br from-primary/8 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Mes demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{activeUserNeeds.length}</div>
                <p className="text-sm text-secondary font-semibold mt-1">Demandes actives</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary/40 bg-linear-to-br from-secondary/8 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-secondary">Mes engagements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary">{activeVolunteeredNeeds.length}</div>
                <p className="text-sm text-primary font-semibold mt-1">Besoins où j'aide</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:border-accent/40 bg-linear-to-br from-accent/8 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-accent">Complétés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-accent">
                  {resolvedUserNeeds.length + resolvedVolunteeredNeeds.length}
                </div>
                <p className="text-sm text-primary font-semibold mt-1">Tâches résolues</p>
              </CardContent>
            </Card>
          </div>

          {/* My Requests */}
          <div className="space-y-6">
            <div className="border-b-2 border-primary/10 pb-4">
              <h2 className="text-3xl font-bold text-primary">Mes demandes</h2>
              <p className="text-secondary font-semibold mt-2">Les besoins que j'ai publié</p>
            </div>

            {activeUserNeeds.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeUserNeeds.map((need) => (
                  <Card key={need.id} className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all">
                    <CardHeader className="bg-linear-to-r from-primary/5 to-secondary/5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2 text-lg text-primary">{need.title}</CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2 text-secondary font-semibold">
                            <MapPin className="h-4 w-4" />
                            {need.city}
                          </CardDescription>
                        </div>
                        <Badge variant="default">{need.category}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {need.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <Users className="h-4 w-4" />
                        <span>{need.volunteers.length} volontaire{need.volunteers.length !== 1 ? 's' : ''}</span>
                      </div>

                      <DashboardActions needId={need.id} isOwner={true} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyMyNeeds />
            )}
          </div>

          {/* My Volunteering */}
          <div className="space-y-6">
            <div className="border-b-2 border-secondary/10 pb-4">
              <h2 className="text-3xl font-bold text-secondary">Mes engagements</h2>
              <p className="text-primary font-semibold mt-2">Les besoins auxquels je participe</p>
            </div>

            {activeVolunteeredNeeds.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeVolunteeredNeeds.map((need) => (
                  <Card key={need?.id} className="overflow-hidden border-secondary/20 hover:border-secondary/40 transition-all">
                    <CardHeader className="bg-linear-to-r from-secondary/5 to-primary/5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2 text-lg text-secondary">{need?.title}</CardTitle>
                          <CardDescription className="mt-2 text-primary font-semibold">
                            Publié par {need?.author?.name}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{need?.category}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {need?.description}
                      </p>

                      <DashboardActions needId={need?.id || ""} isOwner={false} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyVolunteer />
            )}
          </div>

          {/* Resolved Requests */}
          {(resolvedUserNeeds.length > 0 || resolvedVolunteeredNeeds.length > 0) && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-accent border-b-2 border-accent/10 pb-4">✓ Complétés</h2>

              {resolvedUserNeeds.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-primary uppercase tracking-wider">Mes demandes résolues</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {resolvedUserNeeds.map((need) => (
                      <Card key={need.id} className="opacity-75">
                        <CardContent className="pt-6">
                          <Badge variant="outline" className="mb-2">
                            ✓ Résolu
                          </Badge>
                          <h3 className="font-semibold">{need.title}</h3>
                          <p className="text-xs text-muted-foreground">{need.volunteers.length} volontaires</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {resolvedVolunteeredNeeds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Mes engagements résolus</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {resolvedVolunteeredNeeds.map((need) => (
                      <Card key={need?.id} className="opacity-75">
                        <CardContent className="pt-6">
                          <Badge variant="outline" className="mb-2">
                            ✓ Résolu
                          </Badge>
                          <h3 className="font-semibold">{need?.title}</h3>
                          <p className="text-xs text-muted-foreground">Publié par {need?.author?.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

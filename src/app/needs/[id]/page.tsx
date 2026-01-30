import { db } from "@/db";
import { needs, needVolunteers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "@/lib/auth/get-session";
import { MapPin, Users, Phone, Calendar, User } from "lucide-react";
import Link from "next/link";
import NeedDetailActionsWrapper from "@/components/needs/need-detail-actions-wrapper";
import ShareNeedButton from "@/components/needs/share-need-button";

export default async function NeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession();

  const need = await db.query.needs.findFirst({
    where: eq(needs.id, id),
    with: {
      author: true,
      volunteers: {
        with: {
          volunteer: true,
        },
      },
    },
  });

  if (!need) {
    notFound();
  }

  const hasVolunteered = session?.user?.id
    ? need.volunteers.some((v) => v.userId === session.user.id)
    : false;

  const isOwner = session?.user?.id === need.userId;

  const categoryEmojis: Record<string, string> = {
    education: "📚",
    cleaning: "🧹",
    financial: "💰",
    health: "❤️",
    food: "🍴",
    other: "🤝",
  };

  const categoryLabels: Record<string, string> = {
    education: "Éducation",
    cleaning: "Nettoyage",
    financial: "Aide financière",
    health: "Santé",
    food: "Nourriture",
    other: "Autre",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex text-primary hover:opacity-75 font-semibold transition-opacity gap-1">
            ← Retour à la liste
          </Link>

          {/* Main Card */}
          <Card className="overflow-hidden border-primary/15 shadow-xl">
            {/* Header */}
            <div className="bg-linear-to-br from-primary/12 via-secondary/8 to-transparent px-8 py-10 border-b-2 border-primary/10">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">
                      {need.title}
                    </h1>
                    <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{need.description}</p>
                  </div>
                  {need.isResolved && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">✓ Résolu</Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="outline" className="gap-2 px-3 py-1 border-primary/30">
                    <MapPin className="h-4 w-4" />
                    {need.city}
                  </Badge>
                  <Badge variant="secondary" className="gap-2 px-3 py-1">
                    {categoryEmojis[need.category]} {categoryLabels[need.category]}
                  </Badge>
                  <Badge variant="outline" className="gap-2 px-3 py-1 border-primary/30">
                    <Calendar className="h-4 w-4" />
                    {new Date(need.createdAt).toLocaleDateString("fr-FR")}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 p-6">
              {/* Author Card */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{need.author.name}</p>
                      <p className="text-sm text-muted-foreground">Publié par l'auteur</p>
                    </div>
                  </div>

                  {need.phoneWhatsApp && (
                    <a
                      href={`https://wa.me/${need.phoneWhatsApp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4" />
                      Contacter sur WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Volunteers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Volontaires qui aident</h3>
                  </div>
                </div>

                {need.volunteers.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {need.volunteers.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{v.volunteer.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                    Aucun volontaire pour l'instant. Soyez le premier !
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 border-t pt-6">
                <NeedDetailActionsWrapper
                  needId={need.id}
                  isOwner={isOwner}
                  hasVolunteered={hasVolunteered}
                  isResolved={need.isResolved}
                  session={session}
                  volunteerCount={need.volunteers.length}
                />

                {/* Share Button */}
                <ShareNeedButton url={`${process.env.NEXT_PUBLIC_APP_URL}/needs/${need.id}`} />
              </div>
            </CardContent>
          </Card>

          {/* Similar Needs */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Autres besoins</h2>
            <p className="text-muted-foreground">Découvrez d'autres besoins similaires</p>
          </div>
        </div>
      </main>
    </div>
  );
}

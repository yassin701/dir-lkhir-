"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Phone } from "lucide-react";
import { Need } from "@/db/schema";
import { volunteerForNeed, unvolunteerForNeed } from "@/lib/actions/needs";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface NeedCardProps {
  need: Need & {
    author: any;
    volunteers: any[];
  };
  session: any;
}

export default function NeedCard({ need, session }: NeedCardProps) {
  const [isPending, startTransition] = useTransition();
  const hasVolunteered = session?.user?.id
    ? need.volunteers.some((v) => v.userId === session.user.id)
    : false;

  const handleVolunteer = () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    startTransition(async () => {
      const result = hasVolunteered
        ? await unvolunteerForNeed(need.id)
        : await volunteerForNeed(need.id);

      if (result.success) {
        toast.success(
          hasVolunteered ? "Vous avez retiré votre engagement" : "Merci pour votre aide!"
        );
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  const categoryEmojis: Record<string, string> = {
    education: "📚",
    cleaning: "🧹",
    financial: "💰",
    health: "❤️",
    food: "🍴",
    other: "🤝",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:border-primary/30 border-primary/10">
      <Link href={`/needs/${need.id}`}>
        <CardHeader className="pb-3 hover:bg-primary/5 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="line-clamp-2 text-xl text-primary">{need.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2 text-secondary font-semibold">
                <MapPin className="h-4 w-4" />
                {need.city}
              </CardDescription>
            </div>
            <Badge variant="default" className="shrink-0">
              {categoryEmojis[need.category] || "🤝"}
            </Badge>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{need.description}</p>

        {/* Author Info */}
        <div className="rounded-lg bg-linear-to-r from-primary/8 to-secondary/8 border border-primary/15 p-3 text-sm">
          <p className="font-medium">{need.author?.name}</p>
          {need.phoneWhatsApp && (
            <div className="mt-2">
              <a
                href={`https://wa.me/${need.phoneWhatsApp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
              >
                <Phone className="h-3 w-3" />
                WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {need.volunteerCount} {need.volunteerCount === 1 ? "personne" : "personnes"} aident
          </span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleVolunteer}
          disabled={isPending}
          variant={hasVolunteered ? "outline" : "default"}
          className="w-full"
        >
          {isPending ? "Chargement..." : hasVolunteered ? "Retirer mon engagement" : "Je participe"}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Search, Zap } from "lucide-react";

export function EmptyNeeds() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 py-12 px-6 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-3">
        <Heart className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">Aucun besoin pour le moment</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Soyez le premier à proposer un besoin à votre communauté
      </p>
      <Link href="/proposer-un-besoin">
        <Button className="mt-4">Proposer un besoin</Button>
      </Link>
    </div>
  );
}

export function EmptyMyNeeds() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 py-12 px-6 text-center">
      <div className="mb-4 rounded-full bg-secondary/10 p-3">
        <Zap className="h-6 w-6 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold">Vous n'avez pas encore de besoins</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Proposez un besoin pour que les volontaires vous aident
      </p>
      <Link href="/proposer-un-besoin">
        <Button className="mt-4">Créer un besoin</Button>
      </Link>
    </div>
  );
}

export function EmptyVolunteer() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 py-12 px-6 text-center">
      <div className="mb-4 rounded-full bg-accent/10 p-3">
        <Search className="h-6 w-6 text-accent" />
      </div>
      <h3 className="text-lg font-semibold">Vous n'aidez nulle part pour le moment</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Explorez les besoins de votre communauté et aidez où vous pouvez
      </p>
      <Link href="/">
        <Button className="mt-4">Voir tous les besoins</Button>
      </Link>
    </div>
  );
}

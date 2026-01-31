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
      <h3 className="text-lg font-semibold">No needs at the moment</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Be the first to propose a need to your community
      </p>
      <Link href="/create">
        <Button className="mt-4">Propose a Need</Button>
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
      <h3 className="text-lg font-semibold">You haven't created any needs yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Propose a need so volunteers can help you
      </p>
      <Link href="/create">
        <Button className="mt-4">Create a Need</Button>
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
      <h3 className="text-lg font-semibold">You're not helping anywhere right now</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Explore your community's needs and help where you can
      </p>
      <Link href="/">
        <Button className="mt-4">View All Needs</Button>
      </Link>
    </div>
  );
}

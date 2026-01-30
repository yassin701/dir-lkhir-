"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";

interface VolunteerInfo {
  id: string;
  userId: string;
  volunteer: {
    id: string;
    name: string;
  };
}

interface VolunteersListProps {
  initialVolunteers: VolunteerInfo[];
}

export default function VolunteersList({ initialVolunteers }: VolunteersListProps) {
  const [volunteers, setVolunteers] = useState(initialVolunteers);

  // Expose method to update volunteers list from parent
  const updateVolunteers = (newVolunteers: VolunteerInfo[]) => {
    setVolunteers(newVolunteers);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Volontaires</h3>
        </div>
        <Badge variant="secondary">{volunteers.length}</Badge>
      </div>

      {volunteers.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {volunteers.map((v) => (
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
  );
}

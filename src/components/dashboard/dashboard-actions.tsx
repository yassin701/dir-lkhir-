"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { unvolunteerForNeed, resolveNeed, deleteNeed } from "@/lib/actions/needs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DashboardActionsProps {
  needId: string;
  isOwner: boolean;
}

export default function DashboardActions({ needId, isOwner }: DashboardActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveVolunteer = async () => {
    setIsLoading(true);
    try {
      const result = await unvolunteerForNeed(needId);
      if (result.success) {
        toast.success("Engagement retiré");
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!confirm("Êtes-vous sûr que ce besoin est résolu ?")) return;

    setIsLoading(true);
    try {
      const result = await resolveNeed(needId);
      if (result.success) {
        toast.success("Besoin marqué comme résolu");
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr ? Cette action ne peut pas être annulée.")) return;

    setIsLoading(true);
    try {
      const result = await deleteNeed(needId);
      if (result.success) {
        toast.success("Besoin supprimé");
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {isOwner ? (
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={handleResolve}
            className="flex-1"
          >
            Marquer comme résolu
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={handleRemoveVolunteer}
          className="w-full"
        >
          Retirer mon engagement
        </Button>
      )}
    </div>
  );
}

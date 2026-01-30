"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { volunteerForNeed, unvolunteerForNeed, resolveNeed, deleteNeed } from "@/lib/actions/needs";
import { ThumbsUp, Trash2, CheckCircle } from "lucide-react";

interface NeedDetailActionsProps {
  needId: string;
  isOwner: boolean;
  hasVolunteered: boolean;
  isResolved: boolean;
  session: any;
  onVolunteerChange?: (newCount: number, hasVolunteered: boolean) => void;
  volunteerCount?: number;
}

export default function NeedDetailActions({
  needId,
  isOwner,
  hasVolunteered: initialHasVolunteered,
  isResolved,
  session,
  onVolunteerChange,
  volunteerCount = 0,
}: NeedDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [hasVolunteered, setHasVolunteered] = useState(initialHasVolunteered);
  const [localVolunteerCount, setLocalVolunteerCount] = useState(volunteerCount);

  const handleVolunteer = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      // Optimistic update
      setHasVolunteered(true);
      const newCount = localVolunteerCount + 1;
      setLocalVolunteerCount(newCount);
      onVolunteerChange?.(newCount, true);

      const result = await volunteerForNeed(needId);
      if (result.success) {
        toast.success("Vous participez maintenant à ce besoin !");
        // No need to refresh - UI already updated
      } else {
        // Revert optimistic update on error
        setHasVolunteered(false);
        setLocalVolunteerCount(localVolunteerCount);
        onVolunteerChange?.(localVolunteerCount, false);
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleUnvolunteer = () => {
    startTransition(async () => {
      // Optimistic update
      setHasVolunteered(false);
      const newCount = Math.max(0, localVolunteerCount - 1);
      setLocalVolunteerCount(newCount);
      onVolunteerChange?.(newCount, false);

      const result = await unvolunteerForNeed(needId);
      if (result.success) {
        toast.success("Votre engagement a été retiré");
        // No need to refresh - UI already updated
      } else {
        // Revert optimistic update on error
        setHasVolunteered(true);
        setLocalVolunteerCount(localVolunteerCount);
        onVolunteerChange?.(localVolunteerCount, true);
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleResolve = () => {
    startTransition(async () => {
      const result = await resolveNeed(needId);
      if (result.success) {
        toast.success("Ce besoin a été marqué comme résolu !");
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteNeed(needId);
      if (result.success) {
        toast.success("Besoin supprimé");
        router.push("/");
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  if (isResolved && !isOwner) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
        Ce besoin a déjà été résolu. Merci aux volontaires !
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Volunteer Button */}
        {!isOwner && (
          <Button
            size="lg"
            className="flex-1 gap-2"
            disabled={isPending || isResolved}
            onClick={hasVolunteered ? handleUnvolunteer : handleVolunteer}
          >
            <ThumbsUp className="h-4 w-4" />
            {hasVolunteered ? "Retirer mon engagement" : "Je participe"}
          </Button>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <>
            {!isResolved && (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                disabled={isPending}
                onClick={() => setShowResolveDialog(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Marquer comme résolu
              </Button>
            )}

            <Button
              size="lg"
              variant="destructive"
              className="flex-1 gap-2"
              disabled={isPending}
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </>
        )}
      </div>

      {/* Resolve Dialog */}
      {showResolveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Marquer comme résolu ?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vous pouvez toujours revenir et modifier votre besoin plus tard.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResolveDialog(false)}
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleResolve();
                  setShowResolveDialog(false);
                }}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Supprimer ce besoin ?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cette action est irréversible. Tous les engagements des volontaires seront perdus.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteDialog(false);
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

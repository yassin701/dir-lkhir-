"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { volunteerForNeed, unvolunteerForNeed, resolveNeed, deleteNeed } from "@/lib/actions/needs";
import { ThumbsUp, Trash2, CheckCircle, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VolunteerInfo {
  id: string;
  userId: string;
  volunteer: {
    id: string;
    name: string;
  };
}

interface NeedDetailActionsWrapperProps {
  needId: string;
  isOwner: boolean;
  hasVolunteered: boolean;
  isResolved: boolean;
  session: any;
  volunteerCount: number;
  initialVolunteers?: VolunteerInfo[];
  userId?: string;
}

export default function NeedDetailActionsWrapper({
  needId,
  isOwner,
  hasVolunteered: initialHasVolunteered,
  isResolved,
  session,
  volunteerCount: initialVolunteerCount,
  initialVolunteers = [],
  userId,
}: NeedDetailActionsWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [hasVolunteered, setHasVolunteered] = useState(initialHasVolunteered);
  const [volunteerCount, setVolunteerCount] = useState(initialVolunteerCount);

  const handleVolunteer = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      // Optimistic update
      setHasVolunteered(true);
      const newCount = volunteerCount + 1;
      setVolunteerCount(newCount);

      const result = await volunteerForNeed(needId);
      if (result.success) {
        toast.success("You are now participating in this need! 🎉");
        // No need to refresh - UI already updated
      } else {
        // Revert optimistic update on error
        setHasVolunteered(false);
        setVolunteerCount(volunteerCount);
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleUnvolunteer = () => {
    startTransition(async () => {
      // Optimistic update
      setHasVolunteered(false);
      const newCount = Math.max(0, volunteerCount - 1);
      setVolunteerCount(newCount);

      const result = await unvolunteerForNeed(needId);
      if (result.success) {
        toast.success("Votre engagement a été retiré");
        // No need to refresh - UI already updated
      } else {
        // Revert optimistic update on error
        setHasVolunteered(true);
        setVolunteerCount(volunteerCount);
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleResolve = () => {
    startTransition(async () => {
      const result = await resolveNeed(needId);
      if (result.success) {
        toast.success("This need has been marked as resolved!");
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
        toast.success("Need deleted");
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
      {/* Volunteer Count Display Section */}
      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Volunteers</h3>
          </div>
          <Badge variant="secondary" className="animate-pulse-soft">
            {volunteerCount} {volunteerCount === 1 ? "personne" : "personnes"}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Volunteer Button */}
        {!isOwner && (
          <Button
            size="lg"
            className="flex-1 gap-2"
            disabled={isPending || isResolved}
            onClick={hasVolunteered ? handleUnvolunteer : handleVolunteer}
            variant={hasVolunteered ? "secondary" : "default"}
          >
            <ThumbsUp className="h-4 w-4" />
            {hasVolunteered ? "Se retirer" : "Je peux aider"}
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
                onClick={handleResolve}
              >
                <CheckCircle className="h-4 w-4" />
                Mark Resolved
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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this need? This action is irreversible.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDelete();
                  setShowDeleteDialog(false);
                }}
                disabled={isPending}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Confirmation Dialog */}
      {showResolveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Mark as Resolved</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Confirm that this need has been resolved?
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowResolveDialog(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  handleResolve();
                  setShowResolveDialog(false);
                }}
                disabled={isPending}
              >
                Yes, it's resolved
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { unvolunteerForNeed, resolveNeed, deleteNeed } from "@/lib/actions/needs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface DashboardActionsProps {
  needId: string;
  isOwner: boolean;
}

export default function DashboardActions({ needId, isOwner }: DashboardActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"resolve" | "delete" | "remove" | null>(null);

  const handleRemoveVolunteer = async () => {
    if (!confirm("Are you sure you want to withdraw from this need?")) return;
    
    setIsLoading(true);
    setActionType("remove");
    try {
      const result = await unvolunteerForNeed(needId);
      if (result.success) {
        toast.success("You have been removed from this need");
        router.refresh();
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch {
      toast.error("Failed to update your commitment");
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const handleResolve = async () => {
    if (!confirm("Mark this need as resolved? This will close it to new volunteers.")) return;

    setIsLoading(true);
    setActionType("resolve");
    try {
      const result = await resolveNeed(needId);
      if (result.success) {
        toast.success("Need marked as resolved");
        router.refresh();
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch {
      toast.error("Failed to resolve need");
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone and will permanently delete this need.")) return;

    setIsLoading(true);
    setActionType("delete");
    try {
      const result = await deleteNeed(needId);
      if (result.success) {
        toast.success("Need deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch {
      toast.error("Failed to delete need");
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <div className="flex gap-3">
      {isOwner ? (
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={handleResolve}
            className="flex-1 gap-2 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
          >
            {actionType === "resolve" && isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Mark Resolved
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors px-3"
            title="Delete need"
          >
            {actionType === "delete" && isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={handleRemoveVolunteer}
          className="flex-1 gap-2 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
        >
          {actionType === "remove" && isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Remove Commitment
        </Button>
      )}
    </div>
  );
}
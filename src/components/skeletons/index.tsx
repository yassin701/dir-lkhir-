import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NeedCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function FeedPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-md p-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/3" />
          </Card>
        ))}
      </div>

      {/* Filter Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <NeedCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-md p-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/3" />
          </Card>
        ))}
      </div>

      {/* Sections */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <NeedCardSkeleton key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <Skeleton className="h-6 w-32" />

      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-linear-to-r from-primary/10 to-secondary/10 px-6 py-8 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="space-y-6 p-6">
          <Skeleton className="h-16" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-6 border-t">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </Card>
    </div>
  );
}

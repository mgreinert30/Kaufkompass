import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--muted)]",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="card-base p-6 space-y-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full rounded-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export { Skeleton, CardSkeleton, ResultSkeleton };

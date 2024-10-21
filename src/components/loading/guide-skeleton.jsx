import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function GuideSkeleton({ className }) {
  return (
    <div
      className={cn("flex flex-col space-y-4 basis-64 shrink grow", className)}
    >
      <Skeleton className="h-96" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
      <div className="flex gap-4 items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4  w-24" />
      </div>
      <div className="flex gap-4 items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4  w-24" />
      </div>
    </div>
  );
}

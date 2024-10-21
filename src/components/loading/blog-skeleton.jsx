import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function BlogSkeleton({ className }) {
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <Skeleton className="h-6 " />
      <Skeleton className="h-12 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

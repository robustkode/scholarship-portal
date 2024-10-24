import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="flex flex-col gap-4 my-12">
      <Skeleton className="h-10" />
      <Skeleton className="h-80" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-96" />
    </Container>
  );
}

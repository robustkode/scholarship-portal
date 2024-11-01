"use client";
import Container from "@/components/container";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { seed } from "@/db/seed";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import Link from "next/link";

const fetchStat = async () => {
  return await apiClient.get("/stat");
};

export default function AdminPanel() {
  const { data, error, isPending, isError, refetch } = useQuery({
    queryKey: ["stat"],
    queryFn: fetchStat,
  });

  return (
    <main className="py-12 h-[80vh]">
      <Container as="div" className="flex flex-wrap gap-8">
        {isPending ? (
          <div className="flex flex-wrap gap-6 pt-12">
            {[...Array(5)].map((_, i) => (
              <div
                className="flex gap-4 w-72 grow shrink  items-center"
                key={i}
              >
                <Skeleton className="h-6 grow" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorMessage
            message={error.message}
            retry={refetch}
            className="w-full"
          />
        ) : !data ? (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl">No items to show!</h2>
          </div>
        ) : (
          <section className="flex flex-wrap gap-4">
            <div className="bg-white rounded-sm border py-4 px-8 shdow-md  flex gap-8 items-center shadow-md ">
              <h3 className="header text-lg">
                <span className="mr-2"> {data.schsCount} </span>
                Scholarships
              </h3>
              <Link
                href={"/admin/scholarships"}
                className="hover:bg-primary text-primary hover:text-primary-foreground p-1 rounded-full"
              >
                <Settings className="icon-lg" />
              </Link>
            </div>
            <div className="bg-white rounded-sm border py-4 px-8 shdow-md  flex gap-8 items-center shadow-md">
              <h3 className="header text-lg">
                <span className="mr-2"> {data.blogsCount} </span>
                Blogs
              </h3>
              <Link
                href={"/admin/blogs"}
                className="hover:bg-primary text-primary hover:text-primary-foreground p-1 rounded-full"
              >
                <Settings className="icon-lg" />
              </Link>
            </div>
            <div className="bg-white rounded-sm border py-4 px-8 shdow-md  flex gap-8 items-center shadow-md">
              <h3 className="header text-lg">
                <span className="mr-2"> {data.moderatorsCount} </span>
                Moderators
              </h3>
              <Link
                href={"/admin/moderators"}
                className="hover:bg-primary text-primary hover:text-primary-foreground p-1 rounded-full"
              >
                <Settings className="icon-lg" />
              </Link>
            </div>
            <div className="bg-white rounded-sm border py-4 px-8 shdow-md  flex gap-8 items-center shadow-md">
              <h3 className="header text-lg">
                <span className="mr-2"> {data.guidesCount} </span>
                Guiding videos
              </h3>
              <Link
                href={"/admin/guides"}
                className="hover:bg-primary text-primary hover:text-primary-foreground p-1 rounded-full"
              >
                <Settings className="icon-lg" />
              </Link>
            </div>
            <div className="bg-white rounded-sm border py-4 px-8 shdow-md  flex gap-8 items-center shadow-md">
              <h3 className="header text-lg">
                <span className="mr-2"> {data.popularsCount} </span>
                Popular countries
              </h3>
              <Link
                href={"/admin/populars"}
                className="hover:bg-primary text-primary hover:text-primary-foreground p-1 rounded-full"
              >
                <Settings className="icon-lg" />
              </Link>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

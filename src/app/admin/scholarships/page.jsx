"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import ScholarshipCard from "@/components/scholarship-card";
import { Pencil } from "lucide-react";
import { ScholarshipSkeleton } from "@/components/loading/scholarship-skeleton";
import ErrorMessage from "@/components/error-message";

const fetchScholarships = (pageParam) => {
  return apiClient.get("/scholarships?pageParam=" + pageParam);
};

export default function Scholarships() {
  const { ref, inView } = useInView();
  const [toggle, setToggle] = useState(false);
  const {
    data,
    error,
    isError,
    isPending,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["scholarships"],
    queryFn: async ({ pageParam }) => await fetchScholarships(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.nextCursor,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => firstPage.prevCursor,
  });

  useEffect(() => {
    if (inView && !isError) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isError]);

  return (
    <main className="py-12">
      <Container>
        <div className="flex justify-end">
          <Button className="ml-auto" variant="outline">
            <Link href={"/admin/scholarships/create"}>
              Create a scholarship
            </Link>
          </Button>
        </div>
        {isPending ? (
          <div className="mt-8 flex flex-wrap gap-8 p-8">
            {[...Array(6)].map((_, i) => (
              <ScholarshipSkeleton key={i} className="mb-8" />
            ))}
          </div>
        ) : isError ? (
          <ErrorMessage message={error.message} retry={refetch} />
        ) : (
          <div className="mt-12">
            {data.pages.length === 1 &&
            data.pages[0].data.length === 0 &&
            !toggle ? (
              <div className="flex flex-col items-center  gap-4">
                <h2 className="text-2xl text-center">No Scholarships yet!</h2>
                <Button className="w-fit">
                  <Link href={"/admin/scholarships/create"} className="">
                    Create a scholarship
                  </Link>
                </Button>
              </div>
            ) : (
              ""
            )}
            {data.pages.map((page, i) => (
              <div
                key={page.currentPage}
                className="grid md:grid-cols-2 gap-8 lg:grid-cols-3"
              >
                {page.data?.map((d) => (
                  <div key={d.id} className="relative max-w-96">
                    <ScholarshipCard {...d} />
                    <div className="right-2 top-2 absolute bg-secondary rounded-full shadow-lg">
                      <Button
                        variant="ghost"
                        className="p-2 hover:bg-primary-lig rounded-full"
                      >
                        <Link href={`/admin/scholarships/${d.id}?page=${i}`}>
                          <Pencil className="icon-lg text-secondary-foreground" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* <button
          ref={ref}
          // disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage
            ? "Fetching next page"
            : hasNextPage
            ? "Fetch More Data"
            : "No more data"}
        </button> */}
        <div ref={ref} className="py-4">
          {isFetchingNextPage && "Loading..."}
        </div>
      </Container>
    </main>
  );
}

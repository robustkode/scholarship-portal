"use client";

import Container from "@/components/container";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import VideoCard from "@/components/video-card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/error-message";

const fetchVideos = (pageParam) => {
  return apiClient.get("/guides?pageParam=" + pageParam);
};

export default function Guides() {
  const { ref, inView } = useInView();
  const {
    data,
    isError,
    error,
    refetch,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["videos"],
    queryFn: async ({ pageParam }) => await fetchVideos(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  useEffect(() => {
    if (inView && !isError) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isError]);

  return (
    <main>
      <Container>
        {isPending ? (
          <div className="grid md:grid-cols-2 gap-8 lg:grid-cols-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div className="flex flex-col gap-4" key={i}>
                <Skeleton className="h-32" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorMessage message={error.message} retry={refetch} />
        ) : (
          <div className="mt-12">
            {data.pages.map((page, i) => (
              <div
                key={page.currentPage}
                className="grid md:grid-cols-2 gap-8 lg:grid-cols-3"
              >
                {page.data?.map((d) => (
                  <VideoCard key={d.id} {...d} page={page} />
                ))}
              </div>
            ))}
          </div>
        )}
        <div ref={ref} className="py-4">
          {isFetchingNextPage && "Loading..."}
        </div>
      </Container>
    </main>
  );
}

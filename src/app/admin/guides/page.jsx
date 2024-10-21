"use client";

import Container from "@/components/container";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import VideoForm from "./_components/create-video";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/video-card";
import VideoDeleteButton from "./_components/video-delete-button";
import { LoaderButton } from "@/components/loader-button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/error-message";

const fetchVideos = (pageParam) => {
  return apiClient.get("/guides?pageParam=" + pageParam);
};

export default function Guides() {
  const { ref, inView } = useInView();
  const [toggle, setToggle] = useState(false);
  const {
    data,
    isError,
    error,
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
    queryKey: ["videos"],
    queryFn: async ({ pageParam }) => await fetchVideos(pageParam),
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
    <main>
      <Container>
        {toggle ? (
          <div className="w-full">
            <div className="w-full flex justify-end">
              <Button variant="outline" onClick={() => setToggle(false)}>
                Cancel
              </Button>
            </div>

            <div className="flex justify-center w-full">
              <VideoForm />
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => setToggle(true)}
            >
              Add video
            </Button>
          </div>
        )}
        {isPending ? (
          <div className="grid md:grid-cols-2 gap-8 lg:grid-cols-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div className="flex flex-col gap-4" key={i}>
                <Skeleton className="h-96" />
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
            {data.pages.length === 1 &&
            data.pages[0].data.length === 0 &&
            !toggle ? (
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl">No moderators yet!</h2>
                <Button
                  className="w-fit"
                  onClick={() => {
                    setToggle(true);
                  }}
                >
                  Add video
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
                  <div key={d.id}>
                    <VideoCard {...d} />
                    <div className="flex justify-end gap-8 w-full pt-4">
                      <VideoDeleteButton
                        variant="link"
                        tobedeltedId={{ id: d.id }}
                        page={page}
                      >
                        Delete
                      </VideoDeleteButton>
                      <LoaderButton variant="outline">
                        <Link href={`guides/${d.id}?page=${i}`}>Edit</Link>
                      </LoaderButton>
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

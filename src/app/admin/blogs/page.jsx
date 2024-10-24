"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import ScholarshipCard from "@/components/scholarship-card";
import BlogCard from "@/components/blog-card";
import { BlogSkeleton } from "@/components/loading/blog-skeleton";
import ErrorMessage from "@/components/error-message";

const fetchBlogs = (pageParam) => {
  return apiClient.get("/blogs?pageParam=" + pageParam);
};

export default function Blog() {
  const { ref, inView } = useInView();
  const [toggle, setToggle] = useState(false);
  const {
    data,
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
    error,
  } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: async ({ pageParam }) => await fetchBlogs(pageParam),
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
        <div className="flex justify-end">
          <Button as="div" variant="outline">
            <Link href={"/admin/blogs/write"}>Write blog</Link>
          </Button>
        </div>
        {isPending ? (
          <div className="mt-8">
            {[...Array(6)].map((_, i) => (
              <BlogSkeleton key={i} className="mb-8" />
            ))}
          </div>
        ) : isError ? (
          <ErrorMessage message={error.message} retry={() => refetch()} />
        ) : (
          <div className="mt-12">
            {data.pages.length === 1 &&
            data.pages[0].data.length === 0 &&
            !toggle ? (
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl">No Blogs yet!</h2>
                <Button as="div" variant="outline">
                  <Link href={"/admin/blogs/write"}>Write blog</Link>
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
                    <BlogCard {...d} page={i} edit="true" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div ref={ref} className="py-12 text-center">
          {isFetchingNextPage && "Loading..."}
        </div>
      </Container>
    </main>
  );
}

"use client";
import Container from "@/components/container";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import BlogForm from "../_components/blog-form";

const fetchBlog = (blogId) => {
  return apiClient.get("/blogs/" + blogId);
};

export default function EditBlog() {
  const { blogId } = useParams();
  const { page } = useSearchParams();
  const { data, error, isPending } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => fetchBlog(blogId),
  });
  if (data === "") notFound();
  return (
    <main>
      <Container>
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div>stg went wrong</div>
        ) : (
          <div className="">
            <BlogForm data={data} page={page} />
          </div>
        )}
      </Container>
    </main>
  );
}

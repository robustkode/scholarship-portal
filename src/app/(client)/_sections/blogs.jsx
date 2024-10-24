import Container from "@/components/container";
import BlogCard from "./blog-card";
import { fetchBlogs } from "@/data-access/blogs";
import { cache } from "@/lib/cache";
import Link from "next/link";
import { Suspense } from "react";
import { BlogSkeleton } from "@/components/loading/blog-skeleton";

const cachedBlogs = cache(
  async () => {
    return await fetchBlogs(1, 3);
  },
  ["latest-blogs"],
  { revalidate: 60 * 60 * 24, tags: ["latest-blogs", "blogs"] } //one day
);

export default async function Blogs() {
  return (
    <section>
      <Container as="div" className="py-12">
        <h3 className="section-header">Blogs</h3>

        <Suspense
          fallback={
            <div className="mt-8">
              {[...Array(6)].map((_, i) => (
                <BlogSkeleton key={i} className="mb-8" />
              ))}
            </div>
          }
        >
          <BlogsSuspense />
        </Suspense>
      </Container>
    </section>
  );
}

async function BlogsSuspense() {
  const blogs = await cachedBlogs();
  if (!blogs) {
    return (
      <div>
        <h4 className="text-center py-2">No blogs yet!</h4>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {blogs.data.map((b) => (
        <BlogCard {...b} key={b.id} />
      ))}
    </div>
  );
}

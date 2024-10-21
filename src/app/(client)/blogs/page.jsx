import Container from "@/components/container";
import { cache } from "@/lib/cache";
import { fetchBlogsCardUseCase } from "@/use-cases/blogs";
import { Suspense } from "react";
import BlogCard from "@/components/blog-card";
import { BlogSkeleton } from "@/components/loading/blog-skeleton";

export const dynamic = "force-static";

const cachedBlogs = cache(
  async () => {
    return await fetchBlogsCardUseCase();
  },
  ["blogs"],
  { revalidate: 60 * 60 * 24, tag: ["blogs", "blogs-page"] }
);

export default async function Blogs() {
  return (
    <main className="min-h-[90vh] py-8">
      <h1 className="font-oswald text-3xl font-bold text-header">Blogs</h1>
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
    </main>
  );
}

async function BlogsSuspense() {
  const blogs = await cachedBlogs();

  if (!blogs.length || !blogs) {
    return (
      <div className="flex w-64 bg-gray-200 mx-auto justify-center px-6 py-4 mt-16 rounded-sm">
        <h2 className="small-header">No blogs yet!</h2>
      </div>
    );
  }
  return (
    <div className=" w-full">
      <div className="pt-6 gap-8 flex flex-col gap-8">
        {blogs.map((b) => (
          <BlogCard {...b} key={b.id} />
        ))}
      </div>
    </div>
  );
}

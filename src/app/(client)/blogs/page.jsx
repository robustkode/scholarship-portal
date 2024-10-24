import Container from "@/components/container";
import { cache } from "@/lib/cache";
import { fetchBlogsCardUseCase } from "@/use-cases/blogs";
import { Suspense } from "react";
import BlogCard from "@/components/blog-card";
import { BlogSkeleton } from "@/components/loading/blog-skeleton";
import PagesHero from "@/components/pages-hero";

const HERO = {
  header: "Blogs",
  description:
    "Discover practical tips for finding exciting scholarships, and insights on how to get accepted, along inspiring success stories and what life is like  at universities abroad.",
};
//export const dynamic = "force-static";

const cachedBlogs = cache(
  async () => {
    return await fetchBlogsCardUseCase();
  },
  ["blogs"],
  { revalidate: 60 * 60 * 24, tag: ["blogs", "blogs-page"] }
);

export default async function Blogs() {
  return (
    <main className="min-h-[90vh] pb-12">
      <PagesHero header={HERO.header} description={HERO.description} />
      <Container className={"py-12 grid lg:grid-cols-5 gap-8"}>
        <div className="lg:col-span-4">
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
        </div>
        <aside className="bg-primary-lig rounded-sm lg:my-8 mt-8 flex justify-center items-center h-32 lg:h-auto w-[100%]  order-1 md:order-2">
          Some content
        </aside>
      </Container>
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

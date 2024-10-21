import Container from "@/components/container";
import ShareContent from "@/components/share-content";
import {
  BASE_URL,
  BLOG_OPENGRAPH_IMAGE,
  BLOG_OPENGRAPH_IMAGE_URL,
} from "@/config";
import { isValidURL } from "@/lib/utils";
import { fetchBlogUseCase } from "@/use-cases/blogs";
import { NotFoundError } from "@/use-cases/errors";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";
import { cache } from "@/lib/cache";

export const dynamic = "force-static";

const cachedBlog = cache(async (params) => {
  return fetchBlogUseCase(params.blogId);
}, []);

export async function generateMetadata({ params }) {
  const blog = await cachedBlog(params);
  if (!blog) notFound();

  const tags = blog.tags?.split(",") || [];
  const openGraph = blog.coverImage
    ? {
        images: [
          {
            url: blog.coverImage,
            width: 1200,
            height: 680,
            alt: blog.name + "picture",
          },
        ],
      }
    : {};

  return {
    title: blog.title,
    description: blog.title,
    keywords: ["scholarships", "ethiopia", "students", "blog", ...tags],
    ...openGraph,
  };
}

export default async function Blog({ params }) {
  return (
    <main className="pt-8">
      <Suspense fallback={<Loading />}>
        <BlogSuspense params={params} />
      </Suspense>
    </main>
  );
}

async function BlogSuspense({ params }) {
  const blog = await cachedBlog(params);
  if (!blog) notFound();
  return (
    <section className="">
      <h1 className="header py-2 text-3xl">{blog.title}</h1>
      <p className="pb-2">{blog.tags}</p>
      {blog.coverImage && isValidURL(blog.coverImage) ? (
        <Image
          src={blog.coverImage}
          alt="blog cover image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] h-auto max-h-96 object-cover"
          priority
        />
      ) : (
        ""
      )}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
      <ShareContent
        label={"blog"}
        link={BASE_URL + `/blogs/${params.blogId}`}
      />
    </section>
  );
}

import { db } from "@/db";
import { blogs, blogTags } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";

export async function getBlogsMeta() {
  return await db
    .select({ id: blogs.id, createdAt: blogs.createdAt })
    .from(blogs)
    .orderBy(sql`${blogs.createdAt} desc`);
}

export async function fetchBlogs(page, page_size) {
  // const videos = await db.query.videos.findMany({
  //   limit: page_size + 1,
  //   offset: page_size * (page - 1),
  //   orderBy: (videos, { desc }) => desc(videos.createdAt),
  // });

  const blgs = await db
    .select({
      ...blogs,
      tags: sql`GROUP_CONCAT(DISTINCT(tag)) blogTags`,
    })
    .from(blogs)
    .leftJoin(blogTags, eq(blogs.id, blogTags.blogId))
    .groupBy(blogs.id)
    .orderBy(sql`${blogs.createdAt} desc`)
    .limit(parseInt(page_size) + 1)
    .offset(parseInt(page_size) * parseInt(page - 1));

  const hasNext = blgs.length === page_size + 1;
  if (hasNext) blgs.pop();
  return {
    data: blgs,
    currentPage: page,
    nextCursor: hasNext ? +page + 1 : null,
  };
}

export async function createBlog(values) {
  const [{ id }] = await db.insert(blogs).values(values).returning();
  return id;
}

export async function fetchBlog(id) {
  const blog = await db
    .select({
      ...blogs,
      tags: sql`GROUP_CONCAT(DISTINCT(tag)) blogTags`,
    })
    .from(blogs)
    .leftJoin(blogTags, eq(blogs.id, blogTags.blogId))
    .groupBy(blogs.id)
    .where(eq(blogs.id, id));
  return blog[0];
}

export async function fetchBlogsCard(limit = 6, offset = 0) {
  return await db.query.blogs.findMany({
    //! edit to retrive small amount of text only
    orderBy: (blogs, { desc }) => desc(blogs.createdAt),
    limit: limit,
    offset: offset,
  });
}

export async function fetchBlogCoverImage(id) {
  return await db.query.blogs.findFirst({
    columns: { coverImage: true },
    where: eq(blogs.id, id),
  });
}

export async function updateBlog(id, values) {
  await db.update(blogs).set(values).where(eq(blogs.id, id));
}

export async function deleteBlog(id) {
  await db.delete(blogs).where(eq(blogs.id, id));
}

export async function fetchBlogsCount() {
  const [{ count: c }] = await db
    .select({ count: count(blogs.id) })
    .from(blogs);
  return c;
}

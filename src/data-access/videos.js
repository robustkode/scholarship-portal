import { db } from "@/db";
import { videos } from "@/db/schema";
import { data } from "autoprefixer";
import { count, eq, sql } from "drizzle-orm";

export async function getGuidesMeta() {
  return await db
    .select({ id: videos.id, createdAt: videos.createdAt })
    .from(videos)
    .orderBy(sql`${videos.createdAt} desc`);
}

export async function addVideo(input) {
  const [{ id, link, title, tags }] = await db
    .insert(videos)
    .values({
      ...input,
    })
    .returning();
  return { id, link, title, tags };
}

export async function fetchVideo(guideId) {
  const result = await db.query.videos.findFirst({
    where: eq(videos.id, guideId),
  });

  return result;
}

export async function deleteVideo(id) {
  return await db.delete(videos).where(eq(videos.id, id));
}

export async function updateVideo(input) {
  const { id, ...rest } = input;
  await db.update(videos).set(rest).where(eq(videos.id, id));
}

export async function fetchVideos(page, page_size) {
  const videos = await db.query.videos.findMany({
    limit: page_size + 1,
    offset: page_size * (page - 1),
    orderBy: (videos, { desc }) => desc(videos.createdAt),
  });
  const hasNext = videos.length === page_size + 1;
  if (hasNext) videos.pop();
  return {
    data: videos,
    currentPage: page,
    nextCursor: hasNext ? +page + 1 : null,
  };
}

export async function fetchGuidesCount() {
  const [{ count: c }] = await db
    .select({ count: count(videos.id) })
    .from(videos);
  return c;
}

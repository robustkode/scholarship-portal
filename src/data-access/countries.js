import { db } from "@/db";
import { popularCountries } from "@/db/schema";
import { count, eq, inArray, sql } from "drizzle-orm";

export async function fetchPopulars(limit = 6) {
  return await db.query.popularCountries.findMany({
    orderBy: (popularCountries, { asc }) => asc(popularCountries.rank),
    limit: parseInt(limit),
  });
}

export async function fetchPopular(id) {
  return await db.query.popularCountries.findFirst({
    where: eq(popularCountries.id, id),
  });
}

export async function deletePopular(id) {
  await db.delete(popularCountries).where(eq(popularCountries.id, id));
}

export async function addPopular(values) {
  const [{ count: c }] = await db
    .select({ count: count(popularCountries.id) })
    .from(popularCountries);

  const [result] = await db
    .insert(popularCountries)
    .values({ ...values, rank: c + 1 })
    .returning();
  return result;
}

export async function updatePopulars(populars) {
  const sqlChunks = [];
  const ids = [];

  sqlChunks.push(sql`(case`);

  for (const popular of populars) {
    sqlChunks.push(
      sql`when ${popularCountries.id} = ${popular.id} then ${popular.rank}`
    );
    ids.push(popular.id);
  }

  sqlChunks.push(sql`end)`);

  const finalSql = sql.join(sqlChunks, sql.raw(" "));
  await db
    .update(popularCountries)
    .set({ rank: finalSql })
    .where(inArray(popularCountries.id, ids));
}

export async function fetchPopularsCount() {
  const [{ count: c }] = await db
    .select({ count: count(popularCountries.id) })
    .from(popularCountries);
  return c;
}

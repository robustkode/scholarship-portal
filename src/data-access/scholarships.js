import { db } from "@/db";
import {
  blogs,
  country,
  ScholarshipDegrees,
  scholarshipHosts,
  scholarships,
  scholarshipTags,
} from "@/db/schema";
import { and, asc, count, desc, eq, inArray, or, sql } from "drizzle-orm";

export async function getScholarshipsMeta() {
  return await db
    .select({ id: scholarships.id, createdAt: scholarships.createdAt })
    .from(scholarships)
    .orderBy(sql`${scholarships.createdAt} desc`);
}

export async function fetchScholarships(
  limit = 6,
  sortBy = "createdAt",
  offset = 0
) {
  const schs = db
    .select({
      ...scholarships,
      country: sql`GROUP_CONCAT(DISTINCT(country)) scholarshipHosts`,
      degree: sql`GROUP_CONCAT(DISTINCT(degree)) ScholarshipDegrees`,
    })
    .from(scholarships)
    .leftJoin(
      scholarshipHosts,
      eq(scholarships.id, scholarshipHosts.scholarshipId)
    )
    .leftJoin(
      ScholarshipDegrees,
      eq(scholarships.id, ScholarshipDegrees.scholarshipId)
    )
    .groupBy(scholarships.id);
  if (sortBy) {
    schs.orderBy(sql`${scholarships[sortBy]} desc`);
  }
  if (limit && offset) {
    schs.limit(parseInt(limit) + 1);
  } else if (limit) {
    schs.limit(parseInt(limit));
  }

  if (offset) {
    schs.offset(parseInt(limit) * (parseInt(offset) - 1));
  }

  const scholrs = await schs;
  if (limit && offset) {
    const hasNext = scholrs.length === limit + 1;
    if (hasNext) scholrs.pop();
    return {
      data: scholrs,
      currentPage: offset,
      nextCursor: hasNext ? +offset + 1 : null,
    };
  }
  return scholrs;
}

export async function fetchScholarshipsMetadata() {
  const post = await db.query.scholarships.findMany();
  return post;
}

export async function createScholarship(values) {
  const { degrees, countries, tags, ...rest } = values;
  const [{ id }] = await db.insert(scholarships).values(rest).returning();

  try {
    if (tags.length) {
      const filTags = tags.map((t) => {
        return { tag: t, scholarshipId: id };
      });
      await db
        .insert(scholarshipTags)
        .values([...filTags])
        .onConflictDoNothing();
    }

    if (countries.length) {
      const filHosts = countries.map((h) => {
        return { country: h, scholarshipId: id };
      });
      await db.insert(scholarshipHosts).values([...filHosts]);
    }

    if (degrees.length) {
      const filDegree = degrees.map((d) => {
        return { degree: d, scholarshipId: id };
      });

      await db.insert(ScholarshipDegrees).values([...filDegree]);
    }
  } catch (error) {
    console.log(error);
  }
  return id;
}

export async function fetchScholarship(id) {
  const sch = await db
    .select({
      ...scholarships,
      countries: sql`GROUP_CONCAT(DISTINCT(country)) scholarshipHosts`,
      degrees: sql`GROUP_CONCAT(DISTINCT(degree)) ScholarshipDegrees`,
      tags: sql`GROUP_CONCAT(DISTINCT(tag)) scholarshipTags`,
    })
    .from(scholarships)
    .leftJoin(
      scholarshipHosts,
      eq(scholarships.id, scholarshipHosts.scholarshipId)
    )
    .leftJoin(
      ScholarshipDegrees,
      eq(scholarships.id, ScholarshipDegrees.scholarshipId)
    )
    .leftJoin(
      scholarshipTags,
      eq(scholarships.id, scholarshipTags.scholarshipId)
    )

    .groupBy(scholarships.id)
    .where(eq(scholarships.id, id));

  return sch[0];
}

export async function fetchScholarshipImage(id) {
  return await db.query.scholarships.findFirst({
    columns: { coverImage: true },
    where: eq(scholarships.id, id),
  });
}

export async function deleteScholarship(id) {
  await db.delete(scholarships).where(eq(scholarships.id, id));
}

export async function updateScholarship(id, values) {
  const { degrees, rDegrees, countries, rCountries, tags, rTags, ...rest } =
    values;

  //! create transaction incase create tags, hosts, degrees fails

  //! add continents

  await db.update(scholarships).set(rest).where(eq(scholarships.id, id));

  try {
    //! use bulk update and move this mess to data access
    if (tags.length) {
      const filTags = tags.map((t) => {
        return { tag: t, scholarshipId: id };
      });
      await db
        .insert(scholarshipTags)
        .values([...filTags])
        .onConflictDoNothing();
    }

    if (countries.length) {
      const filHosts = countries.map((h) => {
        // return { country: h, scholarshipId: id };
        return { country: h, continent: "europe", scholarshipId: id };
      });
      await db.insert(scholarshipHosts).values([...filHosts]);
    }

    if (degrees.length) {
      const filDegree = degrees.map((d) => {
        return { degree: d, scholarshipId: id };
      });

      await db.insert(ScholarshipDegrees).values([...filDegree]);
    }

    //remove
    if (rCountries.length) {
      await db
        .delete(scholarshipHosts)
        .where(or(...rCountries.map((c) => eq(scholarshipHosts.country, c))));
    }

    if (rDegrees.length) {
      await db
        .delete(ScholarshipDegrees)
        .where(or(...rDegrees.map((d) => eq(ScholarshipDegrees.degree, d))));
    }
    if (rTags.length) {
      await db
        .delete(scholarshipTags)
        .where(or(...rTags.map((t) => eq(scholarshipTags.tag, t))));
    }
  } catch (error) {
    console.log(error);
  }
}

async function _update() {}

export async function fetchFilteredScholarships({
  country,
  degree,
  sort,
  page = 1,
  pageSize = 6,
  updated = false,
}) {
  const conditions = {};
  //! fix this query, it doesn't return whole countries or degrees
  if (country.length) {
    conditions.country = inArray(scholarshipHosts.country, country);
  }

  if (degree.length) {
    conditions.degrees = inArray(ScholarshipDegrees.degree, degree);
  }
  const query = db
    .select({
      ...scholarships,
      country: sql`GROUP_CONCAT(DISTINCT(country)) scholarshipHosts`,
      degree: sql`GROUP_CONCAT(DISTINCT(degree)) ScholarshipDegrees`,
    })
    .from(scholarships)
    .leftJoin(
      scholarshipHosts,
      eq(scholarships.id, scholarshipHosts.scholarshipId)
    )
    .leftJoin(
      ScholarshipDegrees,
      eq(scholarships.id, ScholarshipDegrees.scholarshipId)
    )
    .groupBy(scholarships.id)
    .orderBy(sort === "asc" ? asc(scholarships.tution) : desc("tution"));

  if (Object.keys(conditions).length > 0) {
    query.where(and(...Object.values(conditions)));
  }
  query.limit(parseInt(pageSize));
  query.offset(parseInt(pageSize * (page - 1)));

  const countQuery = db
    .select({ count: sql`count(distinct(${scholarships.id}))` })
    //.select({ count: count(scholarships.id) })

    .from(scholarships)
    .leftJoin(
      scholarshipHosts,
      eq(scholarships.id, scholarshipHosts.scholarshipId)
    )
    .leftJoin(
      ScholarshipDegrees,
      eq(scholarships.id, ScholarshipDegrees.scholarshipId)
    )
    // .groupBy(scholarships.id);

  if (Object.keys(conditions).length > 0) {
    countQuery.where(and(...Object.values(conditions)));
  }

  const schs = await query;
  let totalCount;
  if (updated) {
    const countResult = await countQuery;
    totalCount = countResult[0]?.count || 0; // Get the count from the result
  }

  return {
    scholarships: schs,
    totalCount,
  };
}

export async function fetchScholarshipsCount() {
  const [{ count: c }] = await db
    .select({ count: count(scholarships.id) })
    .from(scholarships);
  return c;
}

export async function getScholarshipMetaByName(name) {
  return await db.query.scholarships.findFirst({
    columns: {
      id: true,
    },
    where: eq(scholarships.name, name),
  });
}

export async function getScholarshipMetaById(id) {
  return await db.query.scholarships.findFirst({
    columns: {
      id: true,
    },
    where: eq(scholarships.id, id),
  });
}

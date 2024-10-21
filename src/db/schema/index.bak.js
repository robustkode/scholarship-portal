import { userRole } from "@/config";
import { randomUUID } from "crypto";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { title } from "process";

export const users = sqliteTable("users", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified").default(0),
  password_hash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  role: integer("role").default(userRole),
});
export const accountTokens = sqliteTable("account_tokens", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").notNull().unique(),
  token: text("token").notNull(),
  role: text("role").notNull(),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  expiresAt: integer("expires_at").notNull(),
});

export const resetTokens = sqliteTable("reset_tokens", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const verifyEmailTokens = sqliteTable("verify_email_tokens", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

//
// export const blogs = sqliteTable("blogs", {
//   id: text("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => randomUUID()),
//   tags: text("tags"),
//   title: text("title").notNull(),
//   content1: text("content1").notNull(),
//   content2: text("content2"),
//   content3: text("content3"),
//   img1: text("img1"),
//   img2: text("img2"),
//   img3: text("img3"),
//   createdAt: integer("created_at")
//     .notNull()
//     .$defaultFn(() => Date.now()),
// });

export const accounts = sqliteTable("accounts", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  password_hash: text("password_hash").notNull(),
  role: integer("role"),
});

export const blogs = sqliteTable("blogs", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "set default" })
    .notNull()
    .$default("place-holder-id"),
  title: text("title").unique().notNull(),
  coverImage: text("cover_image"),
  content: text("content").notNull(),
  public: integer("public").default(1),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const scholarships = sqliteTable("scholarships", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  // userId: text("user_id")
  //   .references(() => users.id, { onDelete: "set default" })
  //   .notNull()
  //   .$default("d242d13f-72eb-4f58-ba38-9e2c9e14af6e"),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  //! make this unique
  name: text("name").notNull(),
  // countries: text("countries", { mode: "json" }).$default(() => []),
  // degrees: text("degrees", { mode: "json" }).$default(() => []),
  coverImage: text("cover_image"),
  university: text("university"),
  tution: integer("tution").notNull(),
  openTime: integer("openTime"),
  deadline: integer("deadline").notNull(),
  public: integer("public").default(1),
  about: text("about").notNull(),
  eligibility: text("eligibility").notNull(),
  documents: text("documents"),
  benefits: text("benefits"),
  howApply: text("how_apply"),
  applyLink: text("aaply_link").notNull(),
  otherFields: text("other_fields"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

// export const scholarshipsMetaData = sqliteTable("scholarships_meta_data", {
//   id: text("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => randomUUID()),
//   scholarshipId: text("scholarship_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .unique()
//     .notNull(),
// });

export const scholarshipHosts = sqliteTable("scholarship_hosts", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const ScholarshipDegrees = sqliteTable("scholarship_degrees", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  degree: text("degree", { enum: ["bachelor", "master", "phd"] }).notNull(),
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const country = sqliteTable("country", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
});

export const popularCountries = sqliteTable("popular_countries", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  country: text("name").notNull(),
  //! default to count + 1
  rank: integer("rank").unique().notNull(),
});

export const blogTags = sqliteTable("blog_tags", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  blogId: text("blog_id")
    .references(() => blogs.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tag: text("tag").notNull(),
});

export const scholarshipTags = sqliteTable("scholarship_tags", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tag: text("tag").notNull(),
});

export const videos = sqliteTable("Videos", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title").notNull(),
  link: text("link").notNull(),
  //! make this optional
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tag: text("tag").notNull(),
  //! add not null
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

//@2 create country table and many to many with scholarships, and save popularity in
// a column

//@2 use lists insetead of tables in tags, countries

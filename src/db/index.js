import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { config } from "dotenv";
// import {
//   users,
//   sessions,
//   resetTokens,
//   verifyEmailTokens,
//   blogs,
//   scholarships,
//   scholarshipTags,
//   ScholarshipDegrees,
//   scholarshipHosts,
//   blogTags,
//   accountTokens,
//   popularCountries,
//   videos,
// } from "./schema";
import {
  users,
  accountTokens,
  sessions,
  scholarships,
  videos,
  blogs,
  popularCountries,
} from "./schema";
config();

const sqlite = new Database(process.env.DB_URL);
// export const db = drizzle(sqlite, {
//   schema: {
//     users,
//     sessions,
//     resetTokens,
//     verifyEmailTokens,
//     blogs,
//     scholarships,
//     scholarshipTags,
//     ScholarshipDegrees,
//     scholarshipHosts,
//     blogTags,
//     accountTokens,
//     popularCountries,
//     videos,
//   },
// });

export const db = drizzle(sqlite, {
  schema: {
    users,
    accountTokens,
    sessions,
    videos,
    scholarships,
    blogs,
    popularCountries,
  },
});

migrate(db, { migrationsFolder: "src/drizzle" });

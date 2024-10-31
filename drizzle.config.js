import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config();

export default defineConfig({
  schema: "./src/db/schema/index.js",
  out: "./src/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    //!! edit this
    url: process.env.DB_URL,
  },
});

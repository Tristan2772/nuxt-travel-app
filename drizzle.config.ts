// import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

import env from "./lib/env";

// config({ path: ".env" });

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  casing: "snake_case",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
  },
});

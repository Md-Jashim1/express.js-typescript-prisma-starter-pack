import { envVars } from "./src/config/env";

import { defineConfig } from "prisma/config";

export default defineConfig({
  // the main entry for your schema
  schema: "prisma/schema",
  // where migrations should be generated
  // what script to run for "prisma db seed"
  migrations: {
    path: "prisma/migrations",
  },
  // The database URL
  datasource: {
    url: envVars.DB_URL,
  },
});

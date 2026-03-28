// import { PrismaClient } from "../../generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { envVars } from "./env";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: envVars.DB_URL,
});
export const prisma = new PrismaClient({ adapter });

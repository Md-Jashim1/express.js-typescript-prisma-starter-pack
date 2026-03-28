"use strict";
// import { PrismaClient } from "../../generated/prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const env_1 = require("./env");
const client_1 = require("../generated/prisma/client");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: env_1.envVars.DB_URL,
});
exports.prisma = new client_1.PrismaClient({ adapter });

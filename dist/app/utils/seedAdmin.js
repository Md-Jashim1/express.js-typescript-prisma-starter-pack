"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const userRole_1 = require("../interfaces/userRole");
const env_1 = require("../../config/env");
const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma_1.prisma.user.findFirst({
            where: {
                role: userRole_1.UserRole.SUPER_ADMIN,
            },
        });
        if (isSuperAdminExist) {
            console.log("Super Admin already exists!");
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND) || 10);
        const superAdmin = await prisma_1.prisma.user.create({
            data: {
                name: env_1.envVars.SUPER_ADMIN_NAME,
                email: env_1.envVars.SUPER_ADMIN_EMAIL,
                password: hashedPassword,
                role: userRole_1.UserRole.SUPER_ADMIN,
            },
        });
        console.log("Super Admin Created Successfully!", superAdmin);
    }
    catch (err) {
        console.error("Error seeding Super Admin:", err);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
};
exports.default = seedSuperAdmin;

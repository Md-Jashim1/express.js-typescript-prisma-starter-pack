import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { UserRole } from "../interfaces/userRole";
import { envVars } from "../../config/env";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD as string,
      Number(envVars.BCRYPT_SALT_ROUND) || 10,
    );

    const superAdmin = await prisma.user.create({
      data: {
        name: envVars.SUPER_ADMIN_NAME as string,
        email: envVars.SUPER_ADMIN_EMAIL as string,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      },
    });

    console.log("Super Admin Created Successfully!", superAdmin);
  } catch (err) {
    console.error("Error seeding Super Admin:", err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedSuperAdmin;

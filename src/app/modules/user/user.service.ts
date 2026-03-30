import { envVars } from "../../../config/env";
import { prisma } from "../../../config/prisma";
import {
  UserCreateInput,
  UserUpdateInput,
} from "../../../generated/prisma/models";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

import bcrypt from "bcryptjs";
import { UserRole } from "../../interfaces/userRole";
import { Role } from "../../../generated/prisma/enums";

const createAdmin = async (payload: UserCreateInput) => {
  const { name, email, password } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const hashed = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashed,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const createUser = async (payload: UserCreateInput) => {
  const { name, email, password } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const hashed = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashed,
      role: UserRole.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const getAllUsers = async (role?: string, page = 1, limit = 20) => {
  const filter: any = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: filter }),
  ]);

  return { users, total, page, limit };
};

const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

const updateUser = async (id: string, payload: UserUpdateInput) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser)
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");

  const result = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUserRole = async (id: string, role: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser)
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");

  if (!["SUPER_ADMIN", "ADMIN", "USER"].includes(role)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bad Request: Invalid Role Value",
    );
  }
  const result = await prisma.user.update({
    where: { id },
    data: {
      role: role as Role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found");

  return await prisma.user.delete({ where: { id } });
};

export const userService = {
  createAdmin,
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserRole,
  deleteUser,
};

import httpStatus from "http-status";
import { prisma } from "../../../config/prisma";
import AppError from "../../errorHelpers/AppError";
import bycryptjs from "bcryptjs";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { envVars } from "../../../config/env";
import { Secret } from "jsonwebtoken";

const credentialsLogin = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Email does not Exist");
  }

  const isCorrectPassword: boolean = await bycryptjs.compare(
    password as string,
    isUserExist.password as string,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is Incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: isUserExist.id,
      name: isUserExist.name,
      email: isUserExist.email,
      role: isUserExist.role,
      image: isUserExist.image,
    },
    envVars.JWT_ACCESS_SECRET as Secret,
    envVars.JWT_ACCESS_EXPIRES as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    envVars.JWT_REFRESH_SECRET as Secret,
    envVars.JWT_REFRESH_EXPIRES as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (decodedUser: any) => {
  const accessToken = decodedUser.accessToken;

  const decodedData = jwtHelpers.verifyToken(
    accessToken,
    envVars.JWT_ACCESS_SECRET as Secret,
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userData;
};

export const authService = { credentialsLogin, getMe };

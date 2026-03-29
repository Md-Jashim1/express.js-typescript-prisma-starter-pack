import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { parseExpiryToken } from "../../shared/parseExpiryToken";
import { envVars } from "../../../config/env";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessTokenMaxAge = parseExpiryToken(
      envVars.JWT_ACCESS_EXPIRES as string,
      1000 * 60 * 60,
    );
    const refreshTokenMaxAge = parseExpiryToken(
      envVars.JWT_REFRESH_EXPIRES as string,
      1000 * 60 * 60 * 24 * 30,
    );
    const result = await authService.credentialsLogin(req.body);

    const { refreshToken, accessToken } = result;

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged in successfully!",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear cookies
  res.clearCookie("accessToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: null,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.cookies;

  const result = await authService.getMe(decodedUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

export const authController = { credentialsLogin, logoutUser, getMe };

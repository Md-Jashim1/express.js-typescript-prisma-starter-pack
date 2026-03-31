import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { createUserSchema } from "./user.validation";
import AppError from "../../errorHelpers/AppError";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { UserRole } from "../../interfaces/userRole";

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(400, parsed.error.message);
    }

    const result = await userService.createAdmin(parsed.data);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User crated successfully",
      data: result,
    });
  },
);

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(400, parsed.error.message);
    }

    const result = await userService.createUser(parsed.data);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User crated successfully",
      data: result,
    });
  },
);

// Get all users with filters + pagination
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, page, limit } = req.query;

  const result = await userService.getAllUsers(
    role as string,
    Number(page) || 1,
    Number(limit) || 20,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await userService.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Details Retrieved Successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const requester = (req as any).user;
  // console.log("from updateUser -> user.controller.ts", requester);
  const id = String(req.params.id);
  const payload = req.body;

  if (
    (requester.role !== UserRole.SUPER_ADMIN ||
      requester.role !== UserRole.ADMIN) &&
    requester.id !== id
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  const result = await userService.updateUser(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const role = req.body.role;

  if (!role) throw new AppError(httpStatus.BAD_REQUEST, "Role is Required");

  const result = await userService.updateUserRole(id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Role Updated Successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await userService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserRole,
  deleteUser,
};

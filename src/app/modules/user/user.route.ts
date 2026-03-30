import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import authGuard from "../../middlewares/authGuard";
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserSchema,
} from "./user.validation";
import { UserRole } from "../../interfaces/userRole";
import { userController } from "./user.controller";

const router = Router();

router.get(
  "/:id",
  authGuard(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getSingleUser,
);

router.get(
  "/",
  authGuard(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllUsers,
);

router.post(
  "/create-admin",
  authGuard(UserRole.SUPER_ADMIN),
  validateRequest(createUserSchema),
  userController.createAdmin,
);

router.post(
  "/create-user",
  authGuard(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createUserSchema),
  userController.createUser,
);

router.patch(
  "/:id",
  authGuard(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateUserSchema),
  userController.updateUser,
);

router.patch(
  "/:id/role",
  authGuard(UserRole.SUPER_ADMIN),
  validateRequest(updateUserRoleSchema),
  userController.updateUserRole,
);

router.delete(
  "/:id",
  authGuard(UserRole.SUPER_ADMIN),
  userController.deleteUser,
);

export const userRoutes = router;

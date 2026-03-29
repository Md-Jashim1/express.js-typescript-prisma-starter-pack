import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/login",
  validateRequest(loginZodSchema),
  authController.credentialsLogin,
);

router.post("/logout", authController.logoutUser);

router.get("/me", authController.getMe);

export const authRoutes = router;

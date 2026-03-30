import z from "zod";
import { createUserSchema } from "../modules/user/user.validation";
import { loginZodSchema } from "../modules/auth/auth.validation";

export type RegisterPayload = z.infer<typeof createUserSchema>;
export type LoginPayload = z.infer<typeof loginZodSchema>;

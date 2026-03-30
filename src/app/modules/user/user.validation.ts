import z from "zod";

export const createUserSchema = z.object({
  name: z.string("Name is Required"),
  email: z.email("Invalid Email Format"),
  password: z
    .string({
      error: "Password is Required",
    })
    .min(6, "Password must be at least 6 characters long"),
  image: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  password: z.string().optional(),
  image: z.string().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z
    .enum(["SUPER_ADMIN", "ADMIN", "USER"])
    .refine((val) => !!val, { message: "Role is required" }),
});

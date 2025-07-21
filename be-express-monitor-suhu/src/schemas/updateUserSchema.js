import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["admin", "user"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").optional(),
  email: z.string().email("Email tidak valid").optional(),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
  role: z.enum(["admin", "user"]).optional(),
});

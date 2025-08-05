import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(1, 'username wajib diisi'),
    password: z.string().min(7, 'password minima 4 karakter'),
    email: z.string().email('fromat email tidak valid'),
    no_hp: z.string().min(10, 'no HP minimal 10 digit').max(15, 'No HP maksimal 15 digit'),
    role: z.enum(['user', 'admin', 'superadmin']),
});

export const updateUserSchema = z.object({
  username: z.string().min(1, 'username wajib diisi'),
  password: z.union([
    z.string().min(6, 'Password minimal 6 karakter'),
    z.literal(''),
    z.undefined(),
  ]),
  email: z.string().email('fromat email tidak valid'),
  no_hp: z.string().min(10, 'no HP minimal 10 digit').max(15, 'No HP maksimal 15 digit'),
  role: z.enum(['user', 'admin', 'superadmin']),
});

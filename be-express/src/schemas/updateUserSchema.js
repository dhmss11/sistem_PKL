import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, 'username wajib diisi'),
    password: z.string().min(7, 'password minimal 7 karakter'),
    email: z.string().email('fromat email tidak valid'),
    role: z.enum(['siswa', 'guru', 'admin','dudi']),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'username wajib diisi'),
  password: z.union([
    z.string().min(7, 'Password minimal 7 karakter'),
    z.literal(''),
    z.undefined(),
  ]),
  email: z.string().email('fromat email tidak valid'),
    role: z.enum(['siswa', 'guru', 'admin','dudi']),
});

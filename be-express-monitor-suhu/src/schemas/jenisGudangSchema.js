import { z } from 'zod';

export const jenisGudangSchema = z.object({
    nama: z.string().min(1, 'nama wajib diisi'),
    keterangan: z.string().optional,
});
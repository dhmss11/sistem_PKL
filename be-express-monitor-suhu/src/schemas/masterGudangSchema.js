import { z } from "zod";

export const addGudangSchema = z.object({
  jenis: z
    .string({ required_error: 'Jenis gudang wajib diisi' })
    .min(1, 'Jenis gudang tidak boleh kosong'),

  nama: z
    .string({ required_error: 'Nama gudang wajib diisi' })
    .min(1, 'Nama gudang tidak boleh kosong'),

  alamat: z
    .string({ required_error: 'Alamat wajib diisi' })
    .min(1, 'Alamat tidak boleh kosong'),

  keterangan: z
    .string({ required_error: 'Keterangan wajib diisi' })
    .min(1, 'Keterangan tidak boleh kosong')
});

export const updateGudangSchema = z.object({
  jenis: z
    .string({ required_error: 'Jenis gudang wajib diisi' })
    .min(1, 'Jenis gudang tidak boleh kosong'),

  nama: z
    .string({ required_error: 'Nama gudang wajib diisi' })
    .min(1, 'Nama gudang tidak boleh kosong'),

  alamat: z
    .string({ required_error: 'Alamat wajib diisi' })
    .min(1, 'Alamat tidak boleh kosong'),

  keterangan: z
    .string({ required_error: 'Keterangan wajib diisi' })
    .min(1, 'Keterangan tidak boleh kosong')
});

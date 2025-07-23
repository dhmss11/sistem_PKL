import {
    addGudang,
    editGudang,
    GetAllGudang,
    getGudangByID,
    removeGudang,
} from '../models/gudangModel.js';

import { updateGudangSchema, addGudangSchema } from '../schemas/masterGudangSchema.js';
import { datetime, status } from "../utils/general.js";
import { db } from "../core/config/knex.js";



export const fetchAllGudang = async (req, res) => {
    try {
        const gudang = await GetAllGudang();

        return res.status(200).json({
            status: status.SUKSES,
            message: gudang.length === 0 ? 'Data gudang kosong' : 'Data gudang berhasil diambil',
            datetime: datetime(),
            gudang,
        });
    } catch (error) {
        return res.status(500).json({
            status: status.GAGAL,
            message: `Gagal mengambil data: ${error.message}`,
            datetime: datetime(),
        });
    }
};

export const createGudang = async (req, res) => {
    try {
        const allowedJenis = ['baku', 'mentah', 'transit'];

        if (!allowedJenis.includes(req.body.jenis)) {
            return res.status(400).json({
                status: 'GAGAL',
                message: 'Jenis gudang tidak valid',
                datetime: datetime(),
            });
        }

        const validation = addGudangSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: 'Validasi gagal',
                datetime: datetime(),
                errors: validation.error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        const { jenis, nama, alamat, keterangan } = validation.data;

        const cekNama = await db('nama_gudang').where({ nama }).first();
        if (cekNama) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: 'Nama gudang sudah digunakan',
                datetime: datetime(),
            });
        }

        const gudang = await addGudang({ jenis, nama, alamat, keterangan });

        return res.status(201).json({
            status: status.SUKSES,
            message: 'Gudang berhasil ditambahkan',
            datetime: datetime(),
            gudang,
        });
    } catch (error) {
        return res.status(500).json({
            status: status.GAGAL,
            message: `Gagal menambahkan gudang: ${error.message}`,
            datetime: datetime(),
        });
    }
};

export const updateGudang = async (req, res) => {
    try {
        const allowedJenis = ['baku', 'mentah', 'transit'];

        if (!allowedJenis.includes(req.body.jenis)) {
            return res.status(400).json({
                    status: 'GAGAL',
                    message: 'Jenis gudang tidak valid',
                    datetime: datetime(),
        
            });
        }

        const { id } = req.params;

        const validation = updateGudangSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: 'Validasi gagal',
                datetime: datetime(),
                errors: validation.error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        const existing = await getGudangByID(id);
        if (!existing) {
            return res.status(404).json({
                status: status.NOT_FOUND,
                message: 'Gudang tidak ditemukan',
                datetime: datetime(),
            });
        }

        const { jenis, nama, alamat, keterangan } = validation.data;

        const namaDuplikat = await db('nama_gudang').where({ nama }).andWhereNot({ id }).first();
        if (namaDuplikat) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: 'Nama gudang sudah digunakan oleh gudang lain',
                datetime: datetime(),
            });
        }

        await editGudang({ id, jenis, nama, alamat, keterangan });
        const updated = await getGudangByID(id);

        return res.status(200).json({
            status: status.SUKSES,
            message: 'Gudang berhasil diperbarui',
            datetime: datetime(),
            gudang: updated,
        });
    } catch (error) {
        return res.status(500).json({
            status: status.GAGAL,
            message: `Gagal update gudang: ${error.message}`,
            datetime: datetime(),
        });
    }
};

export const destroyGudang = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getGudangByID(id);
        if (!existing) {
            return res.status(404).json({
                status: status.NOT_FOUND,
                message: 'Data gudang tidak ditemukan',
                datetime: datetime(),
            });
        }

        await removeGudang(id);

        return res.status(200).json({
            status: status.SUKSES,
            message: 'Gudang berhasil dihapus secara permanen',
            datetime: datetime(),
        });
    } catch (error) {
        return res.status(500).json({
            status: status.GAGAL,
            message: `Gagal menghapus gudang: ${error.message}`,
            datetime: datetime(),
        });
    }
};

export const fetchGudangByJenis = async (req, res) => {
  const { jenis } = req.params;
  try {
    const data = await db('nama_gudang')
      .count('* as jumlah')
      .where('jenis', jenis)
      .first();

    return res.json({
      status: status.SUKSES,
      message: `Jumlah gudang jenis ${jenis} berhasil diambil`,
      datetime: datetime(),
      jumlah: data.jumlah,
    });
  } catch (err) {
    console.error('Error getGudangByJenis:', err);
    return res.status(500).json({
      status: status.GAGAL,
      message: 'Terjadi kesalahan saat mengambil jumlah gudang',
      datetime: datetime(),
    });
  }
};

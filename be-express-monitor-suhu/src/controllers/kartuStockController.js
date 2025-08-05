import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";

/**
 * Ambil semua data kartu stok
 */
export const fetchAllKartuStock = async (req, res) => {
  try {
    const data = await db("kartustock").select([
      "id",            // Pastikan ada kolom ID untuk identifikasi unik
      "STATUS",
      "FAKTUR",
      "TGL",
      "GUDANG",
      "KODE",
      "QTY",
      "DEBET",
      "KREDIT",
      "HARGA",
      "DISCITEM",
      "DISCFAKTUR1",
      "DISCFAKTUR2",
      "HP",
      "KETERANGAN",
      "DATETIME",
      "USERNAME",
      "URUT",
      "SATUAN",
      "PPN"
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "Data kartu stok kosong",
        datetime: datetime(),
        data: []
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Berhasil ambil data kartu stok",
      datetime: datetime(),
      data
    });
  } catch (error) {
    console.error("❌ Error fetch kartu stok:", error.message);
    return res.status(500).json({
      status: status.ERROR,
      message: "Terjadi kesalahan server",
      datetime: datetime(),
      error: error.message
    });
  }
};

/**
 * Tambah data kartu stok baru
 */
export const addKartuStock = async (req, res) => {
  try {
    const body = req.body;
    await db("kartustock").insert(body);

    return res.status(201).json({
      status: status.SUKSES,
      message: "Data kartu stok berhasil ditambahkan",
      datetime: datetime()
    });
  } catch (error) {
    console.error("❌ Error tambah kartu stok:", error.message);
    return res.status(500).json({
      status: status.ERROR,
      message: "Gagal menambahkan data kartu stok",
      datetime: datetime(),
      error: error.message
    });
  }
};

/**
 * Edit data kartu stok berdasarkan ID
 */
export const editKartuStock = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await db("kartustock").where({ id }).update(body);

    if (!updated) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "Data kartu stok tidak ditemukan",
        datetime: datetime()
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Data kartu stok berhasil diperbarui",
      datetime: datetime()
    });
  } catch (error) {
    console.error("❌ Error edit kartu stok:", error.message);
    return res.status(500).json({
      status: status.ERROR,
      message: "Gagal memperbarui data kartu stok",
      datetime: datetime(),
      error: error.message
    });
  }
};

/**
 * Hapus data kartu stok berdasarkan ID
 */
export const deleteKartuStock = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("kartustock").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "Data kartu stok tidak ditemukan",
        datetime: datetime()
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Data kartu stok berhasil dihapus",
      datetime: datetime()
    });
  } catch (error) {
    console.error("❌ Error hapus kartu stok:", error.message);
    return res.status(500).json({
      status: status.ERROR,
      message: "Gagal menghapus data kartu stok",
      datetime: datetime(),
      error: error.message
    });
  }
};

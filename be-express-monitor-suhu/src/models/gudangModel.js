import { db } from '../core/config/knex.js';

/**
 * Ambil semua data gudang
 */
export const GetAllGudang = async () => db('nama_gudang').select('*');

/**
 * Ambil nama gudang berdasarkan ID
 * @param {number} id
 */
export const getGudangByID = async (id) =>
  db('nama_gudang').where({ id }).first();

/**
 * Tambah gudang baru
 * @param {{
 *  jenis: string,
 *  nama: string,
 *  alamat: string,
 *  keterangan?: string
 * }} data
 */
export const addGudang = async ({ jenis, nama, alamat, keterangan }) => {
  const [id] = await db("nama_gudang").insert({ jenis, nama, alamat, keterangan });
  return db("nama_gudang").where({ id }).first();
};

export const editGudang = async ({ id, jenis, nama, alamat, keterangan }) => {
  await db("nama_gudang")
    .where({ id })
    .update({ jenis, nama, alamat, keterangan });
  return db("nama_gudang").where({ id }).first();
};


/**
 * Hapus permanen
 * @param {number} id
 */
export const removeGudang = async (id) =>
  db('nama_gudang').where({ id }).del();

/**
 * Ambil semua nama gudang berdasarkan jenis
 * @param {string} jenis
 */
export const getGudangByJenis = async (jenis) =>
  db('nama_gudang').where({ jenis }).select('*');

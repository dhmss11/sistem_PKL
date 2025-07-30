import { db } from "../core/config/knex.js";

// GET semua data satuan
export const getAllSatuanStock = async (req, res) => {
  try {
    const satuan = await db('satuanstock').select('*');
    res.json(satuan);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data satuan', detail: err.message });
  }
};

// POST tambah data
export const createSatuanStock = async (req, res) => {
  try {
    console.log("ISI req.body:", req.body); // <--- log isi body

    const { KODE, KETERANGAN } = req.body;

    if (!KODE || !KETERANGAN) {
      return res.status(400).json({ message: "KODE dan KETERANGAN wajib diisi" });
    }

    await db('satuanstock').insert({ KODE, KETERANGAN });

    res.json({ message: 'Satuan berhasil ditambahkan' });
  } catch (err) {
    console.error("ERROR INSERT:", err); // <--- log error detail
    res.status(500).json({ error: 'Gagal menambah satuan', detail: err.message });
  }
};


// PUT edit data
export const updateSatuanStock = async (req, res) => {
  const { kode } = req.params;
  const { KETERANGAN } = req.body;
  try {
    await db('satuanstock').where({ KODE: kode }).update({ KETERANGAN });
    res.json({ message: 'Satuan berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengedit satuan', detail: err.message });
  }
};

// DELETE hapus data
export const deleteSatuanStock = async (req, res) => {
  const { kode } = req.params;
  try {
    await db('satuanstock').where({ KODE: kode }).del();
    res.json({ message: 'Satuan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus satuan', detail: err.message });
  }
};

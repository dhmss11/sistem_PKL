import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";

export const fetchAllStock = async (req, res) => {
    try {
        const data = await db('stock').select([
            'gudang',
            'KODE',
            'KODE_TOKO',
            'NAMA',
            'JENIS',
            'GOLONGAN',
            'RAK',
            'DOS',
            'SATUAN',
            'ISI',
            'DISCOUNT',
            'HB',
            'HJ',
            'EXPIRED',
            'TGL_MASUK',
            'BERAT'
        ]);

       if (!data || data.length === 0) {
            return res.status(404).json ({
                status : status.GAGAL,
                message : 'Data stock kosong',
                datetime:datetime(),
                data:[],
            });
        }

        return res.status(200).json({
            status: status.SUKSES,
            message : 'Berhasil ambil data stock',
            datetime : datetime(),
            data,
        });
    } catch (error) {
        console.error('Error ambil data stock:',error.message);
        return res.status(500).json({
            status:status.ERROR,
            message : 'Terjadi kesalahan server',
            datetime : datetime(),
            error:error.message,
        });
    }
};

export const addStock = async (req, res) => {
    try {
        const {
            gudang,
            KODE,
            KODE_TOKO,
            NAMA,
            JENIS,
            GOLONGAN,
            RAK,
            DOS,
            SATUAN,
            ISI,
            DISCOUNT,
            HB,
            HJ,
            EXPIRED,
            TGL_MASUK,
            BERAT
        } = req.body;

        await db('stock').insert({
            gudang, 
            KODE,
            KODE_TOKO,
            NAMA,
            JENIS,
            GOLONGAN,
            RAK,
            DOS,
            SATUAN,
            ISI,
            DISCOUNT,
            HB,
            HJ,
            EXPIRED,
            TGL_MASUK,
            BERAT
        });

        return res.status(201).json({
            status: status.SUKSES,
            message: 'Data stock berhasil ditambahkan',
            datetime: datetime(),
        });
    } catch (error) {
        console.error('Error tambah stock:', error.message);
        return res.status(500).json({
            status: status.ERROR,
            message: 'gagal menambahkan data stock',
            datetime: datetime(),
            error: error.message,
        });
    }
};
export const editStock = async (req, res) => {
  try {
    const { id } = req.params; // ini asumsinya adalah KODE, bukan kolom id

    const {
      gudang, KODE, KODE_TOKO, NAMA, JENIS, GOLONGAN,
      RAK, DOS, SATUAN, ISI, DISCOUNT, HB, HJ, BERAT
    } = req.body;

    await db('stock')
      .where({ KODE: id }) // ganti ini ya
      .update({
        gudang, KODE, KODE_TOKO, NAMA, JENIS, GOLONGAN,
        RAK, DOS, SATUAN, ISI, DISCOUNT, HB, HJ,BERAT
      });

    return res.json({
      status: status.SUKSES,
      message: 'Data stock berhasil diperbarui',
      datetime: datetime()
    });
  } catch (error) {
    console.error('Error editStock:', error.message);
    return res.status(500).json({
      status: status.GAGAL,
      message: 'Gagal mengedit data stock',
      error: error.message,
      datetime: datetime()
    });
  }
};

export const deleteStock = async (req, res) => {
  const { id } = req.params;

  try {

    const deleted = await db('stock').where({ KODE: id }).del();

    if (deleted) {
      return res.json({
        status: status.SUKSES,
        message: 'Stock berhasil dihapus',
        datetime: datetime(),
      });
    } else {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: 'Stock tidak ditemukan',
        datetime: datetime(),
      });
    }

  } catch (error) {
    console.error('❌ Gagal hapus stock:', error.message);
    return res.status(500).json({
      status: status.GAGAL,
      message: 'Gagal menghapus stock',
      datetime: datetime(),
      error: error.message,
    });
  }
};
export const fetchStockBySatuan = async (req, res) => {
  console.log('Masuk fetchStockBySatuan:', req.params);

  try {
    const { satuan } = req.params;
    if (!satuan) {
      return res.status(400).json({ status: '99', message: 'Satuan kosong' });
    }

    const result = await db('stock').where({ satuan });

    return res.status(200).json({ status: '00', data: result });
  } catch (error) {
    console.error('Error fetchStockBySatuan:', error);
    return res.status(500).json({ status: '99', message: 'Gagal mengambil data' });
  }
};

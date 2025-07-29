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
    const { id } = req.params;

    const {
      gudang, KODE, KODE_TOKO, NAMA, JENIS, GOLONGAN,
      RAK, DOS, SATUAN, ISI, DISCOUNT, HB, HJ,
      EXPIRED, TGL_MASUK, BERAT
    } = req.body;

    await db('stock')
      .where({ id })
      .update({
        gudang, KODE, KODE_TOKO, NAMA, JENIS, GOLONGAN,
        RAK, DOS, SATUAN, ISI, DISCOUNT, HB, HJ,
        EXPIRED, TGL_MASUK, BERAT,
        updated_at: datetime()
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
    const deleted = await db('stock').where({ id }).del();

    if (deleted) {
      return res.json({
        status: status.SUKSES,
        message: 'stock berhasil dihapus',
        datetime: datetime(),
      });
    } else {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: 'stock tidak ditemukan',
        datetime: datetime(),
      });
    }

  } catch (error) {
    console.error('Error deleting stock:', error);
    return res.status(500).json({
      status: status.GAGAL,
      message: 'Gagal menghapus stock',
      datetime: datetime(),
    });
  }
};

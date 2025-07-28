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

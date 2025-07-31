import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";
import { addJenisGudangSchema,updateJenisGudangSchema } from "../schemas/golonganstockScema.js";

export const fetchAlljenisgudang = async (req,res) => {
    try {
        const data = await db('golonganstock').select('KODE','KETERANGAN');
        
        if (!data || data.length === 0) {
            return res.status(404).json ({
                status : status.GAGAL,
                message : 'Data jenis kosong',
                datetime:datetime(),
                data:[],
            });
        }

        return res.status(200).json({
            status: status.SUKSES,
            message : 'Berhasil ambil data jenis gudang',
            datetime : datetime(),
            data,
        });
    } catch (error) {
        console.error('Error ambil jenis gudang :',error.message);
        return res.status(500).json({
            status:status.ERROR,
            message : 'Terjadi kesalahan server',
            datetime : datetime(),
            error:error.message,
        });
    }
};

export const fetchAllKeteranganGolongan = async (req, res) => {
  try {
    const data = await db('golonganstock').distinct('KETERANGAN');

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: status.GAGAL,
        message: 'Data keterangan kosong',
        datetime: datetime(),
        data: [],
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: 'Berhasil ambil data keterangan golongan stock',
      datetime: datetime(),
      data,
    });
  } catch (error) {
    console.error('Error ambil keterangan golongan:', error.message);
    return res.status(500).json({
      status: status.ERROR,
      message: 'Terjadi kesalahan server',
      datetime: datetime(),
      error: error.message,
    });
  }
};

export const createJenisGudang = async (req, res) => {
  try {
    const validation = addJenisGudangSchema.safeParse(req.body);

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

    const { KODE, KETERANGAN } = validation.data;


    const existing = await db('golonganstock').where({ KODE }).first();
    if (existing) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: 'Kode jenis gudang sudah digunakan',
        datetime: datetime(),
      });
    }
    const [id] = await db('golonganstock').insert({ KODE, KETERANGAN }).returning('id');

    return res.status(201).json({
      status: status.SUKSES,
      message: 'Jenis gudang berhasil ditambahkan',
      datetime: datetime(),
      data: { id, KODE, KETERANGAN },
    });
  } catch (error) {
    console.error('Error tambah jenis gudang:', error.message);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Gagal menambahkan jenis gudang: ${error.message}`,
      datetime: datetime(),
    });
  }
};

export const editJenisGudang = async (req, res) => {
  const { id } = req.params;

  const parsed = updateJenisGudangSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: status.GAGAL,
      message: 'Validasi gagal',
      error: parsed.error.flatten(),
      datetime: datetime(),
    });
  }

  const { KODE, KETERANGAN } = parsed.data;

  try {
    const updated = await db('golonganstock').where('id', id).update({ KODE, KETERANGAN });

    if (!updated) {
      return res.status(404).json({
        status: status.GAGAL,
        message: 'Jenis gudang tidak ditemukan',
        datetime: datetime(),
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: 'Berhasil mengubah jenis gudang',
      datetime: datetime(),
    });
  } catch (error) {
    console.error('Error edit jenis gudang:', error.message);
    return res.status(500).json({
      status: status.ERROR,
      message: `Gagal mengubah jenis gudang: ${error.message}`,
      datetime: datetime(),
    });
  }
};
export const deleteJenisGudang = async (req,res) => {
    const {id} = req.params;

    try {
        const deleted = await db('golonganstock').where('id',id).del();

        if (!deleted) {
            return res.status(404).json({
                status : status.GAGAL,
                message : 'Jenis gudang tidak ditemukan',
                datetime : datetime(),
            });
        }

        return res.status(200).json({
            status : status.SUKSES,
            message : 'Berhasil mengahpus jenis gudang',
            datetime : datetime(),
        });
    }catch (error) {
        console.error('Error hapus jenis gudang :',error.message);
        return res.status(500).json({
            status : status.ERROR,
            message : `Gagal menghapus jenis gudang : ${error.message}`,
            datetime : datetime(),
        });
    }
};

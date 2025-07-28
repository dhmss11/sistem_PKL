import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";

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


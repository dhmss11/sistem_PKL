import { countGudangByJenis } from '../models/jenisGudangModel.js';
import { status, datetime } from '../utils/general.js';

export const getJumlahGudangPerJenis = async (req, res) => {
  try {
    const data = await countGudangByJenis();
    res.json({
      status: status.SUKSES,
      message: 'Berhasil mengambil jumlah gudang per jenis',
      datetime: datetime(),
      data
    });
  } catch (err) {
    res.status(500).json({
      status: status.GAGAL,
      message: err.message,
      datetime: datetime(),
    });
  }
};

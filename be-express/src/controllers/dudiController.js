import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";
import jwt from "jsonwebtoken";


// const token = localStorage.getItem('token'); 
// const res = await fetch('/api/dudi', {
//   method: 'POST',
//   headers: { 
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`   
//   },
//   body: JSON.stringify(form),
// });


export const fetchAllDudi = async (req, res) => {
    try {
        const dudi = await db("dudi")
            .select('*')
            .whereNull('deleted_at')
            .orderBy('created_at', 'desc');

        res.status(200).json({
            status: status.SUKSES,
            message: "Data DUDI berhasil diambil",
            data: dudi,
            datetime: datetime(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: status.ERROR,
            message: "Gagal mengambil data DUDI",
            datetime: datetime(),
        });
    }
};

export const getDudiStats = async (req, res) => {
  try {
    const total = await db("dudi").whereNull("deleted_at").count("* as total").first();
    const aktif = await db("dudi").where({ status: "Aktif" }).whereNull("deleted_at").count("* as total").first();
    const tidakAktif = await db("dudi").where({ status: "Tidak Aktif" }).whereNull("deleted_at").count("* as total").first();
    const siswaMagang = await db("siswa").whereNull("deleted_at").count("* as total").first();

    res.status(200).json({
      status: status.SUKSES,
      message: "Statistik DUDI berhasil diambil",
      data: {
        total_dudi: total.total,
        dudi_aktif: aktif.total,
        dudi_tidak_aktif: tidakAktif.total,
        total_siswa_magang: siswaMagang.total,
      },
      datetime: datetime(),
    });
  } catch (err) {
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal menghitung statistik DUDI",
      error: err.message,
      datetime: datetime(),
    });
  }
};

export const createDudi = async (req, res) => {
  try {
    const user_id = 1; 

    const { nama_perusahaan, alamat, email, tlpn, pj, statuss } = req.body;

    await db("dudi").insert({
      nama_perusahaan,
      alamat,
      email,
      tlpn,
      pj,
      statuss,
      user_id,        
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    res.status(201).json({ status: '00', message: 'DUDI berhasil ditambahkan' });
  } catch (err) {
    console.error('Create DUDI error:', err.message);
    res.status(500).json({ status: '99', message: 'Gagal menambahkan DUDI', error: err.message });
  }
};



export const updateDudi = async (req, res) => {
  try {
    const { nama_perusahaan, alamat, email, tlpn, pj, statuss } = req.body;

    if (!id) {
      return res.status(400).json({
        status: status.ERROR,
        message: "ID DUDI tidak ditemukan",
        datetime: datetime(),
      });
    }

    const existingDudi = await db("dudi")
      .where({ id })
      .whereNull("deleted_at")
      .first();

    if (!existingDudi) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "DUDI tidak ditemukan",
        datetime: datetime(),
      });
    }

    // Validation
    if (!nama_perusahaan) {
      return res.status(400).json({
        status: status.ERROR,
        message: "Nama perusahaan wajib diisi",
        datetime: datetime(),
      });
    }

    // Check if company name already exists (excluding current record)
    const duplicateDudi = await db("dudi")
      .where({ nama_perusahaan })
      .whereNot({ id })
      .whereNull("deleted_at")
      .first();

    if (duplicateDudi) {
      return res.status(400).json({
        status: status.ERROR,
        message: "Nama perusahaan sudah terdaftar",
        datetime: datetime(),
      });
    }

    const [updatedDudi] = await db("dudi")
      .where({ id })
      .update({
        nama_perusahaan,
        alamat: alamat || null,
        email: email || null,
        tlpn: tlpn || null,
        pj: pj || null,
        statuss: statuss || 'aktif',
        updated_at: db.fn.now(),
      })
      .returning('*');

    res.status(200).json({
      status: status.SUKSES,
      message: "DUDI berhasil diperbarui",
      data: updatedDudi,
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Update DUDI error:", err.message);
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal update DUDI",
      error: err.message,
      datetime: datetime(),
    });
  }
};


export const deleteDudi = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await db("dudi").where({ id }).first();
    if (!exists) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "DUDI tidak ditemukan",
        datetime: datetime(),
      });
    }

    await db("dudi").where({ id }).del();

    res.status(200).json({
      status: status.SUKSES,
      message: "DUDI berhasil dihapus permanen",
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Delete DUDI error:", err.message);
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal menghapus DUDI",
      datetime: datetime(),
    });
  }
};

export const getDashboardAdmin = async (req, res) => {
  try {
    const totalSiswaResult = await db.query(`SELECT COUNT(*) FROM siswa`);
    const totalSiswa = parseInt(totalSiswaResult.rows[0].count);

    const dudiPartnerResult = await db.query(`SELECT COUNT(*) FROM dudi WHERE status='Aktif'`);
    const dudiPartner = parseInt(dudiPartnerResult.rows[0].count);

    const siswaMagangResult = await db.query(`SELECT COUNT(*) FROM magang WHERE status='Aktif'`);
    const siswaMagang = parseInt(siswaMagangResult.rows[0].count);

    const today = dayjs().format('YYYY-MM-DD');
    const logbookHariIniResult = await db.query(
      `SELECT COUNT(*) FROM logbook WHERE tanggal = $1`,
      [today]
    );
    const logbookHariIni = parseInt(logbookHariIniResult.rows[0].count);

    const stats = { totalSiswa, dudiPartner, siswaMagang, logbookHariIni };

    // --- Magang Terbaru (limit 5) ---
    const magangTerbaruResult = await db.query(`
      SELECT s.nama AS siswa, d.nama AS perusahaan, m.tanggal_mulai, m.tanggal_selesai, m.status
      FROM magang m
      JOIN siswa s ON m.siswa_id = s.id
      JOIN dudi d ON m.dudi_id = d.id
      ORDER BY m.tanggal_mulai DESC
      LIMIT 5
    `);
    const magangTerbaru = magangTerbaruResult.rows.map(row => ({
      siswa: row.siswa,
      perusahaan: row.perusahaan,
      tanggalMulai: dayjs(row.tanggal_mulai).format('YYYY-MM-DD'),
      tanggalSelesai: dayjs(row.tanggal_selesai).format('YYYY-MM-DD'),
      status: row.status
    }));

    // --- DUDI Aktif ---
    const dudiAktifResult = await db.query(`
      SELECT d.id, d.nama, d.alamat, d.tlpn, COUNT(m.siswa_id) AS jumlah_siswa
      FROM dudi d
      LEFT JOIN magang m ON d.id = m.dudi_id AND m.status='Aktif'
      WHERE d.status='Aktif'
      GROUP BY d.id
      ORDER BY d.nama ASC
    `);
    const dudiAktif = dudiAktifResult.rows.map(row => ({
      nama: row.nama,
      alamat: row.alamat,
      tlpn: row.tlpn,
      jumlah_siswa: parseInt(row.jumlah_siswa)
    }));

    // --- Logbook Terbaru (limit 5) ---
    const logbookTerbaruResult = await db.query(`
      SELECT l.judul, l.tanggal, l.kendala, l.status
      FROM logbook l
      ORDER BY l.tanggal DESC
      LIMIT 5
    `);
    const logbookTerbaru = logbookTerbaruResult.rows.map(row => ({
      judul: row.judul,
      tanggal: dayjs(row.tanggal).format('YYYY-MM-DD'),
      kendala: row.kendala,
      status: row.status
    }));

    return res.status(200).json({
      status: 200,
      message: 'Dashboard DUDI fetched successfully',
      data: { stats, magangTerbaru, dudiAktif, logbookTerbaru }
    });
  } catch (error) {
    console.error('Error fetching dashboard DUDI admin:', error);
    return res.status(500).json({
      status: 500,
      message: 'Gagal memuat dashboard',
      error: error.message
    });
  }
};

export const getDudiSummary = async (req, res) => {
    try {
        const totalResult = await pool.query('SELECT COUNT(*) FROM dudi');
        const aktifResult = await pool.query("SELECT COUNT(*) FROM dudi WHERE status = 'Aktif'");

        const total = parseInt(totalResult.rows[0].count);
        const aktif = parseInt(aktifResult.rows[0].count);
        const tidak = total - aktif;

        // Optional: total siswa magang
        const siswaResult = await pool.query('SELECT COUNT(*) FROM magang');
        const siswa = parseInt(siswaResult.rows[0].count);

        res.json({
            status: 'success',
            data: { total, aktif, tidak, siswa }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil summary DUDI' });
    }
};
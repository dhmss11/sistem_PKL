import { db } from "../core/config/knex.js";

// ========== KIRIM BARANG ==========
export const createMutasiGudangKe = async (req, res) => {
    const { tgl, gudang_kirim, gudang_terima, kode, qty, barcode, satuan, username } = req.body;

    try {
        const [last] = await db('mutasigudang_ke').orderBy('id','desc').limit(1);
        const nextId = last ? last.id + 1 : 1;
        const faktur = `MK${String(nextId).padStart(6, '0')}`;

        await db('mutasigudang_ke').insert({
            FAKTUR: faktur,
            TGL: tgl,
            GUDANG_KIRIM: gudang_kirim,
            GUDANG_TERIMA: gudang_terima,
            KODE: kode,
            QTY: qty,
            BARCODE: barcode,
            SATUAN: satuan,
            USERNAME: username,
            STATUS: 'PENDING'
        });

        // Kurangi stok di gudang asal
        await db('stock')
            .where({ KODE: kode, BARCODE: barcode, GUDANG: gudang_kirim })
            .decrement('QTY', qty);

        // Catat ke kartu stock
        await db('kartu_stock').insert({
            STATUS: 'MUTASI_KE',
            FAKTUR: faktur,
            TGL: tgl,
            GUDANG: gudang_kirim,
            KODE: kode,
            QTY: qty,
            DEBET: 0,
            KREDIT: qty,
            USERNAME: username,
            KETERANGAN: `KIRIM KE ${gudang_terima}`
        });

        res.json({ status: '00', message: 'Mutasi gudang ke berhasil dibuat', faktur });
    } catch (err) {
        console.error(err);
        res.status(500).json({status: '99', message: 'error create mutasi gudang ke'});
    }
};

// ========== TERIMA BARANG ==========
export const createMutasiGudangDari = async (req, res) => {
    const { faktur_kirim, tgl, gudang_kirim, gudang_terima, kode, qty, barcode, satuan, username } = req.body;

    try {
        const [last] = await db('mutasigudang_dari').orderBy('id','desc').limit(1);
        const nextId = last ? last.id + 1 : 1;
        const faktur = `MD${String(nextId).padStart(6, '0')}`;

        await db('mutasigudang_dari').insert({
            FAKTUR: faktur,
            FAKTUR_KIRIM: faktur_kirim,
            TGL: tgl,
            GUDANG_KIRIM: gudang_kirim,
            GUDANG_TERIMA: gudang_terima,
            KODE: kode,
            QTY: qty,
            BARCODE: barcode,
            SATUAN: satuan,
            USERNAME: username,
        });

        // Update status mutasi ke jadi diterima
        await db('mutasigudang_ke')
            .where({ FAKTUR: faktur_kirim })
            .update({ STATUS: 'DITERIMA' });

        // Tambahkan stok ke gudang tujuan
        const exist = await db('stock').where({ KODE: kode, BARCODE: barcode, GUDANG: gudang_terima }).first();
        if (exist) {
            await db('stock')
                .where({ KODE: kode, BARCODE: barcode, GUDANG: gudang_terima })
                .increment('QTY', qty);
        } else {
            await db('stock').insert({
                GUDANG: gudang_terima,
                KODE: kode,
                NAMA: '-', // ideally ambil dari tabel barang
                JENIS: '-',
                BARCODE: barcode,
                QTY: qty,
                SATUAN: satuan,
                TGL_MASUK: tgl
            });
        }

        // Catat ke kartu stock
        await db('kartu_stock').insert({
            STATUS: 'MUTASI_DARI',
            FAKTUR: faktur,
            TGL: tgl,
            GUDANG: gudang_terima,
            KODE: kode,
            QTY: qty,
            DEBET: qty,
            KREDIT: 0,
            USERNAME: username,
            KETERANGAN: `TERIMA DARI ${gudang_kirim}`
        });

        res.json({ status: '00', message: 'Mutasi gudang dari berhasil diterima', faktur });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '99', message: 'error create mutasi gudang dari' });
    }
};

// ========== GET ALL ==========
export const getAllMutasiGudangKe = async (req, res) => {
    try {
        const data = await db('mutasigudang_ke').select('*').orderBy('id', 'desc');
        res.json({ status: '00', message: 'success', data });
    } catch (err) {
        res.status(500).json({ status: '99', message: 'error get data' });
    }
};

export const getAllMutasiGudangDari = async (req, res) => {
    try {
        const data = await db('mutasigudang_dari').select('*').orderBy('id','desc');
        res.json({ status: '00', message: 'success', data });
    } catch (err) {
        res.status(500).json({ status: '99', message: 'error get data' });
    }
};

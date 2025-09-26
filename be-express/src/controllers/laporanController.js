import { db } from "../core/config/knex.js"
import { status } from "../utils/general.js"

export const fetchSisaStock= async (req,res) => {
    try {
        const data = await db("stock").select([
            'KODE',
            'NAMA',
            'GUDANG',
            'BARCODE',
            'QTY',
            'SATUAN'
        ])
        if (!data || data.length == 0) {
            return res.status({status: 404}).json({
                status: status.GAGAL,
                message: 'data kosong',
                data: []

            })     
           }
        return res.status(200).json({
            status: status.SUKSES,
            message: 'Berhasil Ambil Data Laporan',
            data: data
        })
    } catch (error) {
        console.error("ERROR ambil data Laporan", error);
        return res.status(500).json({
            status: status.ERROR,
            message: 'terjadi kesalahan pada server',
            error: error.message,
        })
    }
}

export const fetchMutasiGudang = async (req,res) => {
    try {
        const data = await db("mutasigudang").select([
            "POSTING",
            "FAKTUR",
            "DARI",
            "KE",
            "BARCODE",
            "QTY"
        ])
    
    if (!data || data.length == 0) {
        return res.status(404).json({
            status: status.GAGAL,
            message: "Data Mutasi Kosong",
            data: []

        })
    }
        return res.status(200).json({
            status: status.SUKSES,
            message: "berhasil ambil data Mutasi",
            data: data,
        })
    } catch (error) {
        console.error("ERROR Get data Laporan", error.message)
        return res.status(500).json({
            status: status.ERROR,
            message: "terjadi kesalahan pada sisi server",
            error: error.message
            
        })
    }
}
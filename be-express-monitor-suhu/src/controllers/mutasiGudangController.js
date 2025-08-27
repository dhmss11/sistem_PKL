import { date } from "zod";
import {db} from "../core/config/knex.js";

export const createmutasi = async(req,res) => {
    try {
        const{nama,faktur,tgl,gudang_kirim,gudang_terima,qty,barcode,satuan,username} = req.body;

        const [id] = await db("mutasigudang_ke").insert({
            nama,faktur,tgl,gudang_kirim,gudang_terima,qty,barcode,satuan,username,
            status : "pending"
        }).returning("id");

        await db("mutasigudang").insert ({
            posting : "keluar",
            id,
            faktur,
            tgl,
            dari : gudang_kirim,
            ke : gudang_terima,
            barcode,
            qty,
            username
        });
        res.json({status : "00",message : "Mutasi berhasil dibuat",id});
    } catch (error) {
        console.error(error);
        res.status(500).json({status : "99",message : "Error create mutasi"});
    }
};

export const receivemutasi = async (req, res) => {
    try {
        const { faktur } = req.params;
        const { faktur_kirim, tgl, gudang_kirim, gudang_terima, barcode, qty, satuan, username } = req.body;

        // Update status mutasi di tabel mutasigudang_ke
        await db("mutasigudang_ke")
            .where({ faktur })
            .update({ status: "received" });

        // Insert ke tabel mutasigudang_dari
        await db("mutasigudang_dari").insert({
            faktur,
            faktur_kirim,
            tgl,
            gudang_kirim,
            gudang_terima,
            barcode,
            qty,
            satuan,
            username
        });

        // Insert ke log mutasi (history)
        await db("mutasigudang").insert({
            posting: "diterima",
            faktur,
            tgl,
            dari: gudang_kirim,
            ke: gudang_terima,
            barcode,
            qty,
            username
        });

        res.json({ status: "00", message: "Mutasi berhasil diterima" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "99", message: "Error menerima mutasi" });
    }
};

export const getAllmutasi = async (req,res) => {
    try {
        const data = await db ("mutasigudang").select("*").orderBy("tgl" , "desc");
        res.json({ status : "00" , data});
    } catch (error) {
        console.error(error);
        res.status(500).json({status : "99" , message : "Error fetch muatasi"});
    }
};

export const getAllFaktur = async (req, res) => {
    try {
        const fakturList = await db("mutasigudang")
        .select("FAKTUR","TGL")
        .orderBy("TGL","desc");

        res.status(200).json({
            status: "00",
            message: "data fakktur berhasil diambil",
            data: fakturList,
        });
    } catch (error) {
        res.status(500).json({
            status: "99",
            message: "data faktur berhasil diambil",
            data: fakturList,
        });
    } 
};
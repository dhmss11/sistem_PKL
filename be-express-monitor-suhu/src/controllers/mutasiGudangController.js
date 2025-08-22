import db from "../core/config/knex.js";
import { status } from "../utils/general.js";

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

export const receivemutasi = async (req,res) => {
    try {
        const {id} = req.params;
        const {faktur,faktur_kirim,tgl,gudang_kirim,gudang_terima,barcode,qty,satuan,username} = req.body;

        await db("mutasigudang_ke").where({id}).update({ status : "recevid" });

        await db("mutasigudang_dari").insert ({
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

        await db("mutasigudang").insert({
            posting : "diterima",
            id,
            faktur,
            tgl,
            dari : gudang_kirim,
            ke : gudang_terima,
            barcode,
            qty,
            username
        });
        res.json({status : "00" , massage : "mutasil berhasil diterima"});
    } catch (error) {
        console.error(error);
            res.status(500).json({status : "99" ,message : "Error create mutasi"});
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


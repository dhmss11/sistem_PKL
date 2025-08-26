import {db} from "../core/config/knex.js";
import { format } from "date-fns";

export const createmutasi = async(req,res) => {
    try {
        const{nama,faktur,tgl,gudang_kirim,gudang_terima,qty,barcode,satuan,username} = req.body;

        const [id] = await db("mutasigudang_ke").insert({
            nama,
            faktur,
            tgl,
            gudang_kirim,
            gudang_terima,
            qty,
            barcode,
            satuan,
            username,
            status : "pending"
        })

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
        const { faktur_kirim, gudang_kirim, gudang_terima, barcode, qty, satuan, username } = req.body;
        const tgl = format(new Date(), "yyyy-MM-dd HH:mm")
        
        await db.transaction(async (trx) => {
          await trx("mutasigudang_dari").insert({
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

        await trx("mutasigudang").insert({
            posting: "masuk",
            faktur,
            tgl,
            dari: gudang_kirim,
            ke: gudang_terima,
            barcode,
            qty,
            username
        });
        await trx("mutasigudang_ke")
        .where({ faktur })
        .update({ status: "received" });

        })
        

        res.json({ status: "00", message: "Mutasi berhasil diterima",faktur});
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
export const getPendingMutasi = async (req, res) => {
  try {
    const data = await db("mutasigudang_ke")
      .where({ status: "pending" })
      .select(
        "faktur",
        "nama",
        "tgl",
        "gudang_kirim",
        "gudang_terima",
        "qty",
        "barcode",
        "satuan",
        "username",
        "status"
      )
      .orderBy("tgl", "desc");

    res.json({ status: "00", data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "99", message: "Error getPendingMutasi", error: error.message });
  }
};
export const getMutasiByFaktur = async (req, res) => {
  try {
    const { faktur } = req.params;

    const data = await db("mutasigudang_ke") // ganti sesuai nama tabel
      .where({ faktur })
      .first();

    if (!data) {
      return res.status(404).json({ status: "99", message: "Mutasi tidak ditemukan" });
    }

    res.json({ status: "00", data });
  } catch (error) {
    console.error("Error getMutasiByFaktur:", error);
    res.status(500).json({ status: "99", message: "Error fetch mutasi by faktur" });
  }
};



import {db} from "../core/config/knex.js";

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

export const updateStatusMutasi = async (req, res) => {
  try {
    const { faktur } = req.params;

    const updated = await db("mutasigudang_ke")
      .where({ faktur })
      .update({ status: "received" });

    if (!updated) {
      return res.status(404).json({ status: "99", message: "Faktur tidak ditemukan" });
    }

    res.json({ status: "00", message: "Status mutasi berhasil diupdate", faktur });
  } catch (error) {
    console.error("Error updateStatusMutasi:", error);
    res.status(500).json({ status: "99", message: "Error update status mutasi", error: error.message });
  }
};


export const receivemutasi = async (req, res) => {
    try {
        const { faktur } = req.params;
        const { faktur_kirim, tgl, gudang_kirim, gudang_terima, barcode, qty, satuan, username } = req.body;

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



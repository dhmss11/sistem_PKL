import { json } from "sequelize";
import {db} from "../core/config/knex.js";
import { format } from "date-fns";

export const createmutasi = async(req,res) => {
    try {
        const{nama,faktur,tgl,gudang_kirim,gudang_terima,qty,barcode,satuan,username} = req.body;

        const validasiStockObj = await db("stock").where({  barcode }).select("QTY").first();
        const validasiStock = validasiStockObj.QTY
        const isValid = qty > validasiStock 

      const sisaStock = Math.max(validasiStock - qty,0)

        if (isValid) {
          return res.status(400).json({
            status: '99',
            message: 'stock tidak mencukupi'
          })
        }
        await db.transaction(async (trx) => { 
          await trx("mutasigudang_ke").insert({
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

        await trx("mutasigudang").insert ({
            posting : "keluar",
            faktur,
            nama,
            tgl,
            dari : gudang_kirim,
            ke : gudang_terima,
            barcode,
            qty,
            username
        });

        await trx("stock")
        .where({ barcode })
        .update({ qty: sisaStock})
         
      })
        res.json({status : "00",message : "Mutasi berhasil dibuat"});
    } catch (error) {
        console.error(error);
        res.status(500).json({status : "99",message : "Error create mutasi"});
    }
};



export const receivemutasi = async (req, res) => {
    try {
        const { faktur } = req.params;
        const { nama, faktur_kirim, gudang_kirim, gudang_terima, barcode, qty, satuan, username } = req.body;
        const tgl = format(new Date(), "yyyy-MM-dd HH:mm");

        const mutasiKeObj = await db("mutasigudang_ke")
            .where({ faktur })
            .select("QTY")
            .first();
        const mutasiKe = Number(mutasiKeObj.QTY)
        if (typeof qty !== 'number' || qty <= 0) {
            return res.status(400).json({ status: "99", message: "Qty harus berupa angka lebih dari 0" });
        }
        const isValid =  qty > mutasiKe
        if (isValid) {
          return res.status(400).json({
            status: '99',
            message: 'jumlah yang anda terima melebihi jumlah yang dikirim'
          })
        }
        const validasiStock = await db("stock").where({  barcode }).select("QTY").first();
        const sisaStock = Number(validasiStock.QTY)
        const updateSisaStock = Math.max(mutasiKe - qty, 0)
        const updateStock = Math.max(sisaStock + updateSisaStock,0)
        console.log(updateStock) 
        
        await db.transaction(async (trx) => {
            await trx("mutasigudang_dari").insert({
                faktur,
                nama,
                faktur_kirim,
                tgl,
                gudang_kirim,
                gudang_terima,
                barcode,
                qty,
                satuan,
                username,
            });

            await trx("mutasigudang").insert({
                posting: "masuk",
                nama,
                faktur,
                tgl,
                dari: gudang_kirim,
                ke: gudang_terima,
                barcode,
                qty,
                username, 
            });

            await trx("mutasigudang_ke")
                .where({ faktur })
                .update({ status: "received", qty });

            await trx("mutasigudang")
                .where({ faktur, posting: "keluar" })
                .update({ qty });

            await trx("stock")
              .where({ barcode })
              .update ({ qty:updateStock})

              
        });

        res.json({ status: "00", message: "Mutasi berhasil diterima", faktur });
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



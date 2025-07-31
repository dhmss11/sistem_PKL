export const API_URL = process.env.API_URL;

export const API_ENDPOINTS = {
  // RAK
  GET_ALL_RAK: `${API_URL}/rak`,
  GET_RAK_BY_KODE: (kode) => `${API_URL}/rak/${kode}`,
  ADD_RAK: `${API_URL}/rak/create`,
  EDIT_RAK: (kode) => `${API_URL}/rak/edit/${kode}`,
  DELETE_RAK: (kode) => `${API_URL}/rak/delete/${kode}`,
  GET_PRODUK_BY_RAK: (kode) => `${API_URL}/rak/${kode}/produk`,

 //SATUAN
  GET_ALL_SATUAN: `${API_URL}/satuan`,
  GET_SATUAN_BY_KODE: (kode) => `${API_URL}/satuan/${kode}`,
  ADD_SATUAN: `${API_URL}/satuan/create`,
  EDIT_SATUAN: (kode) => `${API_URL}/satuan/edit/${kode}`,
  DELETE_SATUAN: (kode) => `${API_URL}/satuan/delete/${kode}`,
  GET_PRODUK_BY_SATUAN: (kode) => `${API_URL}/satuan/${kode}/produk`,

  // PRODUK
  GETALLPRODUK: `${API_URL}/master-produk`,
  GETPRODUKBYID: (id) => `${API_URL}/master-produk/${id}`,
  ADDPRODUK: `${API_URL}/master-produk/create`,
  EDITPRODUK: (id) => `${API_URL}/master-produk/edit/${id}`,
  DELETEPRODUK: (id) => `${API_URL}/master-produk/delete/${id}`,

  // GUDANG
  GETALLGUDANG: `${API_URL}/nama-gudang`,
  GETGUDANGBYID: (id) => `${API_URL}/nama-gudang/${id}`,
  ADDGUDANG: `${API_URL}/nama-gudang/create`,
  EDITGUDANG: (id) => `${API_URL}/nama-gudang/edit/${id}`,
  DELETEGUDANG: (id) => `${API_URL}/nama-gudang/delete/${id}`,
  GET_JUMLAH_GUDANG_PER_JENIS: (jenis) => `${API_URL}/nama-gudang/jenis/${jenis}`,
  GET_DETAIL_GUDANG_BY_JENIS: (keterangan) => `${API_URL}/nama-gudang/detail/keterangan/${keterangan}`,
  GET_NAMA_GUDANG: `${API_URL}/nama-gudang/nama`,
  GET_PRODUK_BY_GUDANG: (gudang) => `${API_URL}/master-produk/gudang/${gudang}`,

  // GOLONGAN STOCK
  GET_ALL_JENIS_GUDANG: `${API_URL}/golonganstock`,
  GET_ALL_KETERANGAN_STOCK: (keterangan) => `${API_URL}/golonganstock/keterangan/${keterangan}`,


  // STOCK
  GET_ALL_STOCK: `${API_URL}/stock`,
  ADD_STOCK: `${API_URL}/stock/add`,
  EDIT_STOCK: (id) => `${API_URL}/stock/edit/${id}`,
  DELETE_STOCK: (id) => `${API_URL}/stock/delete/${id}`,


    GET_ALL_JENIS_GUDANG : `${API_URL}/golonganstock`,
    GET_ALL_KETERANGAN_STOCK: (keterangan) => `${API_URL}/golonganstock/keterangan/${keterangan}`,
    ADD_GOLONGAN_STOCK: `${API_URL}/golonganstock/create`,
    EDIT_JENIS_GUDANG: (kode) => `${API_URL}/golonganstock/edit/${kode}`,
    DELETE_JENIS_GUDANG: (kode) => `${API_URL}/golonganstock/delete/${kode}`,
   
   GET_ALL_STOCK : `${API_URL}/stock`,
   ADD_STOCK: `${API_URL}/stock/add`,
   EDIT_STOCK: (id) => `${API_URL}/stock/edit/${id}`,
   DELETE_STOCK: (id) => `${API_URL}/stock/delete/${id}`,

};

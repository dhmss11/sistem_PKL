export const API_URL = process.env.API_URL;

export const API_ENDPOINTS = {
  GET_ALL_USERS: `${API_URL}/users`,
  GET_USER_BY_ID: (id) => `${API_URL}/users/${id}`,
  ADD_USER: `${API_URL}/users/create`,
  EDIT_USER: (id) => `${API_URL}/users/edit/${id}`,
  DELETE_USER: (id) => `${API_URL}/users/delete/${id}`,


  GET_ALL_RAK: `${API_URL}/rak`,
  GET_RAK_BY_KODE: (kode) => `${API_URL}/rak/${kode}`,
  ADD_RAK: `${API_URL}/rak/create`,
  EDIT_RAK: (kode) => `${API_URL}/rak/edit/${kode}`,
  DELETE_RAK: (kode) => `${API_URL}/rak/delete/${kode}`,
  GET_PRODUK_BY_RAK: (kode) => `${API_URL}/rak/${kode}/produk`,

  GET_ALL_SATUAN: `${API_URL}/satuan`,
  GET_SATUAN_BY_KODE: (kode) => `${API_URL}/satuan/${kode}`,
  ADD_SATUAN: `${API_URL}/satuan/create`,
  EDIT_SATUAN: (kode) => `${API_URL}/satuan/edit/${kode}`,
  DELETE_SATUAN: (kode) => `${API_URL}/satuan/delete/${kode}`,
  GET_PRODUK_BY_SATUAN: (kode) => `${API_URL}/satuan/${kode}/produk`,


  GETALLPRODUK: `${API_URL}/master-produk`,
  GETPRODUKBYID: (id) => `${API_URL}/master-produk/${id}`,
  ADDPRODUK: `${API_URL}/master-produk/create`,
  EDITPRODUK: (id) => `${API_URL}/master-produk/edit/${id}`,
  DELETEPRODUK: (id) => `${API_URL}/master-produk/delete/${id}`,

 
  GETALLGUDANG: `${API_URL}/nama-gudang`,
  GETGUDANGBYID: (id) => `${API_URL}/nama-gudang/${id}`,
  ADDGUDANG: `${API_URL}/nama-gudang/create`,
  EDITGUDANG: (id) => `${API_URL}/nama-gudang/edit/${id}`,
  DELETEGUDANG: (id) => `${API_URL}/nama-gudang/delete/${id}`,
  GET_JUMLAH_GUDANG_PER_JENIS: (jenis) => `${API_URL}/nama-gudang/jenis/${jenis}`,
  GET_DETAIL_GUDANG_BY_JENIS: (keterangan) => `${API_URL}/nama-gudang/detail/keterangan/${keterangan}`,
  GET_NAMA_GUDANG: `${API_URL}/nama-gudang/nama`,
  GET_PRODUK_BY_GUDANG: (gudang) => `${API_URL}/master-produk/gudang/${gudang}`,

  GET_ALL_JENIS_GUDANG: `${API_URL}/golonganstock`,
  GET_ALL_KETERANGAN_STOCK: (keterangan) => `${API_URL}/golonganstock/keterangan/${keterangan}`,


  // STOCK
  GET_ALL_STOCK: `${API_URL}/stock`,
  ADD_STOCK: `${API_URL}/stock/add`,
  EDIT_STOCK: (id) => `${API_URL}/stock/edit/${id}`,
  DELETE_STOCK: (id) => `${API_URL}/stock/delete/${id}`,

    // JENIS GUDANG
    GET_ALL_JENIS_GUDANG : `${API_URL}/golonganstock`,
    GET_ALL_KETERANGAN_STOCK: (keterangan) => `${API_URL}/golonganstock/keterangan/${keterangan}`,
    ADD_GOLONGAN_STOCK: `${API_URL}/golonganstock/create`,
    EDIT_JENIS_GUDANG: (kode) => `${API_URL}/golonganstock/edit/${kode}`,
    DELETE_JENIS_GUDANG: (kode) => `${API_URL}/golonganstock/delete/${kode}`,

    // KARTU STOCK
    GET_ALL_KARTUSTOCK: `${API_URL}/kartustock`,
    ADD_KARTUSTOCK: `${API_URL}/kartustock/add`,
    EDIT_KARTUSTOCK: (id) => `${API_URL}/kartustock/edit/${id}`,
    DELETE_KARTUSTOCK: (id) => `${API_URL}/kartustock/${id}`,



};

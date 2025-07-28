export const API_URL = process.env.API_URL;

export const API_ENDPOINTS = {

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
   GET_DETAIL_GUDANG_BY_JENIS: (jenis) => `${API_URL}/nama-gudang/detail/jenis/${jenis}`,

   GET_NAMA_GUDANG: `${API_URL}/nama-gudang/nama`,
   GET_PRODUK_BY_GUDANG: (gudang) => `${API_URL}/master-produk/gudang/${gudang}`,

   GET_ALL_JENIS_GUDANG : `${API_URL}/golonganstock`,
   
   GET_ALL_STOCK : `${API_URL}/stock`,
   ADD_STOCK: `${API_URL}/stock/add`
};

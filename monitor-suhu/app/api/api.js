export const API_URL = process.env.API_URL;

export const API_ENDPOINTS = {
    
    GETALLMESIN: `${API_URL}/master-mesin`,
    GETMESINBYID: (id) => `${API_URL}/master-mesin/${id}`,
    ADDMESIN: `${API_URL}/master-mesin/create`,
    EDITMESIN: (id) => `${API_URL}/master-mesin/edit/${id}`,
    DELETEMESIN: (id) => `${API_URL}/master-mesin/delete/${id}`,

    GETALLMONITORSUHU: `${API_URL}/monitor-suhu`,
    IMPORTEXCEL: `${API_URL}/monitor-suhu/import`,
    GETMONITORSUHUBYID: (id) => `${API_URL}/monitor-suhu/${id}`,
    ADDMONITORSUHU: `${API_URL}/monitor-suhu/create`,
    EDITMONITORSUHU: (id) => `${API_URL}/monitor-suhu/edit/${id}`,
    DELETEMONITORSUHU: (id) => `${API_URL}/monitor-suhu/delete/${id}`,

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

     GETALL_JENIS_GUDANG: `${API_URL}/jenis-gudang`,
  GET_JENIS_GUDANG_BY_ID: (id) => `${API_URL}/jenis-gudang/${id}`,
  CREATE_JENIS_GUDANG: `${API_URL}/jenis-gudang/create`,
  UPDATE_JENIS_GUDANG: (id) => `${API_URL}/jenis-gudang/edit/${id}`,
  DELETE_JENIS_GUDANG: (id) => `${API_URL}/jenis-gudang/delete/${id}`,
};

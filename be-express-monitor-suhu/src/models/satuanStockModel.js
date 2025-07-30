import { db } from "../core/config/knex.js";

export const findAllSatuan = () => {
  return db('satuanstock').select('*');
};

export const insertSatuan = (data) => {
  return db('satuanstock').insert(data);
};

export const updateSatuanByKode = (kode, data) => {
  return db('satuanstock').where({ KODE: kode }).update(data);
};

export const deleteSatuanByKode = (kode) => {
  return db('satuanstock').where({ KODE: kode }).del();
};

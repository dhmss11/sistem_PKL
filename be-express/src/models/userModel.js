import { db } from '../core/config/knex.js';

// Ambil semua user (termasuk profile_image)
export const getAllUsers = () => {
  return db('users').select('id', 'email', 'name', 'role',);
};

// Cari user berdasarkan email
export const getUserByEmail = (email) => {
  return db('users').where({ email }).first();
};

// Cari user berdasarkan name
export const getUserByName = (name) => {
  return db('users').where({ name }).first();
};

// Cari user berdasarkan id
export const getUserById = (id) => {
  return db('users').where({ id }).first();
};

// Update data user by id (flexible update)
export const updateUserById = (id, data) => {
  return db('users').where({ id }).update(data).returning('*');
};

// Tambah user baru
export const addUser = (data) => {
  return db('users').insert(data).returning('*');
};

// Cari user by email/name
export const getUserByEmailOrName = (emailOrName) => {
  return db('users')
    .where({ email: emailOrName })
    .orWhere({ name: emailOrName })
    .first();
};

// Hapus user
export const deleteUser = (id) => {
  return db('users').where({ id }).del();
};

export const updatePassword = (id, password) => {
  return db('users').where({ id }).update({ password }).returning('*');
};

export const updateProfile = (id, data) => {
  const allowedFields = ['name'];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  return db('users').where({ id }).update(updateData).returning('*');
};

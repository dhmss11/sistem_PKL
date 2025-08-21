import { db } from '../core/config/knex.js';

export const getAllUsers = () => {
  return db('users').select('id', 'email', 'username', 'no_hp', 'role', 'profile_image');
};

export const getUserByEmail = (email) => {
  return db('users').where({ email }).first();
};

export const getUserByUsername = (username) => {
  return db('users').where({ username }).first();
};

export const getUserById = (id) => {
  return db('users').where({ id }).first();
};

export const updateUserById = (id, data) => {
  return db('users').where({ id }).update(data);
};

export const addUser = (data) => {
  return db('users').insert(data).returning('*');
};

export const getUserByEmailOrUsername = (emailOrUsername) => {
  return db('users')
    .where({ email: emailOrUsername })
    .orWhere({ username: emailOrUsername })
    .first();
};

export const deleteUser = (id) => {
  return db('users').where({ id }).del();
};

export const updatePassword = (id, password) => {
  return db('users').where({ id }).update({ password });
};

export const updateProfile = (id, data) => {
  const allowedFields = ['username', 'no_hp', 'profile_image'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });
  
  return db('users').where({ id }).update(updateData);
};
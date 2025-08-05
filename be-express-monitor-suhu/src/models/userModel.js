import { db } from "../core/config/knex.js";

/**
 * Get all users
 **/
export const getAllUsers = async () => db("users").select("*");

/**
 * Get user by ID
 **/
export const getUserById = async (id) => db("users").where({ id }).first();

/**
 * Get user by email
 **/
export const getUserByEmail = async (email) =>
  db("users").where({ email }).first();

/**
 * Create new user
 **/
export const addUser = async ({ username, password, email, no_hp, role = "users" }) => {
  const [id] = await db("users").insert({ username, password, email, no_hp, role });
  return db("users").where({ id }).first();
};


export const updateUserById = async (id, updateData) => {
  const affected = await db("users").where({ id }).update(updateData);
  if (affected === 0) {
    throw new Error(`Gagal memperbarui user dengan ID ${id}`);
  }
  return getUserById(id);
};




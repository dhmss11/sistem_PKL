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
export const addUser = async ({ name, email, password, role = "user" }) => {
  const [id] = await db("users").insert({ name, email, password, role });
  return db("users").where({ id }).first();
};


/**
 * Update user by ID
 */
export const updateUserById = async (id, updateData) => {
  const affected = await db("users").where({ id }).update(updateData);
  if (affected === 0) {
    throw new Error(`Gagal memperbarui user dengan ID ${id}`);
  }
  return getUserById(id);
};

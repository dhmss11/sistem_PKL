import { db } from "../core/config/knex.js";
import { registerSchema, updateUserSchema } from "../schemas/updateUserSchema.js";
import { datetime, status } from "../utils/general.js";
import { hashPassword } from "../utils/hash.js";
import { getUserByEmail, getUserById, addUser, updateUserById } from "../models/userModel.js";

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await db("users").select(
      "id",
      "name",
      "email",
      "role",
    );

    res.status(200).json({
      status: status.SUKSES,
      message: "Data user berhasil diambil",
      users,
      datetime: datetime(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal mengambil data user",
      users: [],
      datetime: datetime(),
    });
  }
};


export const createUser = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Validasi gagal",
        datetime: datetime(),
        errors: validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const { name, email, password, role } = validation.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await addUser({
      name,
      email,
      password: hashedPassword,
      role: role || "siswa",
    });

    return res.status(200).json({
      status: status.SUKSES,
      message: "User berhasil ditambahkan",
      datetime: datetime(),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: status.ERROR,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

// ✅ GET detail user
export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Detail user berhasil diambil",
      datetime: datetime(),
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: status.ERROR,
      message: `Terjadi kesalahan: ${error.message}`,
      datetime: datetime(),
    });
  }
};

// ✅ UPDATE user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = updateUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Validasi gagal",
        datetime: datetime(),
        errors: validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    const { name, email, password, role } = validation.data;
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    await updateUserById(id, updateData);
    const updatedUser = await getUserById(id);

    return res.status(200).json({
      status: status.SUKSES,
      message: "User berhasil diperbarui",
      datetime: datetime(),
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: status.ERROR,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

// ✅ DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    await db("users").where({ id }).del();

    return res.status(200).json({
      status: status.SUKSES,
      message: "User berhasil dihapus",
      datetime: datetime(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: status.ERROR,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};


export const getTotalUsers = async (req, res) => {
  try {
    const data = await db("users").count("* as total").first();

    res.status(200).json({
      status: status.SUKSES,
      message: "Berhasil menghitung jumlah user",
      total: data.total,
      datetime: datetime(),
    });
  } catch (err) {
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal menghitung jumlah user",
      error: err.message,
      datetime: datetime(),
    });
  }
};
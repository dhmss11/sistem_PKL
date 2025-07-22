import { date } from "zod";
import { getAllUsers, getUserByEmail, addUser, getUserById,updateUserById } from "../models/userModel.js";
import { registerSchema, updateUserSchema } from "../schemas/updateUserSchema.js";
import { datetime, status } from "../utils/general.js";
import { hashPassword } from "../utils/hash.js";
import { db } from "../core/config/knex.js";

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    if (users.length === 0) {
    return res.status(404).json({
      status: status.NOT_FOUND,
      message: "Data user kosong",
      datetime: datetime(),
    });
  }

  return res.status(200).json({
    status: status.SUKSES,
    message: "Data user berhasil didapatkan",
    datetime: datetime(),
    users,
  });
  } catch (error) {
    res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan pada server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

export const createNewUser = async (req, res) => {
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

const newUser = await addUser({ name, email, password: hashedPassword, role });

return res.status(200).json({
  status: status.SUKSES,
  message: "Data user berhasil ditambahkan",
  datetime: datetime(),
  user: {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
},
});

  } catch (error) {
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan pada server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
export const getUserDetail = async (req, res) => {
try {
  const { id } = req.params;
  const user = await getUserById(id);

  if (!user) {
    return res.status(404).json({
      status: status.NOT_FOUND,
      message: 'User tidak ditemukan',
      datetime: datetime(),
    });
  }

  return res.status(200).json({
    status: status.SUKSES,
    message: 'Detail user berhasil didapatkan',
    datetime: datetime(),
    user,
  });
} catch (error) {
  return res.status(500).json({
    status: status.GAGAL,
    message: `Terjadi kesalahan: ${error.message}`,
    datetime: datetime(),
  });
}
};

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
      message: "Data user berhasil diperbarui",
      datetime: datetime(),
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan pada server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
export const deleteUser = async (req,res) => {
  try {
    const { id } =req.params;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: status.NOT_FOUND,
        message: 'User tidak di temukan',
        datetime: datetime(),
      });
    }

    await db("users").where({ id }).del();

    return res.status(200).json({
      status: 'User berhsil di hapus',
      datetime: datetime(),
    });
  } catch (error) {
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan pada server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
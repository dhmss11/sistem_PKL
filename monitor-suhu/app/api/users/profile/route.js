// app/api/users/profile/route.js
import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '../../api';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper function untuk mengambil user ID dari cookie
const getUserIdFromCookie = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value; // Menggunakan 'token' sesuai verify route Anda
    
    if (!token) {
      return { error: 'No token found', userId: null };
    }
    
    // Decode JWT token sesuai struktur Anda
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      userId: decoded.id, // Menggunakan 'id' sesuai struktur JWT Anda
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      error: null
    };
    
  } catch (error) {
    console.error('Error decoding token:', error);
    return {
      error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      userId: null
    };
  }
};

// Validasi helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone);
};

export const GET = async (request) => {
  try {
    const { userId, error } = await getUserIdFromCookie();
    
    if (error || !userId) {
      return NextResponse.json({
        status: '401',
        message: error || 'Unauthorized - Token tidak valid atau expired'
      }, { status: 401 });
    }

    const response = await Axios.get(API_ENDPOINTS.GET_USER_BY_ID(userId));
    
    return NextResponse.json({
      status: '00',
      message: 'Data user berhasil diambil',
      data: response.data
    });
    
  } catch (err) {
    console.error('GET /api/users/profile error:', err?.response?.data || err.message);
    
    if (err?.response?.status === 404) {
      return NextResponse.json({
        status: '404',
        message: 'User tidak ditemukan'
      }, { status: 404 });
    }
    
    if (err?.response?.status === 401) {
      return NextResponse.json({
        status: '401',
        message: 'Unauthorized'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      status: '99',
      message: 'Gagal mengambil data user',
      data: {}
    }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    const { userId, error } = await getUserIdFromCookie();
    
    if (error || !userId) {
      return NextResponse.json({
        status: '401',
        message: error || 'Unauthorized - Token tidak valid atau expired'
      }, { status: 401 });
    }

    const body = await req.json();
    const { username, email, no_hp, role } = body;

    // Validasi input
    if (!username || !email) {
      return NextResponse.json({
        status: '99',
        message: 'Username dan email harus diisi',
        data: {}
      }, { status: 400 });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return NextResponse.json({
        status: '99',
        message: 'Format email tidak valid',
        data: {}
      }, { status: 400 });
    }

    // Phone validation (optional)
    if (no_hp && !isValidPhone(no_hp)) {
      return NextResponse.json({
        status: '99',
        message: 'Format nomor telepon tidak valid (contoh: 08123456789)',
        data: {}
      }, { status: 400 });
    }

    const updateData = {
      username: username.trim(),
      email: email.trim(),
      no_hp: no_hp?.trim() || '',
      role
    };

    const response = await Axios.put(API_ENDPOINTS.EDIT_USER(userId), updateData);
    const backendData = response.data;

    return NextResponse.json({
      status: backendData.status || '00',
      message: backendData.message || 'Profil berhasil diperbarui',
      data: backendData.data || backendData
    });

  } catch (err) {
    console.error('PUT /api/users/profile error:', err?.response?.data || err.message);
    
    // Handle specific error cases dari backend
    if (err?.response?.status === 400) {
      return NextResponse.json({
        status: '99',
        message: err?.response?.data?.message || 'Data tidak valid',
        data: {}
      }, { status: 400 });
    }

    if (err?.response?.status === 401) {
      return NextResponse.json({
        status: '401',
        message: 'Unauthorized'
      }, { status: 401 });
    }

    if (err?.response?.status === 404) {
      return NextResponse.json({
        status: '404',
        message: 'User tidak ditemukan'
      }, { status: 404 });
    }

    if (err?.response?.status === 409) {
      return NextResponse.json({
        status: '99',
        message: 'Username atau email sudah digunakan'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      status: '99',
      message: err?.response?.data?.message || 'Gagal memperbarui profil',
      data: {}
    }, { status: 500 });
  }
};
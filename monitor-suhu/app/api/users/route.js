import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '../api';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLUSERS);
    return NextResponse.json({ data: response.data });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch user data' }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { status: '99', message: 'Semua field harus diisi', data: {} },
        { status: 400 }
      );
    }

    
    const response = await Axios.post(API_ENDPOINTS.ADDUSER, body);
    const backendData = response.data;

    return NextResponse.json({
      status: backendData.status || '00',
      message: backendData.message || 'User berhasil ditambahkan',
      data: backendData,
    });
  } catch (err) {
    console.error('POST /api/users error:', err?.response?.data || err.message);
    return NextResponse.json(
      { status: '99', message: 'Gagal menambahkan user', data: {} },
      { status: 500 }
    );
  }
};

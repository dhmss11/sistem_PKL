// app/api/golonganstock/route.js
import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await Axios.get(API_ENDPOINTS.GET_ALL_JENIS_GUDANG);

    return NextResponse.json({
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

  } catch (err) {
    console.error('GET golonganstock error:', err.message);
    return NextResponse.json(
      { status: '99', message: 'Gagal menggambil data master golongan' },
      { status: 500 }
    );
  }
};

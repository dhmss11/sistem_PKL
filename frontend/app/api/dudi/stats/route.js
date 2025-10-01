import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await Axios.get(API_ENDPOINTS.DUDI_STATS);
    const { status, message, data } = response.data;

    return NextResponse.json({ status, message, data }, { status: 200 });
  } catch (err) {
    console.error('Error API DUDI stats:', err?.response?.data || err.message);
    return NextResponse.json(
      { status: '99', message: 'Gagal mengambil statistik DUDI', data: {} },
      { status: 500 }
    );
  }
};

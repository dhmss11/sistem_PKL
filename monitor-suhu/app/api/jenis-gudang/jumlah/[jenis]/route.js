import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const GET = async (req, context) => {
  const { params } = context;
  const jenis = params?.jenis;

  if (!jenis) {
    return NextResponse.json(
      { status: '99', message: 'Jenis gudang tidak diberikan' },
      { status: 400 }
    );
  }

  try {
    const res = await Axios.get(API_ENDPOINTS.GET_JUMLAH_GUDANG_PER_JENIS(jenis));
    return NextResponse.json(res.data);
  } catch (err) {
    console.error('GET jumlah gudang per jenis error:', err.message);
    return NextResponse.json(
      { status: '99', message: 'Gagal mengambil jumlah gudang per jenis' },
      { status: 500 }
    );
  }
};

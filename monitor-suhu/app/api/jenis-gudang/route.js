import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';
import { status } from '../../../../be-express-monitor-suhu/src/utils/general';

export const GET = async () => {
  try {
    const res = await Axios.get(API_ENDPOINTS.GET_JENIS_GUDANG);
    return NextResponse.json(res.data);
  } catch (err) {
    console.error('GET jenis gudang error:', err.message);
    return NextResponse.json(
      { status: '99', message: 'Gagal mengambil data jenis gudang' },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
    try {
        const body = await request.json();
        const res = await Axios.post(API_ENDPOINTS.CREATE_JENIS_GUDANG, body);
        return NextResponse.json(res.data);
    } catch (err) {
        console.error('POST jenis gudang error:', err?.response?.data || err.message);
        return NextResponse.json(
            { status: '99', message: 'Gagal menambahkan jenis gudang'},
            { status: 500}
        );
    }
};
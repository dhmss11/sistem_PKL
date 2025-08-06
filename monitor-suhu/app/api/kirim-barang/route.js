import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLGUDANG);
    
    if (!response.data) {
      throw new Error('Empty response data');
    }

    const { status, message, gudang } = response.data;

    if (status !== '00') {
      return NextResponse.json(
        { status, message, gudang: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ 
      status, 
      message, 
      gudang: gudang || [] 
    });

  } catch (err) {
    console.error('GET gudang error:', err instanceof Error ? err.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        status: '99', 
        message: err instanceof Error ? err.message : 'Gagal mengambil data master gudang',
        gudang: [] 
      },
      { status: 500 }
    );
  }
};
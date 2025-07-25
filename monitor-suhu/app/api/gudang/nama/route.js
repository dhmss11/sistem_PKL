import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';


export const GET = async () => {
  try {
    const response = await Axios.get(API_ENDPOINTS.GET_NAMA_GUDANG);
    return NextResponse.json(response.data); 
  } catch (error) {
    console.error("GET nama gudang error:", error.response?.data || error.message);
    return NextResponse.json({ message: "Gagal ambil nama gudang" }, { status: 500 });
  }
};
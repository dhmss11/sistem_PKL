// app/api/dudi/route.js
import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

// ✅ GET semua DUDI
export const GET = async () => {
  try {
    const response = await Axios.get(API_ENDPOINTS.GET_ALL_DUDI);
    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    console.error("Error GET DUDI:", err?.response?.data || err.message);
    return NextResponse.json(
      {
        status: "99",
        message: "Gagal mengambil data DUDI",
        error: err?.response?.data || err.message,
      },
      { status: 500 }
    );
  }
};

// ✅ POST create DUDI
export async function POST(req) {
  try {
    const body = await req.json();
    const response = await Axios.post(API_ENDPOINTS.ADD_DUDI, body);
    return NextResponse.json(response.data, { status: response.status || 200 });
  } catch (err) {
    console.error("Error CREATE DUDI:", err?.response?.data || err.message);
    return NextResponse.json(
      { 
        status: "99", 
        message: err?.response?.data?.message || "Gagal menambahkan DUDI" 
      },
      { status: err?.response?.status || 500 }
    );
  }
}


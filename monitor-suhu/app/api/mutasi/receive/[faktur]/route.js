import axios from 'axios';
import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/app/api/api';

export async function GET(req, { params }) {
  try {
    const { faktur } = params;
    if (!faktur) {
      return NextResponse.json(
        { status: '99', message: 'Faktur tidak dikirim' },
        { status: 400 }
      );
    }

    console.log('Fetching mutasi for faktur:', faktur);
    const response = await axios.get(API_ENDPOINTS.GET_MUTASI_BY_FAKTUR(faktur));
    console.log('Mutasi fetch success:', response.status);
    return NextResponse.json(response.data);
  } catch (error) {
    const resolvedParams = await params;
    console.error('Error fetch mutasi by faktur:', {
      faktur: resolvedParams?.faktur,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });

    if (error.response?.status === 404) {
      return NextResponse.json(
        { status: '99', message: 'Mutasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: '99', message: 'Error mengambil data mutasi' },
      { status: 500 }
    );
  }
}

export async function POST(request, {params}) {
  const {faktur} =  params;

  if (!faktur) {
    return NextResponse.json(
      { status: "99", message: "Faktur tidak ditemukan di URL" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const response = await axios.post(API_ENDPOINTS.UPDATE_STATUS(faktur), body, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(
      { status: '00', message: 'Berhasil Update Status', data: response.data },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error Update Status", error.response?.data || error.message);
    return NextResponse.json(
      { status: "99", message: error.response?.data?.message || "Gagal Update Status" },
      { status: 500 }
    );
  }
}
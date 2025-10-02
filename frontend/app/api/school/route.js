import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        status: 401, 
        message: 'Token tidak ditemukan. Silakan login kembali.' 
      }, { status: 401 });
    }

    const response = await Axios.get(API_ENDPOINTS.GET_SCHOOL_SETTINGS, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const { status, message, data } = response.data;
    return NextResponse.json({ status, message, data });
  } catch (err) {
    console.error('Error API route:', err?.response?.data || err.message);
    return NextResponse.json({ 
      status: err?.response?.status || 500, 
      message: err?.response?.data?.message || 'Gagal mengambil data pengaturan sekolah' 
    }, { status: err?.response?.status || 500 });
  }
};

export const PUT = async (req) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        status: 401, 
        message: 'Token tidak ditemukan. Silakan login kembali.' 
      }, { status: 401 });
    }

    const body = await req.json();
    console.log('Frontend API received body:', body);
    
    const { 
      school_name, 
      school_abbreviation, 
      school_address, 
      school_phone, 
      school_email, 
      school_logo_url,
      website,
      kepala_sekolah,
      npsn
    } = body;

    if (!school_name) {
      return NextResponse.json(
        {
          status: '99',
          message: 'Nama sekolah wajib diisi',
          data: {},
        },
        { status: 400 }
      );
    }

    console.log('Sending to backend with token');
    const response = await Axios.put(API_ENDPOINTS.UPDATE_SCHOOL_SETTINGS, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Backend response:', response.data);
    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    console.error('PUT /api/school error:', err?.response?.data || err.message);
    console.error('Full error:', err);
    return NextResponse.json(
      {
        status: '99',
        message: err?.response?.data?.message || 'Gagal memperbarui pengaturan sekolah',
        error: err?.response?.data || err.message,
        data: {},
      },
      { status: err?.response?.status || 500 }
    );
  }
};

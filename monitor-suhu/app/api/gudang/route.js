import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const response = await Axios.get(API_ENDPOINTS.GETALLGUDANG);
        return NextResponse.json({ data: response.data });
    } catch (err) {
        console.error('GET gudang error:', err.message);
        return NextResponse.json(
            { message: 'Gagal menggambil data master gudang' },
            { status: 500 }
        );
    }
};

export const POST = async (request) => {
    try {
        const body = await request.json();
        console.log(' POST /api/gudang body:', body);

        const response = await Axios.post(API_ENDPOINTS.ADDGUDANG, body);

        console.log(' Sukses:', response.data);
        return NextResponse.json({ data: response.data });
    } catch (err) {
        console.error(' POST gudang error:', err.response?.data || err.message);
        return NextResponse.json(
            { message: 'Gagal menambahkan data master gudang' },
            { status: 500 }
        );
    }
};




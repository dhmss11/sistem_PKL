import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

/**
 * Mengambil data gudang spesifik berdasarkan jenis
 * Contoh: GET /api/gudang/detail/gudang-besi
 */
export const GET = async (req, { params }) => {
    const { jenis } = params;

    try {
        const response = await Axios.get(API_ENDPOINTS.GET_DETAIL_GUDANG_BY_JENIS(jenis));
        return NextResponse.json({ data: response.data });
    } catch (err) {
        console.error('GET detail gudang error:', err.response?.data || err.message);
        return NextResponse.json(
            { message: 'Gagal mengambil data detail gudang berdasarkan jenis' },
            { status: 500 }
        );
    }
};

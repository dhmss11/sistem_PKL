import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const PUT = async (request, { params }) => {
    try {
        const body = await request.json();
        const response = await Axios.put(API_ENDPOINTS.EDITGUDANG(params.id),body);
        return NextResponse.json({data: response.data });
    } catch (err) {
        console.error('PUT gudang error:', err.message);
        return NextResponse.json(
            { message: 'Gagal meng-update data master gudang' },
            {status: 500}
        );
    }
};
export const DELETE = async (req, { params }) => {
    try {
        const { id } = params;

        const response = await Axios.delete(API_ENDPOINTS.DELETEGUDANG(id));
        return NextResponse.json(response.data); // bisa tambahkan { status: 200 } jika perlu
    } catch (err) {
        console.error('DELETE gudang error:', err.response?.data || err.message);
        return NextResponse.json(
            { message: 'Gagal menghapus data gudang' },
            { status: 500 }
        );
    }
};

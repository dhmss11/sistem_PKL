import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

// PUT - Update satuan stock
export const PUT = async (request, { params }) => {
  const { id } = params;

  try {
    const body = await request.json();
    const response = await Axios.put(API_ENDPOINTS.EDIT_SATUAN(id), body);

    return NextResponse.json({
      status: '00',
      message: 'Satuan berhasil diupdate',
      data: response.data
    });
  } catch (err) {
    console.error('PUT satuan error:', err.message);
    return NextResponse.json(
      {
        status: '99',
        message: 'Gagal meng-update satuan'
      },
      { status: 500 }
    );
  }
};

// DELETE - Hapus satuan stock
export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    const response = await Axios.delete(API_ENDPOINTS.DELETE_SATUAN(id));

    return NextResponse.json({
      status: '00',
      message: response.data.message || 'Satuan berhasil dihapus',
    });
  } catch (error) {
    console.error('Gagal hapus satuan:', error);
    return NextResponse.json({
      status: '99',
      message: 'Gagal menghapus satuan',
    }, { status: 500 });
  }
}

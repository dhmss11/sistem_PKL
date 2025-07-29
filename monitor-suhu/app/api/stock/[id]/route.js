import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '@/app/api/api';
import { NextResponse } from 'next/server';

export const PUT = async (request, { params }) => {
  const {id} = params
  try {
    const body = await request.json();
    const response = await Axios.put(API_ENDPOINTS.EDIT_STOCK(id), body);

    return NextResponse.json({
      status: '00', 
      message: 'Update berhasil',
      data: response.data
    });
  } catch (err) {
    console.error('PUT stock error:', err.message);
    return NextResponse.json(
      {
        status: '99',
        message: 'Gagal meng-update data stock'
      },
      { status: 500 }
    );
  }
};


export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    const response = await Axios.delete(API_ENDPOINTS.DELETE_STOCK(id));

    return NextResponse.json({
  status: '00',
  message: response.data.message || 'Stock berhasil dihapus',
});

  } catch (error) {
    console.error('Gagal hapus stock:', error);
    return Response.json({
      status: '99',
      message: 'Gagal menghapus stock',
    }, { status: 500 });
  }
}

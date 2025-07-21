import { Axios } from '@/utils/axios';
import { API_ENDPOINTS } from '../../api';
import { NextResponse } from 'next/server';

export const PUT = async (req, { params }) => {
  const id = params.id;
  const body = await req.json();

  try {
    const response = await Axios.put(API_ENDPOINTS.EDITUSER(id), body);
    return NextResponse.json({
      status: response.data.status,
      message: response.data.message,
      data: response.data
    });
  } catch (err) {
    console.error('Error PUT user:', err?.response?.data || err.message);
    return NextResponse.json(
      { status: '99', message: 'Gagal update user', data: {} },
      { status: 500 }
    );
  }
};

export const DELETE = async (req,{params}) => {
  const id = params.id;

  try {
    const response = await Axios.delete(API_ENDPOINTS.DELETEUSER(id));
    return NextResponse.json({
      status: response.data.status,
      message: response.data.message,
    });
  } catch (err) {
    return NextResponse.json({
      status: '99',
      message: 'Gagal menghapus user',
    }, {status: 500});
  }
}
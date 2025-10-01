import { NextResponse } from "next/server";
import { Axios } from "@/utils/axios";
import { API_ENDPOINTS } from "@/app/api/api";

export const PUT = async (req, { params }) => {
  try {
    const id = params.id;
    const body = await req.json();

    const response = await Axios.put(API_ENDPOINTS.EDIT_DUDI(id), body);

    return NextResponse.json(response.data, { status: response.status || 200 });
  } catch (err) {
    console.error('Error PUT DUDI:', err.response?.data || err);

    return NextResponse.json({
      message: 'Gagal update DUDI',
      error: err.response?.data?.message || err.message,
      datetime: new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14),
    }, { status: 500 });
  }
};

// ✅ DELETE DUDI
export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    const response = await Axios.delete(API_ENDPOINTS.DELETE_DUDI(id));
    return NextResponse.json(response.data, { status: response.status || 200 });
  } catch (err) {
    console.error("Error DELETE DUDI:", err?.response?.data || err.message);
    return NextResponse.json(
      { 
        status: "99", 
        message: err?.response?.data?.message || "Gagal hapus DUDI" 
      }, 
      { status: err?.response?.status || 500 }
    );
  }
};

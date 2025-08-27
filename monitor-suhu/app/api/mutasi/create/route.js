import axios from 'axios';
import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '../../api';

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await axios.post(API_ENDPOINTS.CREATE_MUTASI, body);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error Gagal Menambahkan Data KOntol", error);
        return NextResponse.json(
            { status: "99", message: "Error Gagal Menambahkan Data" },
            { status: 500 }
        );
    }
}

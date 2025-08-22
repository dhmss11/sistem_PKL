import axios from 'axios';
import { API_ENDPOINTS } from '../../api';

export async function POST(req, res) {
    try {
        const body = await req.json();
        const response = await axios.post(API_ENDPOINTS.CREATE_MUTASI);
        return Response.json(response.data)
    } catch (error) {
        console.error("Error Gagal Menambahkan Data", error);
        return Response.json({status: "99", message:"Error Gagal Menambahkan Data"}, {status: 500})
    }

    
}
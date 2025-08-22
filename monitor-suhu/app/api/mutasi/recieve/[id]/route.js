import axios from "axios";
import { API_ENDPOINTS } from "../../../api";

export async function POST(req,{params}) {
 try {

    const id = await params.id;
    
    const req = await req.json();
    const response = await axios.post(API_ENDPOINTS.RECEIVE_MUTASI(id));
    
    return Response.json(response.data);

} catch (error) {
    console.error("Error Gagal Menerima Data")
    return Response.json({status: '99', message: "Error Gagal Menerima Data"})
} 
}









import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8100';

export async function GET() {
  try {
    const response = await axios.get(`${BASE_URL}/api/satuanstock`);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Gagal mengambil data', error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await axios.post(`${BASE_URL}/api/satuanstock/create`, body);
    return new Response(JSON.stringify({ status: '00', message: 'Data berhasil ditambahkan' }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: '99', message: 'Gagal menambah data', error: error.message }),
      { status: 500 }
    );
  }
}

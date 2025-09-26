export async function GET() {
  try {
    const res = await fetch("http://localhost:8100/api/mutasi/pending", {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("error fetch pending faktur:", error.message);
    return new Response(
      JSON.stringify({ status: "99", message: "Gagal ambil faktur pending" }),
      { status: 500 }
    );
  }
}

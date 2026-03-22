const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Netlify akan otomatis membaca variabel yang Anda masukkan tadi
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  try {
    // Mengambil data dari tabel app_config di Supabase berdasarkan key 'marquee_text'
    const response = await fetch(
      `${supabaseUrl}/rest/v1/app_config?key=eq.marquee_text&select=value`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Ambil nilai dari kolom 'value'. Jika tabel kosong, pakai pesan default.
    const marqueeText = (data && data.length > 0) 
      ? data[0].value 
      : "Selamat Datang! (Pesan default)";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Agar bisa diakses dari frontend
      },
      body: JSON.stringify({ marqueeText }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ marqueeText: "⚠️ Gagal memuat pesan dari database." }),
    };
  }
};
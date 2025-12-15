// netlify/functions/get-marquee-config.js
const fetch = require('node-fetch');

// =========================================================================
// ⚠️ LANGKAH KRITIS: GANTI URL DI BAWAH INI DENGAN URL RAW GIST JSON ANDA 
// URL harus diawali: https://gist.githubusercontent.com/.../raw/...
// =========================================================================
const GIST_RAW_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/d7e2b3548afe793f1e5c0c37c497615f5ba7b2b1/config.json'; 
// =========================================================================

exports.handler = async (event, context) => {
    try {
        // Mencoba mengambil data dari URL RAW Gist
        const response = await fetch(GIST_RAW_URL);
        
        // Cek jika HTTP Status Code bukan 200 OK
        if (!response.ok) {
            console.error("Gist fetch failed, status:", response.status);
            // Mengirimkan pesan fallback agar frontend tidak crash
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: "Gagal mengambil data dari Gist", 
                    marqueeText: "❌ Gagal memuat pesan global dari server (Status " + response.status + ")." 
                })
            };
        }
        
        // Parsing data JSON yang berhasil diambil
        const data = await response.json();
        
        // Mengirimkan respon sukses ke frontend (marquee-config.js)
        return {
            statusCode: 200,
            body: JSON.stringify({
                // Mengirimkan properti 'marqueeText' yang diharapkan oleh frontend
                marqueeText: data.marqueeText || "Pesan default Gist gagal dimuat. Cek format JSON Gist.",
                status: "success"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Penting untuk CORS
            }
        };
    } catch (error) {
        // Menangkap error jika proses fetch/JSON parsing gagal total
        console.error("Serverless Function Runtime Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Internal Server Error during Gist fetch.", 
                marqueeText: "❌ Internal Server Error. Cek log Netlify Function." 
            })
        };
    }
};
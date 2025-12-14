// netlify/functions/get-marquee-config.js

// URL Gist Dinamis Anda (tanpa HASH)
const BASE_GIST_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/config.json';

exports.handler = async function(event, context) {
    try {
        // Tambahkan parameter cache-busting unik (timestamp) ke URL
        const cacheBuster = Date.now();
        const GIST_URL_WITH_BYPASS = `${BASE_GIST_URL}?t=${cacheBuster}`;

        // 1. Ambil data dari GitHub Gist (menggunakan URL cache-busting)
        const response = await fetch(GIST_URL_WITH_BYPASS);
        
        if (!response.ok) {
            // Jika Gist gagal diakses (meskipun cache-busting), gunakan pesan darurat
            throw new Error(`Gagal fetch Gist: ${response.status}`);
        }

        const data = await response.json();

        // 2. Kembalikan data ke klien (browser)
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                // Set cache control untuk Function Netlify ini agar responsnya cepat
                "Cache-Control": "public, max-age=60" // Cache 60 detik saja
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Error fetching Gist:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ marqueeText: "📢 Gagal memuat data terbaru (Cek Console)." })
        };
    }
}
// netlify/functions/get-marquee-config.js

// URL Mentah (Raw URL) Gist Anda yang asli
const GIST_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/c29dd163f92065f96cbf49007cdaab1116a46ee2/config.json';

exports.handler = async function(event, context) {
    try {
        // 1. Ambil data dari GitHub Gist (di sisi server)
        const response = await fetch(GIST_URL);
        
        if (!response.ok) {
            throw new Error(`Gagal fetch Gist: ${response.status}`);
        }

        const data = await response.json();

        // 2. Kembalikan data ke klien (browser)
        // Karena ini dikembalikan dari domain Netlify Anda sendiri, CORS aman!
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                // Header ini memastikan browser mengizinkan akses (solusi CORS!)
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Error fetching Gist:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ marqueeText: "📢 ERROR: Gagal memuat pesan server via Proxy Netlify." })
        };
    }
}
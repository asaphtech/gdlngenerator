// netlify/functions/get-marquee-config.js

// Baris 1: Import modul yang dibutuhkan untuk server (Node.js)
const fetch = require('node-fetch'); 

// Baris 2: Baris kosong (atau komentar)

// Baris 3: Komentar atau baris kosong

// Baris 4: Variabel URL RAW Gist Anda
const GIST_RAW_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/d7e2b3548afe793f1e5c0c37c497615f5ba7b2b1/config.json'; 

exports.handler = async (event, context) => {
    try {
        const response = await fetch(GIST_RAW_URL);
        
        if (!response.ok) {
            console.error("Gist fetch failed, status:", response.status);
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: "Gagal mengambil data dari Gist", 
                    marqueeText: "❌ Gagal memuat pesan global dari server (Status " + response.status + ")." 
                })
            };
        }
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                marqueeText: data.marqueeText || "Pesan default Gist gagal dimuat. Cek format JSON Gist.",
                status: "success"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
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
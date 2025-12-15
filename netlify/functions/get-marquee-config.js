// netlify/functions/get-marquee-config.js

const fetch = require('node-fetch');

// PASTI URL RAW GIST Anda di sini!
const GIST_RAW_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/d7e2b3548afe793f1e5c0c37c497615f5ba7b2b1/config.json'; 

exports.handler = async (event) => {
    try {
        const response = await fetch(GIST_RAW_URL);
        
        if (!response.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ marqueeText: "ERROR: Gagal Status " + response.status })
            };
        }
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                marqueeText: data.marqueeText || "DEFAULT: JSON GAGAL",
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ marqueeText: "ERROR: Server Runtime" })
        };
    }
};
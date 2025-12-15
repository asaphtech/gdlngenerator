// netlify/functions/get-marquee-config.js

const fetch = require('node-fetch');

// PASTI URL RAW GIST Anda di sini!
const GIST_RAW_URL = 'https://gist.githubusercontent.com/asaphtech/7b27d3a606a1c732c47874772211b822/raw/e0a3869d84ee2aa7e7610516979aaa1d6f94fe34/config.json'; 

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
// marquee-config.js

// ====================================================================
// START GUARDRAIL (PENTING untuk mencegah ReferenceError di Netlify Function)
if (typeof document === 'undefined') {
    return; // Berhenti jika dijalankan di lingkungan Server/Node.js
}
// END GUARDRAIL
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const runningTextElement = document.getElementById('runningText');

    // PASTI BANTU DENGAN URL GIST ANDA YANG AKURAT
    const GLOBAL_CONFIG_URL = '/.netlify/functions/get-marquee-config';
    
    const STORAGE_KEY = 'customMarqueeText';
    const fallbackText = '📢 ERROR: GAGAL MEMUAT PESAN SERVER. MENGGUNAKAN PESAN DARURAT.';

    // FUNGSI INI KINI MENGGUNAKAN ASYNC/AWAIT UNTUK FETCH DATA DARI GIST
    async function loadMarqueeText() {
        const storedLocalText = localStorage.getItem(STORAGE_KEY);
        
        // PRIORITAS 1: Teks Lokal Pengguna
        if (storedLocalText) {
            if (runningTextElement) {
                runningTextElement.textContent = storedLocalText;
            }
            return; 
        }

        // PRIORITAS 2: Ambil pesan Global dari Gist (via Netlify Function)
        try {
            const response = await fetch(GLOBAL_CONFIG_URL);
            
            if (!response.ok) {
                throw new Error('Gagal memuat Gist. Status: ' + response.status);
            }
            
            const config = await response.json();
            
            // Ambil pesan dari properti "marqueeText"
            const serverDefaultText = config.marqueeText || fallbackText;

            if (runningTextElement) {
                runningTextElement.textContent = serverDefaultText;
            }
            
        } catch (error) {
            console.error("Error loading configuration from Gist:", error);
            // Gunakan teks darurat jika Gist gagal diakses
            if (runningTextElement) {
                runningTextElement.textContent = fallbackText;
            }
        }
    }

    // Fungsi untuk menghentikan/melanjutkan Marquee (Logika Double-Click)
    function setupMarqueeControls() {
        if (runningTextElement) {
            runningTextElement.addEventListener('dblclick', function() {
                const currentState = window.getComputedStyle(this).getPropertyValue('animation-play-state');
                
                if (currentState === 'running') {
                    this.style.animationPlayState = 'paused';
                    if (typeof showToast === 'function') {
                        showToast('Marquee berhenti (Double-Click untuk lanjut).', 3000);
                    }
                } else {
                    this.style.animationPlayState = 'running';
                    if (typeof showToast === 'function') {
                        showToast('Marquee berjalan lagi!', 3000);
                    }
                }
            });
        }
    }

    // Inisialisasi: Panggil fungsi yang baru
    loadMarqueeText(); 
    setupMarqueeControls();
});
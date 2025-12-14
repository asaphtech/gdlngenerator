// marquee-config.js - VERSI FINAL DENGAN KONTROL GIST GLOBAL

document.addEventListener('DOMContentLoaded', () => {
    const runningTextElement = document.getElementById('runningText');

    // URL Netlify Function untuk mengambil data Gist
    const GLOBAL_CONFIG_URL = '/.netlify/functions/get-marquee-config';
    
    // Teks darurat jika Netlify Function/Gist gagal
    const fallbackText = '📢 ERROR: GAGAL MEMUAT PESAN GLOBAL DARI SERVER. HUBUNGI ADMIN JIKA INI TERUS TERJADI.';

    // FUNGSI UTAMA: Ambil pesan Global dari Gist
    async function loadMarqueeText() {
        try {
            const response = await fetch(GLOBAL_CONFIG_URL);
            
            if (!response.ok) {
                console.warn('Gagal memuat Gist. Status:', response.status);
                throw new Error('Response not OK'); 
            }
            
            const config = await response.json();
            
            // Ambil pesan dari properti "marqueeText" (Default: fallbackText)
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
                    // Fungsi showToast didefinisikan di rotatepicture.html atau index.html
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

    // Inisialisasi
    loadMarqueeText(); 
    setupMarqueeControls();
});
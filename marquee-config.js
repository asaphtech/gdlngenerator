// marquee-config.js

document.addEventListener('DOMContentLoaded', () => {
    const runningTextElement = document.getElementById('runningText');

    // URL GIST ANDA YANG SUDAH BENAR
    const GLOBAL_CONFIG_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/c29dd163f92065f96cbf49007cdaab1116a46ee2/config.json';
    
    // Kunci untuk Local Storage
    const STORAGE_KEY = 'customMarqueeText';
    
    // Teks darurat (hanya digunakan jika fetch Gist gagal total)
    const fallbackText = '📢 ERROR: GAGAL MEMUAT PESAN SERVER. MENGGUNAKAN PESAN DARURAT.';


    // FUNGSI UNTUK MEMUAT TEKS DARI LOCAL STORAGE ATAU SERVER GIST
    async function loadMarqueeText() {
        const storedLocalText = localStorage.getItem(STORAGE_KEY);
        
        // PRIORITAS 1: Jika ada teks yang disimpan pengguna secara lokal, gunakan itu.
        if (storedLocalText) {
            if (runningTextElement) {
                runningTextElement.textContent = storedLocalText;
            }
            return; // Hentikan fungsi
        }

        // PRIORITAS 2: Jika tidak ada teks lokal, ambil pesan global dari Gist
        try {
            const response = await fetch(GLOBAL_CONFIG_URL);
            
            // Cek apakah fetch berhasil (status code 200-299)
            if (!response.ok) {
                throw new Error('Gagal memuat Gist. Status: ' + response.status);
            }
            
            const config = await response.json();
            
            // Ambil pesan dari properti "marqueeText" di JSON Gist
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

    // Inisialisasi
    // Panggil fungsi yang baru
    loadMarqueeText(); 
    setupMarqueeControls();
});
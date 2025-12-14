// marquee-config.js

document.addEventListener('DOMContentLoaded', () => {
    const runningTextElement = document.getElementById('runningText');

    const GLOBAL_CONFIG_URL = 'https://gist.githubusercontent.com/asaphtech/e4373cf3233824c721f6640818b88bfe/raw/c29dd163f92065f96cbf49007cdaab1116a46ee2/config.json';
    
    // Kunci untuk Local Storage
    const STORAGE_KEY = 'customMarqueeText';
    
    // Teks default jika belum ada yang disimpan (harus sama dengan di settings.html)
    const defaultText = '📢 PENGUMUMAN: KLIK DUA KALI (DOUBLE-CLICK) PADA TEKS INI UNTUK MENGHENTIKANNYA. KLIK DUA KALI LAGI UNTUK MELANJUTKAN. | PESAN INI BISA DIGANTI DI BAGIAN PENGATURAN.';

    // Fungsi untuk memuat teks dari Local Storage atau default
    function loadMarqueeText() {
        const storedText = localStorage.getItem(STORAGE_KEY);
        const textToUse = storedText || defaultText;
        
        if (runningTextElement) {
            runningTextElement.textContent = textToUse;
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
    loadMarqueeText();
    setupMarqueeControls();
});
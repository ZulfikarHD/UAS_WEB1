// Kode ini menangani pemutaran audio latar belakang dan interaksinya dengan elemen media lainnya

document.addEventListener('DOMContentLoaded', () => {
    // Mendapatkan elemen audio latar belakang dan semua elemen media
    const loopAudio = document.querySelector('#loopAudio');
    const mediaElements = document.querySelectorAll('audio, video');

    // Jika tidak ada elemen audio latar belakang, hentikan eksekusi
    if (!loopAudio) return;

    // Memulihkan posisi dan status pemutaran dari penyimpanan lokal
    const savedTime = localStorage.getItem('loopAudioTime');
    const savedState = localStorage.getItem('loopAudioState');

    // Mengatur waktu pemutaran jika tersimpan sebelumnya
    if (savedTime) {
        loopAudio.currentTime = parseFloat(savedTime);
    }

    // Memulai pemutaran jika sebelumnya sedang diputar atau tidak ada status tersimpan
    if (savedState === 'playing' || !savedState) {
        loopAudio.play().catch(error => {
            console.log('Pemutaran otomatis dicegah:', error);
        });
    }

    // Menyimpan posisi dan status pemutaran sebelum meninggalkan halaman
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('loopAudioTime', loopAudio.currentTime);
        localStorage.setItem('loopAudioState', loopAudio.paused ? 'paused' : 'playing');
    });

    // Menangani interaksi dengan elemen media lainnya
    mediaElements.forEach(media => {
        if (media !== loopAudio) {
            // Menghentikan audio latar belakang saat media lain diputar
            media.addEventListener('play', () => {
                loopAudio.pause();
            });

            // Memulai kembali audio latar belakang saat semua media lain berhenti
            media.addEventListener('pause', () => {
                if (![...mediaElements].some(m => !m.paused && m !== loopAudio)) {
                    loopAudio.play().catch(error => {
                        console.log('Pemutaran otomatis dicegah:', error);
                    });
                }
            });

            // Memulai kembali audio latar belakang saat semua media lain selesai
            media.addEventListener('ended', () => {
                if (![...mediaElements].some(m => !m.paused && m !== loopAudio)) {
                    loopAudio.play().catch(error => {
                        console.log('Pemutaran otomatis dicegah:', error);
                    });
                }
            });
        }
    });
});
// Fungsi untuk menyalin teks dari elemen tertentu
function copyElementText(selector) {
  const element = document.querySelector(selector); // Dapatkan elemen berdasarkan selector
  if (element) {
    const text = element.innerText || element.textContent; // Ambil teks
    // Simpan teks ke chrome.storage
    chrome.storage.local.set({ copiedText: text }, () => {
      console.log('✅ Teks berhasil disalin dan disimpan!');
    });
    // Salin teks ke clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => console.log('✅ Teks berhasil disalin ke clipboard!'))
      .catch((err) => console.error('❌ Gagal menyalin teks:', err));
  } else {
    console.log('❌ Elemen tidak ditemukan!');
  }
}

// Siapkan event listener untuk shortcut (Alt + C)
window.addEventListener('keydown', (event) => {
  if (event.altKey && event.key === 'c') {
    copyElementText('.main-body');
  }
});

document.getElementById('copyElementButton')?.addEventListener('click', () => {
  copyElementText('#myText');
});

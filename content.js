// Fungsi untuk menyalin teks dari semua elemen dengan selector tertentu
function copyElementText(selector) {
  const elements = document.querySelectorAll(selector); // Ambil semua elemen yang cocok dengan selector
  if (elements.length > 0) {
    const texts = Array.from(elements)
      .map((el) => el.innerText.trim() || el.textContent.trim()) // Ambil teks dari setiap elemen
      .filter((text) => text.length > 0) // Hapus teks kosong
      .join('\n\n'); // Gabungkan dengan pemisah baris

    if (!texts) {
      showNotification('Tidak ada teks yang bisa disalin!', 'error');
      return;
    }

    // Simpan teks ke chrome.storage
    chrome.storage.local.set({ copiedText: texts }, () => {
      console.log('✅ Semua teks berhasil disalin dan disimpan!');
    });

    // Salin teks ke clipboard
    navigator.clipboard
      .writeText(texts)
      .then(() => {
        showNotification(
          'Semua teks berhasil disalin ke clipboard!',
          'success'
        );
      })
      .catch((err) => {
        console.error('❌ Gagal menyalin teks:', err);
        showNotification('Gagal menyalin teks.', 'error');
      });
  } else {
    console.log('❌ Tidak ada elemen yang cocok dengan selector!');
    showNotification('Tidak ada elemen yang ditemukan!', 'error');
  }
}

// Menampilkan notifikasi
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '9999';
  notification.style.backgroundColor = type === 'success' ? 'green' : 'red';
  notification.style.color = 'white';
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Siapkan event listener untuk shortcut (Alt + C)
window.addEventListener('keydown', (event) => {
  if (event.altKey && event.key === 'c') {
    copyElementText('.card-body'); // 🔥 Menyalin semua teks dari semua .card-body
  }
});

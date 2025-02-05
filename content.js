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
      .then(() => {
        showNotification('Teks berhasil disalin ke clipboard!', 'success');
      })
      .catch((err) => {
        console.error('❌ Gagal menyalin teks:', err);
        showNotification('Gagal menyalin teks.', 'error');
      });
  } else {
    console.log('❌ Elemen tidak ditemukan!');
    showNotification('Elemen tidak ditemukan!', 'error');
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
    copyElementText('.card-body'); // Atau ganti dengan selector sesuai kebutuhan
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Ambil teks yang sudah disalin dari storage
  chrome.storage.local.get('copiedText', (data) => {
    const copiedText = data.copiedText || 'Belum ada teks yang disalin.';
    document.getElementById('copiedText').value = copiedText;
  });

  // Tombol untuk menyalin teks yang sudah ada di textarea
  document.getElementById('copyBtn').addEventListener('click', () => {
    const text = document.getElementById('copiedText').value;
    navigator.clipboard
      .writeText(text)
      .then(() => alert('✅ Teks berhasil disalin lagi!'))
      .catch((err) => console.error('❌ Gagal menyalin teks:', err));
  });

  document.getElementById('clearBtn').addEventListener('click', {
    handleEvent: () => {
      chrome.storage.local.remove('copiedText', () => {
        document.getElementById('copiedText').value =
          'Belum ada teks yang disalin.';
      });
    },
  });
});

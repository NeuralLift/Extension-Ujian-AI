document.addEventListener('DOMContentLoaded', () => {
  // Fungsi untuk menampilkan hasil AI setelah tombol diklik
  async function fetchAIResult() {
    // Ambil teks yang sudah disalin di chrome.storage
    chrome.storage.local.get('copiedText', async (data) => {
      const loadingText = document.getElementById('loading');
      const resultContainer = document.getElementById('resultContainer');
      const copyTextContainer = document.getElementById('copyTextContainer');
      const copyText = document.getElementById('copyText');

      loadingText.classList.remove('hidden');
      copyTextContainer.classList.add('hidden');
      resultContainer.classList.add('hidden');
      copyText.classList.add('hidden');

      if (!data.copiedText) {
        resultContainer.textContent = '❌ Tidak ada teks yang disalin!';
        loadingText.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        return;
      }

      const message = data.copiedText;

      try {
        // Kirim teks yang disalin ke API AI
        const API_URL = 'https://extension-ujian-print-ai.vercel.app/api/ai';
        const body = { payload: { message } };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(9000),
        });

        const responseData = await response.json();

        // Tampilkan hasil atau kesalahan
        if (response.ok) {
          resultContainer.textContent = `Hasil AI: ${responseData.message}`;
          loadingText.classList.add('hidden');
          resultContainer.classList.remove('hidden');
          copyTextContainer.classList.remove('hidden');
          copyText.classList.remove('hidden');
          copyText.textContent = message || 'Teks tidak tersedia';
        } else {
          resultContainer.textContent = `❌ Error: ${responseData.message}`;
          loadingText.classList.add('hidden');
          resultContainer.classList.remove('hidden');
          copyText.classList.remove('hidden');
          copyTextContainer.classList.remove('hidden');
          copyText.textContent = message || 'Teks tidak tersedia';
        }
      } catch (error) {
        resultContainer.textContent = `❌ Terjadi kesalahan: ${error.message}`;
        loadingText.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        copyText.classList.remove('hidden');
        copyTextContainer.classList.remove('hidden');
        copyText.textContent = message || 'Teks tidak tersedia';
      }
    });
  }

  // Event listener untuk tombol fetch hasil AI
  document
    .getElementById('fetchAIButton')
    .addEventListener('click', fetchAIResult);
});

class AIExtension {
  constructor() {
    this.loadingText = document.getElementById('loading');
    this.resultContainer = document.getElementById('resultContainer');
    this.resultText = document.getElementById('resultText');
    this.copyTextContainer = document.getElementById('copyTextContainer');
    this.copyText = document.getElementById('copyText');
    this.fetchAIButton = document.getElementById('fetchAIButton');

    this.API_URL = 'https://extension-ujian-print-ai.vercel.app/api/ai';

    this.initialize();
  }

  initialize() {
    // Memeriksa apakah ada teks yang disalin di chrome.storage m
    if (chrome.storage.local.get('copiedText')) {
      this.fetchAIResult();
    }

    this.fetchAIButton.addEventListener('click', () => this.fetchAIResult());
  }

  async fetchAIResult() {
    chrome.storage.local.get('copiedText', async (data) => {
      this.showLoading();

      if (!data.copiedText) {
        this.showError('❌ Tidak ada teks yang disalin!');
        return;
      }

      const message = data.copiedText;
      try {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: { message } }),
          signal: AbortSignal.timeout(9000),
        });

        const responseData = await response.json();

        if (response.ok) {
          this.showResult(responseData.message, message);
        } else {
          this.showError(`❌ Error: ${responseData.message}`, message);
        }
      } catch (error) {
        this.showError(`❌ Terjadi kesalahan: ${error.message}`, message);
      }
    });
  }

  showLoading() {
    this.loadingText.classList.remove('hidden');
    this.resultContainer.classList.add('hidden');
    this.resultText.classList.add('hidden');
    this.copyTextContainer.classList.add('hidden');
    this.copyText.classList.add('hidden');
  }

  showResult(result, copiedText) {
    this.loadingText.classList.add('hidden');
    this.resultContainer.classList.remove('hidden');
    this.resultText.classList.remove('hidden');
    this.copyTextContainer.classList.remove('hidden');
    this.copyText.classList.remove('hidden');
    this.resultText.textContent = result || 'Tidak ada jawaban';
    this.copyText.textContent = copiedText || 'Teks tidak tersedia';
  }

  showError(errorMessage, copiedText = '') {
    this.loadingText.classList.add('hidden');
    this.resultContainer.classList.remove('hidden');
    this.resultText.classList.remove('hidden');
    this.copyTextContainer.classList.remove('hidden');
    this.copyText.classList.remove('hidden');
    this.resultText.textContent = errorMessage;
    this.copyText.textContent = copiedText || 'Teks tidak tersedia';
  }
}

document.addEventListener('DOMContentLoaded', () => new AIExtension());

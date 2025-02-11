class AIExtension {
  constructor() {
    this.loadingText = document.getElementById('loading');
    this.resultContainer = document.getElementById('resultContainer');
    this.resultText = document.getElementById('resultText');
    this.copyTextContainer = document.getElementById('copyTextContainer');
    this.copyText = document.getElementById('copyText');
    this.fetchAIButton = document.getElementById('fetchAIButton');

    this.API_URL = 'https://extension-ujian-print-ai.vercel.app/api/v2/ai';

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
      if (!data.copiedText) {
        this.showError('❌ Tidak ada teks yang disalin!');
        return;
      }

      const message = data.copiedText;

      try {
        this.showLoading();
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: { message } }),
        });

        if (!response.ok) {
          throw new Error('Failed to start SSE connection');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let inThinkTag = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              const content = data.content;

              if (content.includes('<think>')) {
                inThinkTag = true;
              }

              if (content.includes('</think>')) {
                inThinkTag = false;
              }

              if (!inThinkTag) {
                result += content;
              }

              const isThinkingText = 'Thinking...';

              // Parse Markdown after the loop
              let cleanedMessage = cleanMessage(result);
              cleanedMessage = MarkdownParser.parse(cleanedMessage);

              inThinkTag
                ? this.showLoading()
                : this.showResult(cleanedMessage, message);
            } else if (line.startsWith('event: end')) {
              reader.cancel();
              break;
            }
          }
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
    this.resultText.innerHTML = result || 'Tidak ada jawaban';
    this.copyText.textContent = copiedText || 'Teks tidak tersedia';
  }

  showError(errorMessage, copiedText = '') {
    this.loadingText.classList.add('hidden');
    this.resultContainer.classList.remove('hidden');
    this.resultText.classList.remove('hidden');
    this.copyTextContainer.classList.remove('hidden');
    this.copyText.classList.remove('hidden');
    this.resultText.innerHTML = errorMessage;
    this.copyText.textContent = copiedText || 'Teks tidak tersedia';
  }
}

class MarkdownParser {
  static parse(text) {
    // Convert headers
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Convert bold text
    text = text.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>');

    // Convert italic text
    text = text.replace(/\*(.*)\*/gim, '<i>$1</i>');

    // Convert links
    text = text.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

    // Convert list
    text = text.replace(/\n- (.*$)/gim, '<li>$1</li>');

    // Convert code
    text = text.replace(/([^]+)/gim, '<code>$1</code>');

    // Convert line breaks
    text = text.replace(/\n/gim, '<br>');

    return text.trim();
  }
}

function cleanMessage(message) {
  return message
    .replace(/<\/?think>/g, '') // Hapus semua <think> dan </think>
    .replace(/^\s*[\n\r]*(<br\s*\/?>\s*)+/, '') // Hapus semua \n, \r, dan <br> di awal
    .trim(); // Hapus spasi tak perlu di awal/akhir
}

document.addEventListener('DOMContentLoaded', () => new AIExtension());

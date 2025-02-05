chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'save_text') {
    chrome.storage.local.set({ copiedText: message.data }, () => {
      console.log('Teks tersimpan:', message.data);
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureVisiblePart') {
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (imageUri) => {
          sendResponse({ imageUri: imageUri });
      });
      return true; // Keeps the message channel open for sendResponse
  }
});

document.getElementById('startButton').addEventListener('click', () => {
  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Send a message to the content script to scrape HTML and start the screenshot process
      chrome.tabs.sendMessage(tabId, { action: 'scrapeHtml' }, (response) => {
          if (response && response.html) {
              const cleanedHtml = cleanHtml(response.html); // Clean the HTML content
              downloadHtml(cleanedHtml); // Download the cleaned HTML
              console.log('HTML cleaned and downloaded successfully.');

              // Convert the HTML content to a string after download
              const blob = new Blob([cleanedHtml], { type: 'text/html' });
              readHtmlBlob(blob);  // Read and log the HTML string
          }
      });

      // Start capturing the entire webpage through scrolling
      chrome.tabs.sendMessage(tabId, { action: 'startFullPageScreenshot' });
  });
});

// Function to clean up the HTML content
function cleanHtml(html) {
  return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<style></style>')
      .replace(/\sclass="[^"]*"/g, ' class=""')
      .replace(/\sid="[^"]*"/g, ' id=""')
      .replace(/\sstyle="[^"]*"/g, ' style=""')
      .replace(/<img[^>]*src="data:image[^"]*"[^>]*>/gi, '<img/>')
      .replace(/>\s+</g, '>\n<')
      .replace(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/g, '\n')
      .replace(/(\s*<[^>]+>)/g, '\n$1')
      .trim();
}

// Function to trigger the download of the HTML file
function downloadHtml(cleanedHtml) {
  const blob = new Blob([cleanedHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'scraped.html'; // Download the cleaned HTML file
  a.click();

  URL.revokeObjectURL(url); // Clean up the blob URL
}

// Function to read HTML blob and convert it to a string for logging
function readHtmlBlob(blob) {
  const reader = new FileReader();

  reader.onload = function(event) {
      const htmlString = event.target.result; // This is the HTML as a string
      console.log('HTML file as string:', htmlString); // Log the HTML string
  };

  reader.readAsText(blob); // Read the blob as a text file
}

// Function to process images using Tesseract.js


// Listen for messages to process screenshots


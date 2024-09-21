    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("Received message in content.js:", request); // Log message in content.js

      if (request.action === 'scrapeHtml') {
          var htmlContent = document.documentElement.outerHTML; // Get full HTML of the page

          // Extract all image URLs from the HTML
          const imageUrls = [];
          document.querySelectorAll('img').forEach(img => {
              const src = img.getAttribute('src');
              // Only add the image if it has a valid src
              if (src) {
                  imageUrls.push(src); // Directly add the base64 string
              }
          });
          console.log(imageUrls);

          console.log("Image URLs extracted:", imageUrls); // Log image URLs

          // Send back both the updated HTML content and the image URLs
          sendResponse({ html: htmlContent, images: imageUrls });
      }

      if (request.action === 'startFullPageScreenshot') {
          captureFullPageScreenshot(); // Start capturing the full page
      }
    });

    // Function to capture full page screenshot by scrolling
    function captureFullPageScreenshot() {
      let totalHeight = document.body.scrollHeight;
      let viewportHeight = window.innerHeight;
      let currentScrollY = 0;
      let screenshotIndex = 0;
      const imageUrls = []; // Array to hold image URLs

      function captureNextScroll() {
          // Scroll the page to the next position
          window.scrollTo(0, currentScrollY);

          // Wait for the scroll to complete, then capture the screenshot
          setTimeout(() => {
              // Capture the screenshot using the background script
              chrome.runtime.sendMessage({ action: 'captureVisiblePart' }, (response) => {
                  if (response.imageUri) {
                      console.log(`Screenshot part ${screenshotIndex} URL:`, response.imageUri);
                      imageUrls.push(response.imageUri); // Store the image URL

                      // Increment the scroll position and the screenshot index
                      currentScrollY += viewportHeight;
                      screenshotIndex++;

                      // If there's more of the page to capture, continue scrolling
                      if (currentScrollY < totalHeight) {
                          captureNextScroll(); // Recursive call to keep capturing
                      } else {
                          // Scroll back to the top after capturing all parts
                          window.scrollTo(0, 0);

                          // After capturing all screenshots, process the images with OCR
                          console.log("All screenshots captured. Processing images...");
                          processImages(imageUrls);
                      }
                  }
              });
          }, 500); // Adjust the delay to give enough time for rendering
      }

      // Start the scrolling and capturing process
      captureNextScroll();
    }

    // Function to process images using Tesseract.js
    function processImages(imageUrls) {
      // Create or select a loading element to show during processing
      let loadingElement = document.createElement('div');
      loadingElement.id = 'loading';
      loadingElement.innerText = 'Processing images...';
      document.body.appendChild(loadingElement);
      
      loadingElement.style.display = 'block'; // Show the loading message

      let combinedText = ''; // Initialize an empty string to hold the combined output

      // Track the number of images processed
      let imagesProcessed = 0;

      imageUrls.forEach(url => {
          console.log("Processing image: " + url);
          
          // Use Tesseract to recognize text from the base64 image
          Tesseract.recognize(
              url,
              'eng',
              {
                  logger: (m) => console.log(m) // Progress logging
              }
          ).then(({ data: { text } }) => {          
              // Extract total price from the text
              const totalPrice = text.match(/total\s*(\d+[.,]?\d*)\s*dzd/i);
              const paymentMethods = text.match(/(CIB\/EDAHABIA|CCP BARIDI MOB|CCP|BNA|AGB)/gi);
              
              // Build the output string for this image
              let outputText = ``;
              outputText += totalPrice ? `Total Price: ${totalPrice[1]} DZD\n` : "Total Price not found.\n";
              outputText += paymentMethods ? `Payment Methods Found: ${paymentMethods.join(', ')}\n` : "Payment Methods not found.\n";

              // Append the output of this image to the combined text
              combinedText += outputText + '\n';
        

          }).catch((error) => {
              console.error(`Error processing image: ${error.message}`);
          }).finally(() => {
              // Increment the count of processed images
              imagesProcessed++;

              // Check if all images have been processed
              if (imagesProcessed === imageUrls.length) {
                  // Hide the loading message after all images are processed
                  loadingElement.style.display = 'none';

                  // Log the final combined result
                  console.log('Combined OCR Result:', combinedText);
              }
          });
      });
      const detectionResult = detectCloudflareOrCaptcha();
      console.log('Detection Result:', detectionResult);
    }
    function detectCloudflareOrCaptcha() {
      // Check for Cloudflare challenge page by looking for unique characteristics
      const cloudflareTitle = document.title.includes("Attention Required") || document.title.includes("Just a moment");
      const cloudflareScript = Array.from(document.scripts).some(script => script.src.includes('cloudflare'));

      // Check for CAPTCHA by detecting specific classes or iframe elements
      const captchaIframe = document.querySelector('iframe[src*="captcha"]');
      const reCaptchaElement = document.querySelector('.g-recaptcha');
      const hCaptchaElement = document.querySelector('.h-captcha');

      // Detect Cloudflare challenge
      if (cloudflareTitle || cloudflareScript) {
          console.log('Cloudflare challenge detected.');
          return 'cloudflare';
      }

      // Detect CAPTCHA (Google reCAPTCHA or hCaptcha)
      if (captchaIframe || reCaptchaElement || hCaptchaElement) {
          console.log('CAPTCHA detected on the page.');
          return 'captcha';
      }

      console.log('No Cloudflare or CAPTCHA detected.');
      return 'none';
    }

    function getImageUrlsFromHtml(htmlContent) {
        const imageUrls = [];
        
        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
    
        // Select all <img> elements and extract their 'src' attributes
        const images = tempDiv.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                imageUrls.push(src);
            }
        });
    
        return imageUrls;
    }
  
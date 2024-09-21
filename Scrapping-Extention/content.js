// // Initialize counter from localStorage or set it to 0 if not found
// let counter = localStorage.getItem("autofillCounter")
//   ? parseInt(localStorage.getItem("autofillCounter"))
//   : 0;

// if (!AutoFillCardData("6280580610061011", "341", "01/2025"))
//   if (!AutoFillPassword("123456")) console.log("Step 3");

// // Increment and save the counter
// counter++;
// localStorage.setItem("autofillCounter", counter);

// console.log("Autofill has been called", counter, "times.");
// console.log("Page processing");

steps();

function steps() {
  if (checkSSL()) {
    console.log("SSL Verified");
  } else {
    console.log("SSL NOT Verified");
  }

  if (checkCAPTCHA()) console.log("CAPTCHA Verified");
  else console.log("CAPTCHA NOT Verified");

  if (!AutoFillCardData("6280580610061011", "341", "01/2025"))
    if (!AutoFillPassword("123456")) console.log("Step 3");
}

function downloadSource(html) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Send the object URL back to the background script
  chrome.runtime.sendMessage({ url });
}

// Capture the current page's HTML content
// downloadSource(document.documentElement.outerHTML);

function AutoFillCardData(carte, cvv2, dateExp) {
  let PAN = document.getElementById("iPAN");

  if (!PAN) return false;

  let CVC = document.getElementById("iCVC");
  let monthSelect = document.getElementById("month");
  let yearSelect = document.getElementById("year");
  let fullName = document.getElementById("iTEXT");

  // Auto-fill elements with card data
  PAN.value = carte;
  CVC.value = cvv2;

  // Extract month and year from dateExp
  let dateParts = dateExp.split("/");
  let month = dateParts[0]; // Month
  let year = dateParts[1]; // Year

  // Set the selected month
  monthSelect.value = month;

  // Set the selected year
  yearSelect.value = year;

  // Optionally fill full name if you have that data
  fullName.value = "test name";

  let buttonPayment = document.getElementById("buttonPayment");

  // Click the payment button
  buttonPayment.click();

  return true;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fillCardData") {
    AutoFillCardData(message.cardNumber, message.cvv, message.expiration);
    sendResponse({ status: "success" });
  } else if (message.action === "fillPassword") {
    AutoFillPassword(message.password);
    sendResponse({ status: "success" });
  } else if (message.action === "MarchandPayButtonClick") {
    findMarchandPayButton();
    sendResponse({ status: "success" });
  } else if (message.action === "VerifyCaptcha") {
    checkCAPTCHA();
  }
});

//

function AutoFillPassword(password) {
  let passwordElements = document.getElementsByClassName("passwordInput");
  if (passwordElements.length <= 0) {
    return false;
  }
  if (passwordElements.length > 0) {
    passwordElements[0].value = password; // Target the first element with the class name
  }

  let submitPasswordButton = document.getElementById("submitPasswordButton");

  if (submitPasswordButton) {
    submitPasswordButton.click();
    return true;
  }

  return false;
}

function checkSSL() {
  if (window.location.protocol === "https:") {
    console.log("SSL is active: Page is served over HTTPS.");
    return true;
  } else {
    console.log("SSL is not active: Page is not served over HTTPS.");
    return false;
  }
}

function findMarchandPayButton() {
  let payButton = getPayButton();

  console.log("payButton : ", payButton);
  if (payButton) {
    payButton.click();
  }
}

function getPayButton() {
  let button = document.getElementById("SATIM_AUTOMATE_payButton");

  if (button) return button;

  let possiblePayButtons = document.getElementsByClassName(
    "h-[57px] w-full flex items-center justify-center rounded-[10px] bg-naviguih-primary text-[15px] sm:text-[20px] font-bold font-poppins text-white"
  );

  console.log("possiblePayButtons : ", possiblePayButtons);
  if (possiblePayButtons.length <= 0) {
    return false;
  }

  return possiblePayButtons[0];
}

function checkCAPTCHA() {
  const iframes = document.querySelectorAll("iframe");

  const captchaPatterns = [
    /www\.google\.com\/recaptcha/i,
    /hcaptcha\.com/i,
    /cloudflare\.com/i,
    /friendlycaptcha\.com/i,
    /akamai\.net/i,
  ];

  const containsCaptchaIframe = Array.from(iframes).some((iframe) => {
    return captchaPatterns.some((pattern) => pattern.test(iframe.src));
  });

  console.log("Contains CAPTCHA iframe:", containsCaptchaIframe);
}

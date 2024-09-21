function AutoFillCardData(carte, cvv2, dateExp) {
  let PAN = document.getElementById("iPAN");
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
}

function AutoFillPassword(password) {
  let passwordElement = document.getElementsByClassName("passwordInput");

  passwordElement.value = password;

  console.log("\n\n --> passwordElement : ", passwordElement);
  // let submitPasswordButton = document.getElementById("submitPasswordButton");
  // submitPasswordButton.click();
}

function AutomatePayment(card) {
  AutoFillCardData(card.carte, card.cvv2, card.dateExp);
  // waiting for the next page to be loaded
  AutoFillPassword(card.password);
}

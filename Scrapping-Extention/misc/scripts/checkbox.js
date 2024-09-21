function checkTermsAndConditions() {
  let termsCheckbox = document.getElementById("terms");

  if (!termsCheckbox) {
    console.error("Terms and conditions checkbox is missing.");
    return false;
  }

  return true;
}

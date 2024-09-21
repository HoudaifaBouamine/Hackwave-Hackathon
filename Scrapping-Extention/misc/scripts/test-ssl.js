function checkSSL() {
  if (window.location.protocol === "https:") {
    console.log("SSL is active: Page is served over HTTPS.");
    return true;
  } else {
    console.log("SSL is not active: Page is not served over HTTPS.");
    return false;
  }
}

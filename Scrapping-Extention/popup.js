document.getElementById("download-btn").addEventListener("click", async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject the content script into the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

document.getElementById("fill").addEventListener("click", async () => {
  console.log("Sending message to fill page content");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send a message to the content script to autofill the form
  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "fillCardData",
      cardNumber: "6280580610061011",
      cvv: "341",
      expiration: "01/2025",
    },
    (response) => {
      console.log(response.status);
    }
  );
});

document.getElementById("fill-password").addEventListener("click", async () => {
  console.log("Sending message to fill password");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "fillPassword",
      password: "123456",
    },
    (response) => {
      console.log(response.status);
    }
  );
});

document.getElementById("duplicate-tab").addEventListener("click", async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Duplicate the active tab without changing focus
  chrome.tabs.duplicate(tab.id, (duplicatedTab) => {
    console.log("Duplicated Tab: ", duplicatedTab);

    // Optionally, you can immediately focus back to the original tab if needed
    chrome.tabs.update(tab.id, { active: true });
    console.log("focus back");
  });
});
//MarchandPayButtonClick

document.getElementById("pay").addEventListener("click", async () => {
  // Get the active tab
  console.log("Pay button clicked");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "MarchandPayButtonClick",
    },
    (response) => {
      console.log(response.status);
    }
  );
});

document.getElementById("captcha").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "VerifyCaptcha",
    },
    (response) => {
      console.log(response.status);
    }
  );
});

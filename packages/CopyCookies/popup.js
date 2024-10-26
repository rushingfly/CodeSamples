document.getElementById("copy").addEventListener("click", () => {
    const sourceDomain = document.getElementById("source").value;
    const targetDomain = document.getElementById("target").value;
  
    chrome.runtime.sendMessage(
      {
        action: "copyCookies",
        sourceDomain,
        targetDomain
      },
      (response) => {
        if (response?.status === "success") {
          alert("Cookies copied successfully!");
        } else {
          alert("Failed to copy cookies.");
        }
      }
    );
  });
  
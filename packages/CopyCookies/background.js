// 获取指定站点的 Cookies
async function getCookies(domain) {
    return new Promise((resolve) => {
      chrome.cookies.getAll({ domain }, (cookies) => {
        resolve(cookies);
      });
    });
  }
  
  // 将 Cookies 设置到目标站点
  async function setCookies(cookies, targetDomain) {
    for (let cookie of cookies) {
      const newCookie = {
        url: `http://${targetDomain}`, // 根据具体场景决定是http还是https
        name: cookie.name,
        value: cookie.value,
        // domain: cookie.domain, // localhost时会传入端口，所以注释
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: cookie.expirationDate
      };
      chrome.cookies.set(newCookie);
    }
  }
  
  // 监听 popup 的指令并处理
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "copyCookies") {
    (async () => {
        try {
          const cookies = await getCookies(message.sourceDomain);
          await setCookies(cookies, message.targetDomain);
          sendResponse({ status: "success" });
        } catch (error) {
          console.error("Error copying cookies:", error);
          sendResponse({ status: "failure", error: error.message });
        }
      })();
      return true;
    }
  });
  
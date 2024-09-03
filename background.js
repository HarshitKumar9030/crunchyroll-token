chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      const authorizationHeader = details.requestHeaders.find(
        (header) => header.name.toLowerCase() === 'authorization'
      );
  
      if (authorizationHeader && authorizationHeader.value) {
        chrome.storage.local.set({ token: authorizationHeader.value }, () => {
          console.log('Token captured and stored:', authorizationHeader.value);
        });
      } else {
        console.log('Authorization header not found in the request.');
      }
    },
    {
      urls: ["https://www.crunchyroll.com/content/v2/*/watch-history*"], 
      types: ["xmlhttprequest"] 
    },
    ["requestHeaders"]
  );
  
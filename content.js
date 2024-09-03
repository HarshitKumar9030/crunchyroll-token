(function () {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        if (args[0].includes("/content/v2/") && args[0].includes("/watch-history")) {
            const responseClone = response.clone();

            const headers = [...responseClone.headers.entries()];
            const authorizationHeader = headers.find(
                ([name]) => name.toLowerCase() === "authorization"
            );

            if (authorizationHeader) {
                const token = authorizationHeader[1];
                if (token) {
                    chrome.runtime.sendMessage({ token });
                }
            }
        }

        return response;
    };
})();

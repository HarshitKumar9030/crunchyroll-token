document.addEventListener("DOMContentLoaded", function () {
    const statusDiv = document.getElementById("status");
    const tokenDiv = document.getElementById("token");
    const redirectButton = document.getElementById("redirectToHistory");
    const getTokenButton = document.getElementById("getToken");

    statusDiv.textContent = "Checking if you are on the correct page...";
    tokenDiv.style.display = "none";
    getTokenButton.style.display = "none";

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab.url.includes("/history")) {
            statusDiv.textContent = "You're on the History Page!";
            getTokenButton.style.display = "block";
            redirectButton.style.display = "none";
        } else if (activeTab.url.startsWith("https://www.crunchyroll.com")) {
            statusDiv.textContent = "Please click below to go to the History Page.";
            getTokenButton.style.display = "none";
            redirectButton.style.display = "block";
        } else {
            statusDiv.textContent = "Please navigate to a Crunchyroll page first.";
            redirectButton.style.display = "none";
            getTokenButton.style.display = "none";
        }
    });

    redirectButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            if (activeTab.url.startsWith("https://www.crunchyroll.com")) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    func: function () {
                        window.location.href = "https://www.crunchyroll.com/history";
                    },
                });
            }
        });
    });

    function checkToken() {
        chrome.storage.local.get("token", (data) => {
            if (data.token) {
                tokenDiv.style.display = "block";
                const tokenWithoutBearer = data.token.replace("Bearer ", "");
                tokenDiv.innerText = `${tokenWithoutBearer}`;
                const range = document.createRange();
                range.selectNode(tokenDiv);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand("copy");
                statusDiv.textContent = "Token copied to clipboard!";
                statusDiv.style.color = "#32CD32"; 
            } else {
                statusDiv.textContent = "Token not found or user not logged in.";
                statusDiv.style.color = "#ff4500"; 
            }
        });
    }

    getTokenButton.addEventListener("click", function () {
        statusDiv.textContent = "Waiting for a network request to complete...";
        statusDiv.style.color = "#ffa500"; 

        const loader = document.createElement("div");
        loader.className = "loader";
        loader.style.position = "fixed";
        loader.style.top = "50%";
        loader.style.left = "50%";
        loader.style.transform = "translate(-50%, -50%)";
        loader.style.border = "4px solid rgba(243, 243, 243, 0.3)";
        loader.style.borderTop = "4px solid #ff7f50";
        loader.style.borderRadius = "50%";
        loader.style.width = "40px";
        loader.style.height = "40px";
        loader.style.animation = "spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite";
        loader.style.zIndex = "1000"; 

        document.body.appendChild(loader);

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function () {
                    location.reload();
                },
            }, () => {
                setTimeout(() => {
                    loader.remove(); 
                    checkToken();
                }, 4000);
            });
        });
    });
});

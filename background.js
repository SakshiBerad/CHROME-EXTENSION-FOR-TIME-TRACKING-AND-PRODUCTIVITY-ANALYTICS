let activeTabId = null;
let startTime = null;

function saveTime(url, duration) {
    const domain = new URL(url).hostname;
    chrome.storage.local.get([domain], (result) => {
        const total = result[domain] || 0;
        chrome.storage.local.set({ [domain]: total + duration });
    });
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const endTime = Date.now();
    if (activeTabId !== null && startTime !== null) {
        try {
            const tab = await chrome.tabs.get(activeTabId);
            if (tab.url && tab.url.startsWith("http")) {
                const duration = Math.round((endTime - startTime) / 1000);
                saveTime(tab.url, duration);
            }
        } catch (err) {
            console.error(err);
        }
    }
    activeTabId = activeInfo.tabId;
    startTime = Date.now();
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
    if (tabId === activeTabId && startTime !== null) {
        try {
            const endTime = Date.now();
            const tab = await chrome.tabs.get(activeTabId);
            const duration = Math.round((endTime - startTime) / 1000);
            if (tab.url && tab.url.startsWith("http")) {
                saveTime(tab.url, duration);
            }
        } catch (err) {
            console.error(err);
        }
        activeTabId = null;
        startTime = null;
    }
});

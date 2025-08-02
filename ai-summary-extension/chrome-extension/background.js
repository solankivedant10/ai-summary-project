// Background service worker for AI Summary Extension
// This handles any background tasks and extension lifecycle events

chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Summary Extension installed successfully');
});

// Handle extension icon click (optional - we're using popup instead)
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked on tab:', tab.id);
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    
    if (request.action === 'capturePage') {
        // Handle page capture request if needed
        sendResponse({ success: true });
    }
    
    return true; // Keep message channel open for async response
});

// Optional: Handle tab updates to track page changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log('Tab updated:', tab.url);
    }
}); 
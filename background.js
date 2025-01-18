// Service worker for Gemini Chat extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gemini Chat extension installed');
  
  // Enable the side panel by default
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .then(() => console.log('Side panel enabled'))
    .catch((error) => console.error('Error enabling side panel:', error));
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({ enabled: true });
});

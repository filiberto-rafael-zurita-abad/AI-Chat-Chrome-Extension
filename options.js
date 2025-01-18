document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('api-key');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Load saved API key
  chrome.storage.local.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save API key
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    chrome.storage.local.set({ geminiApiKey: apiKey }, function() {
      showStatus('API key saved successfully!', 'success');
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});

// Gemini Chat functionality
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
let chatHistory = [];

// Get API key from chrome storage
let API_KEY;

function setupChatInterface() {
  chrome.storage.local.get(['geminiApiKey'], function(result) {
    API_KEY = result.geminiApiKey;
    if (!API_KEY) {
      console.error('No Gemini API key found. Please set it in extension options.');
      document.getElementById('chat-container').textContent = 'Error: Missing API key. Please set your API key in extension options.';
      document.getElementById('input-container').style.display = 'none';
      return;
    }

    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');

    function addMessageToChat(message, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
      messageDiv.textContent = message;
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessage() {
      const message = messageInput.value.trim();
      if (!message) return;

      // Add user message to chat
      addMessageToChat(message, true);
      chatHistory.push({ role: 'user', parts: [{ text: message }] });
      messageInput.value = '';

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY
          },
          body: JSON.stringify({
            contents: chatHistory
          })
        });

        const data = await response.json();
        const assistantMessage = data.candidates[0].content.parts[0].text;
        
        // Add assistant message to chat
        addMessageToChat(assistantMessage, false);
        chatHistory.push({ role: 'model', parts: [{ text: assistantMessage }] });
      } catch (error) {
        addMessageToChat('Error: Failed to get response from Gemini', false);
        console.error('Error:', error);
      }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }); // Close chrome.storage.local.get callback
}

// Initialize the chat interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupChatInterface);

document.getElementById('camera-button').addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(null, {}, (image) => {
    console.log('Screenshot captured', image);
    if (image) {
      const messageInput = document.getElementById('message-input').value.trim();
      let prompt = "You are a helpful AI asistante. Analyze the image and do your best to assume your role to help solve or provide information. If you see a question, answer it. If you see a news article, give your thoughts on it. Determine for yourself if you are suppose to describe what you see or serve as some other helpful purpose";
      if (messageInput) {
        prompt = messageInput;
      }
      const apiKey = 'AIzaSyAk9eD7dtSOyKX1LhLf6bsZtIr_q7pr3wE'; // Replace with your actual API key
      fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: image.split(',')[1],
                },
              },
            ],
          }],
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Gemini API response', data);
          if (data && data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0 && 
              data.candidates[0] && data.candidates[0].content && 
              data.candidates[0].content.parts && Array.isArray(data.candidates[0].content.parts) && data.candidates[0].content.parts.length > 0 &&
              data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            const output = data.candidates[0].content.parts[0].text;
            const chatContainer = document.getElementById('chat-container');
            const assistantMessage = document.createElement('div');
            assistantMessage.classList.add('message', 'assistant-message');
            assistantMessage.textContent = output;
            chatContainer.appendChild(assistantMessage);
          } else {
            console.error('Error: Invalid Gemini API response', data);
            console.log('Full Gemini API response:', data);
            const chatContainer = document.getElementById('chat-container');
            const assistantMessage = document.createElement('div');
            assistantMessage.classList.add('message', 'assistant-message');
            assistantMessage.textContent = 'Error: Invalid Gemini API response ' + JSON.stringify(data, null, 2);
            chatContainer.appendChild(assistantMessage);
          }
        })
        .catch(error => {
          console.error('Error calling Gemini API', error);
           console.log('Full Gemini API error:', error);
           const chatContainer = document.getElementById('chat-container');
            const assistantMessage = document.createElement('div');
            assistantMessage.classList.add('message', 'assistant-message');
            assistantMessage.textContent = 'Error calling Gemini API';
            chatContainer.appendChild(assistantMessage);
        });
    } else {
      console.error('Error: Screenshot capture failed.');
       const chatContainer = document.getElementById('chat-container');
            const assistantMessage = document.createElement('div');
            assistantMessage.classList.add('message', 'assistant-message');
            assistantMessage.textContent = 'Error: Screenshot capture failed.';
            chatContainer.appendChild(assistantMessage);
    }
  });
});

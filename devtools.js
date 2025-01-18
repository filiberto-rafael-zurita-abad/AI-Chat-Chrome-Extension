// DevTools panel setup
chrome.devtools.panels.create(
  "Gemini Chat",
  "/icons/icon48.png",
  "/chat.html",
  function(panel) {
    console.log("Gemini Chat panel created");
    panel.onShown.addListener(function(window) {
      console.log("Chat panel shown");
    });
    panel.onHidden.addListener(function() {
      console.log("Chat panel hidden");
    });
  }
);

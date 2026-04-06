function sendMessage() {
  let input = document.getElementById("user-input");
  let chatBox = document.getElementById("chat-box");

  let userText = input.value;

  let userMsg = `<p><b>You:</b> ${userText}</p>`;
  chatBox.innerHTML += userMsg;

  // Fake AI response (for now)
  let botMsg = `<p><b>AI:</b> Thinking...</p>`;
  chatBox.innerHTML += botMsg;

  input.value = "";
}

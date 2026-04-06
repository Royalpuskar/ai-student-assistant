function sendMessage() {
  let input = document.getElementById("user-input");
  let chatBox = document.getElementById("chat-box");

  let userText = input.value;

  if (userText === "") return;

  chatBox.innerHTML += `<p><b>You:</b> ${userText}</p>`;
  chatBox.innerHTML += `<p><b>AI:</b> Thinking...</p>`;

  input.value = "";
}

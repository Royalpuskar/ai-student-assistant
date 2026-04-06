async function sendMessage() {
    const input = document.querySelector("input").value;

    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    alert(data.reply);
}

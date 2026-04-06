const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Chat route
app.post("/chat", (req, res) => {
    const userMessage = req.body.message;

    console.log("User:", userMessage);

    // Simple AI logic (temporary)
    let reply = "";

    if (userMessage.toLowerCase().includes("hello")) {
        reply = "Hello! How can I help you?";
    } else if (userMessage.toLowerCase().includes("study")) {
        reply = "I can help you create a study plan!";
    } else {
        reply = "I am your AI assistant 🤖";
    }

    res.json({ reply: reply });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

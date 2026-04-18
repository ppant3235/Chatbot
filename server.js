const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 MEMORY STORAGE
let history = [];

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.json({ reply: "No message received" });
    }

    // Save user message
    history.push("User: " + userMessage);

    // 🧠 LIMIT MEMORY (IMPORTANT FOR SPEED)
    if (history.length > 6) {
        history.shift();
    }

    // Create prompt from last messages only
    const prompt = history.slice(-6).join("\n") + "\nBot:";

    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "phi",
            prompt: prompt,
            stream: false
        });

        const botReply = response.data.response;

        // Save bot reply
        history.push("Bot: " + botReply);

        res.json({ reply: botReply });

    } catch (error) {
        console.log("Error:", error.message);
        res.json({ reply: "Error: AI not responding" });
    }
});

// START SERVER
app.listen(3000, () => {
    console.log("🧠 Hybrid chatbot running 🚀");
});
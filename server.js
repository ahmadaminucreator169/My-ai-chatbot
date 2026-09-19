require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// Allow the server to serve your chatbot files
app.use(express.static(__dirname));

// Chat API
app.post("/api/chat", async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const conversation = history.slice(-20).map(item => ({
            role: item.role,
            content: item.content
        }));

        conversation.push({
            role: "user",
            content: message
        });

        const response = await client.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-5.6-luna",

            instructions:
                "You are a helpful, intelligent and friendly AI assistant. " +
                "Give clear, accurate and useful answers. " +
                "Explain difficult things in simple language. " +
                "If you are unsure about something, say so.",

            input: conversation
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error("OpenAI Error:", error);

        res.status(500).json({
            error: "Sorry, I could not connect to the AI service."
        });
    }
});

app.listen(PORT, () => {
    console.log(`AI Chatbot running on port ${PORT}`);
});

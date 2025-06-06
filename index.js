const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors"); // ✅ Add this
const OpenAI = require("openai");

app.use(cors()); // ✅ Use CORS before any routes
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Your POST endpoint, etc.

// POST endpoint
app.post("/nova-reply", async (req, res) => {
  try {
    const { text, tone = "neutral", emotion = "calm", sender = "user", sessionId = "default-session" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Nova, an empathetic conflict mediator. Tone: ${tone}, Emotion: ${emotion}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in novaReply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add this at the bottom to start the server on Render:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

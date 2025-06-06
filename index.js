const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

// Set your API key via environment variable on Render dashboard
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST endpoint to handle incoming messages
app.post("/nova-reply", async (req, res) => {
  try {
    const { text, tone = "neutral", emotion = "calm", sender = "user", sessionId = "default-session" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const response = await openai.createChatCompletion({
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nova Mediate API running on port ${PORT}`);
});

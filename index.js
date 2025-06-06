const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/nova-reply", async (req, res) => {
  try {
    const { text, tone = "neutral", emotion = "calm", sender = "user", sessionId = "default-session" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are Nova, an empathetic conflict mediator. Tone: ${tone}, Emotion: ${emotion}` },
        { role: "user", content: text }
      ],
    });

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Nova error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nova Mediate API listening on port ${PORT}`));

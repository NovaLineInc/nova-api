const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    console.log("OpenAI Response:", response);

    const reply = response.choices?.[0]?.message?.content || null;

    if (!reply) {
      console.error("No reply found in OpenAI response.");
      return res.status(500).json({ error: "No reply generated" });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in novaReply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

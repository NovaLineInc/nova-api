const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.novaReply = functions.https.onRequest(async (req, res) => {
  try {
    const { text, tone = "neutral", emotion = "calm", sender = "user", sessionId = "default-session" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are Nova, an empathetic conflict mediator. Tone: ${tone}, Emotion: ${emotion}` },
        { role: "user", content: text },
      ],
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in novaReply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

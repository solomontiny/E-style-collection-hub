import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful WhatsApp assistant for a fashion clothing store in Nigeria. Help users with orders, product info, delivery, returns, and sizing. Be friendly, short, and clear.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion?.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "Sorry, I could not generate a response.",
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return res.status(500).json({
      error: error.message || "AI request failed",
    });
  }
}

import express from "express";
import fetch from "node-fetch";
import ChatMessage from "../models/ChatMessage.js";
import { franc } from "franc";

const router = express.Router();

export default router;

// Gemini API call function
async function getGeminiResponse(prompt, lang = "en") {
  try {
    // Determine language instruction for Gemini
    let langInstruction = "Reply in English:";
    if (lang === "ml" || lang === "malayalam") {
      langInstruction = "Reply in Malayalam:";
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${langInstruction} ${prompt}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("🔍 Gemini raw response:", JSON.stringify(data, null, 2));
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t understand that."
    );
  } catch (err) {
    console.error("Gemini error:", err);
    return "Error connecting to AI service.";
  }
}

// Government helpline database (expandable)
const helplines = {
  general: "1800-180-1551",
  kisan: "1551",
  tivari_sir: "9503228566",
  women: "1091",
  disaster: "108",
};

// Chat API
router.post("/", async (req, res) => {
  console.log("🔥 Chat endpoint hit with body:", req.body);
  const { message, language, userId } = req.body;
  console.log("Chat endpoint hit with body:", req.body);

  let reply;

  // Detect language if not provided
  let detectedLang = language;
  if (!detectedLang) {
    const langCode = franc(message);
    if (langCode === "mal") {
      detectedLang = "malayalam";
    } else if (langCode === "eng") {
      detectedLang = "english";
    } else {
      detectedLang = "english"; // default fallback
    }
  }

  // Check if user asks for helpline
  if (
    message.toLowerCase().includes("helpline") ||
    message.toLowerCase().includes("help number")
  ) {
    reply = `📞 Government Helpline Numbers:
General: ${helplines.general}
Kisan: ${helplines.kisan}
Women: ${helplines.women}
Tivari_sir: ${helplines.tivari_sir}
Disaster: ${helplines.disaster}`;
  } else {
    reply = await getGeminiResponse(message, detectedLang);
  }

  // Save to MongoDB
  const chat = new ChatMessage({
    userId: userId || null,
    message,
    reply,
    language: detectedLang || "english",
  });

  await chat.save();

  res.json({ reply });
});

// Fetch chat history
router.get("/history/:userId", async (req, res) => {
  try {
    const history = await ChatMessage.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});



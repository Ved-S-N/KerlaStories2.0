import express from "express";
import fetch from "node-fetch";
import ChatMessage from "../models/ChatMessage.js";
import { franc } from "franc";
import { v4 as uuidv4 } from "uuid";

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
  const { message, language, userId, sessionId } = req.body;
  console.log("Chat endpoint hit with body:", req.body);

  let currentSessionId = sessionId;
  if (!currentSessionId) {
    currentSessionId = uuidv4();
  }

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
    sessionId: currentSessionId,
    message,
    reply,
    language: detectedLang || "english",
  });

  await chat.save();

  res.json({ reply, sessionId: currentSessionId });
});

// Fetch chat history
router.get("/history/:userId", async (req, res) => {
  try {
    const { sessionId } = req.query;
    const query = { userId: req.params.userId };
    if (sessionId) {
      query.sessionId = sessionId;
    }
    console.log("Fetching chat history with query:", query);
    const history = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(20);
    console.log("Chat history found:", history.length, "messages");
    res.json(history);
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Fetch chat sessions
router.get("/sessions/:userId", async (req, res) => {
  try {
    console.log("Fetching sessions for userId:", req.params.userId);
    const sessions = await ChatMessage.aggregate([
      { $match: { userId: req.params.userId } },
      {
        $group: {
          _id: "$sessionId",
          firstMessage: { $first: "$message" },
          createdAt: { $min: "$createdAt" },
          messageCount: { $sum: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
    ]);
    console.log("Sessions found:", sessions.length);
    const result = sessions.map((s) => ({
      sessionId: s._id,
      heading:
        s.firstMessage.length > 50
          ? s.firstMessage.substring(0, 50) + "..."
          : s.firstMessage,
      createdAt: s.createdAt,
      messageCount: s.messageCount,
    }));
    console.log("Sessions result:", result);
    res.json(result);
  } catch (err) {
    console.error("Fetch sessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Delete a session and its messages
router.delete("/sessions/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Delete all messages in the session
    await ChatMessage.deleteMany({
      sessionId: sessionId,
    });

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
});

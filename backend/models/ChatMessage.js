import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    sessionId: { type: String, required: true },
    message: { type: String, required: true },
    reply: { type: String, required: true },
    language: { type: String, default: "en" },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;

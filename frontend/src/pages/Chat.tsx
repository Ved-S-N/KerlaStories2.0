import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Globe,
  Volume2,
  VolumeX,
} from "lucide-react";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionAPI extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

const quickQuestions = [
  "What crops are suitable for Kerala monsoon season?",
  "How to apply for PM-KISAN scheme?",
  "Best organic fertilizers for coconut trees",
  "Crop insurance claim process",
  "Weather forecast for next week",
  "Market prices for rice and spices",
];

// Chat message type
type ChatMessage = {
  type: "user" | "bot";
  message: string;
  time: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(true); // default mic ON (red)
  const [language, setLanguage] = useState("english");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Speech recognition setup
  const [recognition, setRecognition] = useState<SpeechRecognitionAPI | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition() as SpeechRecognitionAPI;
    recognitionInstance.lang = language === "english" ? "en-US" : "ml-IN";
    recognitionInstance.interimResults = true;
    recognitionInstance.continuous = true;

    recognitionInstance.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      if (event.error === "network") {
        // Retry recognition on network errors
        recognitionInstance.stop();
        recognitionInstance.start();
      } else if (event.error === "not-allowed" || event.error === "permission-denied") {
        alert("Microphone permission denied. Please allow microphone access.");
      } else {
        alert("Speech recognition error: " + event.error + ". Please check microphone permissions.");
      }
    };

    recognitionInstance.onend = () => {
      if (isManuallyStopped) {
        setIsRecording(false);
      }
      // If not manually stopped, keep recording state as is
    };

    setRecognition(recognitionInstance);
  }, [language]);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      type: "user",
      message,
      time: formatTime(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          userId: "64f1e6f9c9b2ad9c39a5f001",
        }),
      });

      const data = await res.json();

      const botMessage: ChatMessage = {
        type: "bot",
        message: data.reply,
        time: formatTime(),
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat API error:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          message: "⚠️ Error connecting to AI service.",
          time: formatTime(),
        },
      ]);
    }

    setIsTyping(false);
    setMessage("");
  };

  // (Optional) Load past history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/chat/history/demo-user"
        );
        const data = await res.json();
        const mapped = data.reverse().map((msg: any) => ({
          type: msg.message ? "user" : "bot",
          message: msg.message || msg.reply,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setChatHistory(mapped);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            AI Agricultural Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get instant help with farming, schemes, weather, and more. Bilingual
            support in English and Malayalam with voice interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Chat Interface */}
          <div>
            <Card className="bg-gradient-card h-[600px] flex flex-col">
              <CardHeader className="border-b border-border bg-gradient-to-r from-card to-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg animate-glow">
                      <Bot className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        Agricultural AI Assistant
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Your farming companion
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">
                          Online • Ready to help
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={language === "english" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("english")}
                      className="shadow-sm"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      EN
                    </Button>
                    <Button
                      variant={language === "malayalam" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("malayalam")}
                      className="shadow-sm"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      ML
                    </Button>
                    <Button
                      variant={audioEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className="shadow-sm"
                    >
                      {audioEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.type === "user" ? "justify-end" : "justify-start"
                    } animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        chat.type === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                          chat.type === "user"
                            ? "bg-primary"
                            : "bg-gradient-primary"
                        }`}
                      >
                        {chat.type === "user" ? (
                          <User className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md ${
                          chat.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border border-border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                          {chat.message}
                        </p>
                        <p className="text-xs opacity-70 mt-2">{chat.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-primary">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-muted border border-border shadow-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-border p-4 bg-gradient-to-r from-card to-muted/10">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === "english"
                          ? "Ask me anything about farming..."
                          : "കൃഷിയെക്കുറിച്ച് എന്തെങ്കിലും ചോദിക്കൂ..."
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="pr-10 shadow-sm border-border focus:ring-2 focus:ring-primary/20"
                    />
                    {message.trim() && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs text-muted-foreground">Press Enter</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isRecording) {
                        setIsManuallyStopped(true);
                        recognition?.stop();
                        setIsRecording(false);
                      } else {
                        setIsManuallyStopped(false);
                        recognition?.start();
                        setIsRecording(true);
                      }
                    }}
                    className="shadow-sm hover:shadow-md transition-shadow"
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          {/* Removed Quick Questions and AI Features sidebar as per request */}
        </div>
      </div>
    </div>
  );
}

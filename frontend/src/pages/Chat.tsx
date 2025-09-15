import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Globe,
  Volume2,
  VolumeX,
  History,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

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

// Session type
type ChatSession = {
  sessionId: string;
  heading: string;
  createdAt: string;
  messageCount: number;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false); // default mic OFF
  const [isMicActive, setIsMicActive] = useState(false); // to track actual mic input state
  const [language, setLanguage] = useState("english");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Speech recognition setup
  const [recognition, setRecognition] = useState<SpeechRecognitionAPI | null>(
    null
  );

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
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
      } else if (
        event.error === "not-allowed" ||
        event.error === "permission-denied"
      ) {
        alert("Microphone permission denied. Please allow microphone access.");
      } else {
        alert(
          "Speech recognition error: " +
            event.error +
            ". Please check microphone permissions."
        );
      }
    };

    recognitionInstance.onend = () => {
      if (isManuallyStopped) {
        setIsRecording(false);
        setIsMicActive(false);
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

  const handleSessionClick = (sessionId: string) => {
    console.log("Session clicked:", sessionId);
    setCurrentSessionId(sessionId);
    console.log("currentSessionId state set to:", sessionId);
    fetchChatHistory(sessionId);
  };

  const handleNewSession = () => {
    if (chatHistory.length > 0) {
      // Use first user message as heading or fallback
      const firstUserMessage = chatHistory.find((msg) => msg.type === "user");
      const heading = firstUserMessage
        ? firstUserMessage.message.substring(0, 50)
        : `Chat ${sessions.length + 1}`;

      // Create a new session object with a temporary sessionId (UUID)
      const newSessionId = crypto.randomUUID();

      // Add current chat as a session in sidebar
      setSessions((prev) => [
        {
          sessionId: newSessionId,
          heading,
          createdAt: new Date().toISOString(),
          messageCount: chatHistory.length,
        },
        ...prev,
      ]);

      // Optionally, save the current chat messages to backend with newSessionId
      // (This requires backend API support for batch saving or individual saving)
      // For now, we rely on backend saving on each message send.

      // Clear chat history and set new session id to null to start fresh
      setCurrentSessionId(null);
      setChatHistory([]);
    } else {
      // If no chat history, just clear current session and chat
      setCurrentSessionId(null);
      setChatHistory([]);
    }
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

    // Clear the input immediately
    const messageToSend = message;
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          language,
          userId: "64f1e6f9c9b2ad9c39a5f00a",
          sessionId: currentSessionId,
        }),
      });

      const data = await res.json();

      // Update sessionId if new
      if (data.sessionId && data.sessionId !== currentSessionId) {
        setCurrentSessionId(data.sessionId);
        // Refresh sessions list
        const sessionsRes = await fetch(
          "http://localhost:3000/api/chat/sessions/64f1e6f9c9b2ad9c39a5f00a"
        );
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }

      const botMessage: ChatMessage = {
        type: "bot",
        message: data.reply,
        time: formatTime(),
      };

      setChatHistory((prev) => [...prev, botMessage]);
      // Refresh sessions to update message count
      refreshSessions();
    } catch (err) {
      console.error("Chat API error:", err);
      const errorMessage: ChatMessage = {
        type: "bot",
        message: "⚠️ Error connecting to AI service.",
        time: formatTime(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  // Load sessions and set current session
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/chat/sessions/64f1e6f9c9b2ad9c39a5f00a"
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Sessions loaded:", data);
        setSessions(data);
        if (data.length > 0 && !currentSessionId) {
          setCurrentSessionId(data[0].sessionId);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
      }
    };
    fetchSessions();
  }, []);

  const refreshSessions = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/chat/sessions/64f1e6f9c9b2ad9c39a5f00a"
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Sessions refreshed:", data);
      setSessions(data);
    } catch (err) {
      console.error("Failed to refresh sessions:", err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/chat/sessions/${sessionId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        // Remove from state
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
          setChatHistory([]);
        }
        setOpenMenuId(null); // Close menu
      } else {
        console.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const fetchChatHistory = async (sessionId: string) => {
    console.log("Loading chat history for session:", sessionId);
    try {
      const res = await fetch(
        `http://localhost:3000/api/chat/history/64f1e6f9c9b2ad9c39a5f00a?sessionId=${sessionId}`
      );
      const data = await res.json();
      console.log("Chat history data received:", data);
      // Map messages preserving both user and bot messages in order
      const mapped: ChatMessage[] = [];
      data.reverse().forEach((msg: any) => {
        if (msg.message) {
          mapped.push({
            type: "user",
            message: msg.message,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }
        if (msg.reply) {
          mapped.push({
            type: "bot",
            message: msg.reply,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }
      });
      console.log("Mapped chat history:", mapped);
      setChatHistory(mapped);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // Load history for current session
  useEffect(() => {
    if (!currentSessionId) return;
    fetchChatHistory(currentSessionId);
  }, [currentSessionId]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            AI Agricultural Assistant
          </h1>
          <p className="text-xl text-muted-foreground  mx-auto">
            Get instant help with farming, schemes, weather, and more. Bilingual
            support in English and Malayalam with voice interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sessions Sidebar */}
          <div className="col-span-1">
            <Card className="bg-gradient-card h-[600px] flex flex-col shadow-xl border-0 overflow-visible">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card via-muted/10 to-card px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2 truncate">
                    <History className="h-5 w-5 text-primary flex-shrink-0" />
                    Chat Sessions
                  </CardTitle>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNewSession}
                    className="shadow-md hover:shadow-lg transition-all duration-200 bg-primary hover:bg-primary/90 flex-shrink-0"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-visible p-0">
                <ScrollArea className="h-full overflow-visible">
                  <div className="p-4 space-y-3">
                    {sessions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No chat sessions yet</p>
                        <p className="text-xs mt-1">
                          Start a new conversation!
                        </p>
                      </div>
                    ) : (
                      sessions.map((session, index) => (
                        <div
                          key={session.sessionId}
                          className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border overflow-visible backdrop-blur-sm ${
                            currentSessionId === session.sessionId
                              ? "bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground border-primary/60 shadow-xl scale-[1.02] ring-2 ring-primary/30"
                              : "bg-gradient-to-br from-card/95 to-card/85 hover:from-card hover:to-card/95 border-border/60 hover:border-primary/40 hover:shadow-xl hover:scale-[1.02] hover:ring-2 hover:ring-primary/20"
                          }`}
                          onClick={() => handleSessionClick(session.sessionId)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    currentSessionId === session.sessionId
                                      ? "bg-primary-foreground animate-pulse"
                                      : "bg-primary/60"
                                  }`}
                                ></div>
                                <p
                                  className={`text-sm font-semibold truncate leading-tight ${
                                    currentSessionId === session.sessionId
                                      ? "text-primary-foreground"
                                      : "text-foreground group-hover:text-primary"
                                  }`}
                                  title={session.heading || `Chat ${index + 1}`}
                                >
                                  {session.heading || `Chat ${index + 1}`}
                                </p>
                              </div>
                              <p
                                className={`text-xs mb-3 truncate leading-tight ${
                                  currentSessionId === session.sessionId
                                    ? "text-primary-foreground/90"
                                    : "text-muted-foreground group-hover:text-muted-foreground/80"
                                }`}
                              >
                                {new Date(session.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="relative flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(
                                    openMenuId === session.sessionId
                                      ? null
                                      : session.sessionId
                                  );
                                }}
                                className={`p-1.5 rounded-md transition-colors duration-200 ${
                                  currentSessionId === session.sessionId
                                    ? "hover:bg-primary-foreground/20"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <MoreVertical
                                  className={`w-4 h-4 ${
                                    currentSessionId === session.sessionId
                                      ? "text-primary-foreground/80"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </button>
                              {openMenuId === session.sessionId && (
                                <div className="absolute right-0 mt-2 w-36 rounded-md bg-green-900 shadow-2xl border border-green-700 backdrop-blur-md z-[99999]">
                                  <button
                                    onClick={() =>
                                      handleDeleteSession(session.sessionId)
                                    }
                                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-600/20 rounded-b-md transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <Badge
                              variant={
                                currentSessionId === session.sessionId
                                  ? "secondary"
                                  : "outline"
                              }
                              className={`text-xs px-3 py-1.5 font-medium ${
                                currentSessionId === session.sessionId
                                  ? "bg-primary-foreground/25 text-primary-foreground border-primary-foreground/40"
                                  : "bg-muted/60 text-muted-foreground border-border/60 hover:bg-muted/80"
                              }`}
                            >
                              {session.messageCount} messages
                            </Badge>
                            <div
                              className={`text-xs font-medium ${
                                currentSessionId === session.sessionId
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground group-hover:text-muted-foreground/90"
                              }`}
                            >
                              {new Date(session.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="col-span-1 md:col-span-3">
            <Card className="bg-gradient-card h-[600px] flex flex-col overflow-hidden">
              <CardHeader className="border-b border-border bg-gradient-to-r from-card to-muted/20 flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg animate-glow flex-shrink-0">
                      <Bot className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-xl font-semibold truncate">
                        Agricultural AI Assistant
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        Your farming companion
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground truncate">
                          Online • Ready to help
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
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
                      className={`flex items-start space-x-3 max-w-full min-w-0 ${
                        chat.type === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
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
                        className={`rounded-2xl px-4 py-3 shadow-md min-w-0 break-words w-full ${
                          chat.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border border-border"
                        }`}
                      >
                        {chat.type === "user" ? (
                          <p className="text-sm whitespace-pre-line leading-relaxed break-words">
                            {chat.message}
                          </p>
                        ) : (
                          <div className="text-sm leading-relaxed break-words prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown
                              rehypePlugins={[rehypeHighlight]}
                              components={{
                                code: ({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }: any) => {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return !inline && match ? (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <code
                                      className="bg-muted px-1 py-0.5 rounded text-xs"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {chat.message}
                            </ReactMarkdown>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-2 truncate">
                          {chat.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start space-x-3 max-w-full min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-primary flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-muted border border-border shadow-md w-full">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-border p-4 bg-gradient-to-r from-card to-muted/10 flex-shrink-0">
                <div className="flex items-center space-x-3 gap-3">
                  <div className="flex-1 relative min-w-0">
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
                        <span className="text-xs text-muted-foreground">
                          Press Enter
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant={!isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isRecording) {
                        setIsManuallyStopped(true);
                        recognition?.stop();
                        setIsRecording(false);
                        setIsMicActive(false);
                      } else {
                        setIsManuallyStopped(false);
                        recognition?.start();
                        setIsRecording(true);
                        setIsMicActive(true);
                      }
                    }}
                    className={`shadow-sm hover:shadow-md transition-shadow flex-shrink-0 ${
                      !isRecording ? "animate-pulse" : ""
                    }`}
                    aria-label={
                      isRecording ? "Stop recording" : "Start recording"
                    }
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
                    className="shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
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

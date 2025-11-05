import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import {
  sendMessage,
  createConversation,
  endConversation,
} from "../api/conversationService";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  RotateCcw,
  Download,
  Share2,
  MoreVertical,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

export default function ChatWindow() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState(null);
  const [isEnding, setIsEnding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendUserMessage = async () => {
    if (!input.trim()) return;

    let convoId = conversationId;
    setIsLoading(true);

    // ✅ Create new conversation if it doesn't exist yet
    if (!convoId) {
      try {
        const convo = await createConversation({ 
          title: input.slice(0, 50) + (input.length > 50 ? "..." : ""), 
          participants: ["user"] 
        });
        convoId = convo.id;
        setConversationId(convoId);
      } catch (err) {
        console.error("❌ Error creating conversation:", err);
        setIsLoading(false);
        return;
      }
    }

    const userMsg = { 
      sender: "user", 
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const aiMsg = await sendMessage(convoId, userMsg);
      console.log("🧠 AI Response (raw):", aiMsg);

      // ✅ Flexible extraction (handles different backend keys)
      const aiText =
        aiMsg?.content ||
        aiMsg?.message ||
        aiMsg?.text ||
        (typeof aiMsg === "string" ? aiMsg : JSON.stringify(aiMsg));

      setMessages((prev) => [...prev, { 
        sender: "ai", 
        content: aiText,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "ai", 
          content: "Sorry, I encountered an error while processing your message. Please try again.",
          timestamp: new Date().toISOString(),
          isError: true
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!conversationId) return;
    setIsEnding(true);

    try {
      const res = await endConversation(conversationId);
      console.log("🧾 Conversation End Response:", res);
      setSummary(res.summary || "No summary available for this conversation.");
      setShowSummary(true);
    } catch (err) {
      console.error("❌ Error ending conversation:", err);
      setSummary("Error generating summary. Please try again.");
      setShowSummary(true);
    } finally {
      setIsEnding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  };

  const clearChat = () => {
    setConversationId(null);
    setMessages([]);
    setSummary(null);
    setShowSummary(false);
  };

  const quickPrompts = [
    "Hello! What can you help me with?",
    "Explain AI in simple terms",
    "Tell me a fun fact about technology",
    "Help me plan my day",
    "What's the weather like today?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Chat Assistant</h1>
                <p className="text-blue-100 text-sm opacity-90">
                  {conversationId ? "Active conversation" : "Ready to chat"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {conversationId && (
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="New Chat"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 ? (
            <div className="text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Start a Conversation
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                Ask me anything! I can help with questions, creative tasks, problem-solving, and much more.
              </p>
              
              {/* Quick Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(prompt);
                      setTimeout(() => sendUserMessage(), 100);
                    }}
                    className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm group-hover:text-gray-900">
                        {prompt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, i) => (
                <MessageBubble 
                  key={i} 
                  sender={m.sender} 
                  text={m.content} 
                  timestamp={m.timestamp}
                  isError={m.isError}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-500"
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  ×
                </button>
              )}
            </div>
            
            <button
              onClick={sendUserMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
            
            {conversationId && messages.length > 0 && (
              <button
                onClick={handleEnd}
                disabled={isEnding}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isEnding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">
                  {isEnding ? "Summarizing..." : "End Chat"}
                </span>
              </button>
            )}
          </div>
          
          {/* Character Count */}
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-gray-500">
              {input.length}/500 characters
            </div>
            <div className="text-xs text-gray-500">
              {messages.length} messages
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {showSummary && summary && (
          <div className="border-t border-gray-200 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Conversation Summary
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-amber-200">
                {summary}
              </p>
              
              <div className="flex justify-end gap-3 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  Not Helpful
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
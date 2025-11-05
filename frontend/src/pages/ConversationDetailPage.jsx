import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getConversation } from "../api/conversationService";
import MessageBubble from "../components/MessageBubble";
import { 
  ArrowLeft, 
  Calendar, 
  MessageCircle, 
  Bot, 
  User, 
  Sparkles, 
  Copy,
  Share2,
  Download,
  Clock,
  BarChart3
} from "lucide-react";

export default function ConversationDetailPage() {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchConversation() {
      try {
        const data = await getConversation(id);
        setConversation(data);
      } catch (err) {
        console.error("Error fetching conversation:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversation();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copySummary = async () => {
    if (conversation?.summary) {
      await navigator.clipboard.writeText(conversation.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversationStats = () => {
    if (!conversation?.messages) return null;
    
    const userMessages = conversation.messages.filter(msg => msg.sender === 'user').length;
    const aiMessages = conversation.messages.filter(msg => msg.sender === 'ai').length;
    const totalMessages = conversation.messages.length;
    
    return { userMessages, aiMessages, totalMessages };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Loading Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Loading Messages */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-300 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Conversation Not Found</h2>
          <p className="text-gray-600 mb-6">
            The conversation you're looking for doesn't exist or may have been deleted.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = getConversationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {conversation.title || "Untitled Conversation"}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(conversation.created_at)}</span>
                  </div>
                  {stats && (
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>{stats.totalMessages} messages</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-lg font-bold text-gray-800">{stats.userMessages}</span>
                </div>
                <div className="text-xs text-gray-600">Your Messages</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-green-500" />
                  <span className="text-lg font-bold text-gray-800">{stats.aiMessages}</span>
                </div>
                <div className="text-xs text-gray-600">AI Responses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-lg font-bold text-gray-800">
                    {Math.ceil(stats.totalMessages / 2)} mins
                  </span>
                </div>
                <div className="text-xs text-gray-600">Estimated Duration</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Messages Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-[65vh] flex flex-col">
              {/* Messages Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  Conversation Messages
                </h3>
                <div className="text-sm text-gray-500">
                  {conversation.messages?.length || 0} messages
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {conversation.messages?.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages in this conversation yet.</p>
                  </div>
                ) : (
                  conversation.messages?.map((msg, index) => (
                    <MessageBubble 
                      key={index} 
                      sender={msg.sender} 
                      text={msg.content}
                      timestamp={msg.timestamp}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            {conversation.summary && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    AI Summary
                  </h3>
                  <button
                    onClick={copySummary}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy summary"
                  >
                    {copied ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
                  {conversation.summary}
                </p>
              </div>
            )}

            {/* Conversation Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Share Conversation</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">
                  <Download className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Export as PDF</span>
                </button>
                <Link
                  to="/intelligence"
                  className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                >
                  <Bot className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Analyze with AI</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            {stats && (
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Conversation Length</span>
                    <span className="font-semibold">{stats.totalMessages} msgs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">You Spoke</span>
                    <span className="font-semibold">{stats.userMessages} times</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">AI Responded</span>
                    <span className="font-semibold">{stats.aiMessages} times</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
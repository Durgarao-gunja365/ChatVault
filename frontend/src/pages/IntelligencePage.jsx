import { useState } from "react";
import { queryAI } from "../api/aiService";
import { Link } from "react-router-dom";
import { Brain, Search, Sparkles, Zap, Clock, MessageCircle, ArrowRight, Bot, Lightbulb, BarChart3 } from "lucide-react";

export default function IntelligencePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const predefinedQuestions = [
    {
      question: "Summarize all my conversations this week.",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500"
    },
    {
      question: "What were the main topics I discussed?",
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      question: "Show me chats where I talked about travel.",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500"
    },
    {
      question: "List all tasks or decisions mentioned in my chats.",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500"
    },
    {
      question: "What was my last conversation about?",
      icon: Clock,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const handleQuery = async (customQuery = null, index = null) => {
    const question = customQuery || query.trim();
    if (!question) return;

    setSelectedQuestion(index);
    setLoading(true);
    try {
      const res = await queryAI(question);
      setResult(res);
    } catch (err) {
      console.error("Error querying AI:", err);
      setResult({ answer: "Sorry, I encountered an error while analyzing your conversations. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question, index) => {
    setQuery(question.question);
    handleQuery(question.question, index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Conversation Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ask questions about your past chats. Our AI analyzes all stored conversations and provides 
            intelligent insights, summaries, and relevant excerpts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search Input */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                    placeholder="Ask something like 'What were the main topics from my last week conversations?'"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-gray-800 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={() => handleQuery()}
                  disabled={loading || !query.trim()}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Ask AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Predefined Questions */}
              <div>
                <p className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Quick questions to try:
                </p>
                <div className="grid gap-3">
                  {predefinedQuestions.map((q, index) => {
                    const IconComponent = q.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(q, index)}
                        disabled={loading}
                        className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                          selectedQuestion === index 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${q.color}`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium flex-1">{q.question}</span>
                          <ArrowRight className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-1 ${
                            selectedQuestion === index ? 'text-blue-500' : ''
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Result Section */}
            {result && !loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
                      <p className="text-gray-300 text-sm">Based on your conversation history</p>
                    </div>
                  </div>
                </div>

                {/* Result Content */}
                <div className="p-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      {result.answer}
                    </p>

                    {result.excerpts?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                          <MessageCircle className="w-5 h-5 text-green-500" />
                          Relevant Conversation Excerpts
                        </h4>
                        <div className="space-y-4">
                          {result.excerpts.map((ex, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-300 group"
                            >
                              <div className="flex gap-3">
                                <div className="w-2 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-gray-700 italic mb-3 text-lg leading-relaxed">
                                    "{ex.excerpt}"
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <Link
                                      to={`/conversation/${ex.conversation_id}`}
                                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1 group-hover:underline"
                                    >
                                      View Full Conversation
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Your Conversations</h3>
                  <p className="text-gray-600">The AI is scanning through your chat history to find relevant insights...</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Intelligence Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Conversations Analyzed</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Topics Identified</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Response Accuracy</span>
                  <span className="font-semibold">98.2%</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific with time frames for better results</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ask about topics, decisions, or action items</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use natural language - the AI understands context</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Weekly summary generated</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">5 new topics identified</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Trend analysis completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
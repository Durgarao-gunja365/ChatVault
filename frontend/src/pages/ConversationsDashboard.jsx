import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  getConversations, 
  deleteConversation, 
  renameConversation 
} from "../api/conversationService";

import {
  MessageCircle,
  Calendar,
  Search,
  Filter,
  FolderOpen,
  Bot,
  Sparkles,
  Trash2,
  Edit3,
  TrendingUp,
} from "lucide-react";


export default function ConversationsDashboard() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, recent, summarized



  useEffect(() => {
    async function fetchConversations() {
      try {
        const data = await getConversations();

        // ✅ Filter out conversations with no messages or empty summaries
        const filtered = data.filter(
          (conv) => (conv.message_count || 0) > 0 || (conv.summary && conv.summary.trim() !== "")
        );

        setConversations(filtered);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  // Filter conversations based on search and filter criteria
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "recent" && isRecent(conv.created_at)) ||
                         (filter === "summarized" && conv.summary && conv.summary.trim() !== "");
    
    return matchesSearch && matchesFilter;
  });

  function isRecent(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "Unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Loading Conversations
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-2xl mb-6">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Conversations Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your first conversation with the AI to see your chat history here. 
              All your discussions will be automatically saved and summarized.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Start Your First Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Conversation History
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Your Conversations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse through all your AI conversations. Each chat is automatically saved, 
            summarized, and ready for review.
          </p>
        </div>

        {/* Stats and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{conversations.length}</div>
                <div className="text-sm text-gray-600">Total Chats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {conversations.filter(c => c.summary && c.summary.trim() !== "").length}
                </div>
                <div className="text-sm text-gray-600">Summarized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
{conversations.filter(c => isRecent(c.created_at || c.start_time)).length}
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
              >
                <option value="all">All Chats</option>
                <option value="recent">Recent (7 days)</option>
                <option value="summarized">Summarized</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConversations.map((conversation) => (
            <Link
              key={conversation.id}
              to={`/conversation/${conversation.id}`}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-blue-300 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Conversation Header */}
             <div className="flex items-start justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors">
      <MessageCircle className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
        {conversation.title || "Untitled Conversation"}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>{formatDate(conversation.last_activity || conversation.created_at)}</span>

      </div>
    </div>
  </div>

  {/* 🖊️ Edit & 🗑️ Delete buttons */}
  <div className="flex items-center gap-2">
    
    <button
  onClick={(e) => {
    e.preventDefault();
    console.log("🧩 Conversation ID from button:", conversation.id);
    const newTitle = prompt("Enter new title:");
    if (newTitle && conversation.id) {
      renameConversation(conversation.id, newTitle)
        .then(() => window.location.reload())
        .catch(err => console.error("❌ Rename failed:", err));
    } else {
      alert("Conversation ID is missing!");
    }
  }}
  className="text-gray-400 hover:text-blue-600"
>
  <Edit3 className="w-4 h-4" />
</button>


    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation(); // prevent Link navigation
        console.log("Deleting conversation:", conversation.id);
        if (window.confirm("Delete this conversation?")) {
          try {
            await deleteConversation(conversation.id);
            window.location.reload(); // refresh list
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete conversation.");
          }
        }
      }}
      className="text-gray-400 hover:text-red-600 transition"
      title="Delete Conversation"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</div>


              {/* Summary */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {conversation.summary && conversation.summary.trim() !== "" 
                    ? conversation.summary
                    : "No summary available for this conversation yet."}
                </p>
              </div>

              {/* Conversation Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Bot className="w-4 h-4" />
                    <span>{conversation.message_count || 0} messages</span>
                  </div>
                  {conversation.summary && conversation.summary.trim() !== "" && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span>Summarized</span>
                    </div>
                  )}
                </div>
                {isRecent(conversation.created_at) && (
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span>Recent</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredConversations.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No conversations found</h3>
            <p className="text-gray-600">
              No conversations match your search for "<span className="font-medium">{searchTerm}</span>"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
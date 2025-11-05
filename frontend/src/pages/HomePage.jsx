import { Link } from "react-router-dom";
import { MessageCircle, Brain, FolderKanban, Sparkles, Zap, Shield, ArrowRight, Bot } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Converse naturally with AI and receive context-aware responses instantly.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "hover:shadow-blue-500/25",
      delay: "0"
    },
    {
      icon: FolderKanban,
      title: "Conversation History",
      description: "All your chats are automatically stored, summarized, and easily searchable.",
      color: "from-green-500 to-emerald-500",
      bgColor: "hover:shadow-green-500/25",
      delay: "100"
    },
    {
      icon: Brain,
      title: "AI Intelligence",
      description: "Ask the AI about past discussions and get meaningful insights and analysis.",
      color: "from-purple-500 to-pink-500",
      bgColor: "hover:shadow-purple-500/25",
      delay: "200"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 py-10">
        {/* Header Section */}
        <div className="text-center max-w-4xl">
          {/* Animated Badge */}
          <div className={`inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powered by Advanced AI
            </span>
          </div>

          {/* Main Heading */}
          <div className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Chat Portal
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                ERGOSPHERE SOLUTIONS
              </span>
            </h1>
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Fast</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Secure</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Intelligent</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className={`text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            An intelligent chat management system built with{" "}
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Django + React
            </span>
            .<br />
            Chat with advanced AI, store your conversations, and analyze them anytime.
          </p>

          {/* Feature Cards */}
          <div className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:border-gray-600/50 ${feature.bgColor}`}
                  style={{
                    transitionDelay: `${feature.delay}ms`
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icon with Gradient */}
                  <div className={`relative inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              to="/chat"
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Chatting</span>
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

             <Link
              to="/dashboard"
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              <span>View History</span>
            </Link>

            <Link
              to="/intelligence"
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              <span>AI Analysis</span>
            </Link>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800/50 transition-all duration-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                50ms
              </div>
              <div className="text-gray-400 text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                256-bit
              </div>
              <div className="text-gray-400 text-sm">Encryption</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-8 py-6 inline-block">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AI Chat Portal · Built with ❤️ by{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Gunja Durgarao
              </span>
            </p>
          </div>
        </footer>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
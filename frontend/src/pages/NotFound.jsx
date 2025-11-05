import { Link } from "react-router-dom";
import { Home, ArrowLeft, Bot } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated Bot */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 border border-gray-700 rounded-2xl mb-4 animate-bounce">
            <Bot className="w-10 h-10 text-cyan-400" />
          </div>
          <div className="text-8xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            404
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-gray-100">
          Page Not Found
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have disappeared into the digital void.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 border border-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">
            Need help? Try these pages:
          </p>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <Link to="/chat" className="text-cyan-400 hover:text-cyan-300">
              Chat
            </Link>
            <Link to="/dashboard" className="text-cyan-400 hover:text-cyan-300">
              History
            </Link>
            <Link to="/intelligence" className="text-cyan-400 hover:text-cyan-300">
              Intelligence
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
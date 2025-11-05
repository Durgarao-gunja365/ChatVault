import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ConversationsDashboard from "./pages/ConversationsDashboard";
import ChatPage from "./pages/ChatPage";
import IntelligencePage from "./pages/IntelligencePage";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Homepage";
import ConversationDetailPage from "./pages/ConversationDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/ProfilePage";
import Settings from "./pages/Settings";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import "./App.css";
import "./index.css";

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* 👇 Key forces Navbar re-render when user changes */}
      <Navbar key={user ? user.username : "guest"} /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ConversationsDashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/conversation/:id" element={<ConversationDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

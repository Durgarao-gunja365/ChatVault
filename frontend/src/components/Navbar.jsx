import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";

import {
  User,
  LogOut,
  ChevronDown,
  Settings,
  MessageCircle,
  Brain,
  Home,
  History,
  Sparkles,
  Crown,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, logout, loading } = useContext(AuthContext);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Core navigation items - only shown when logged in
  const loggedInNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "History", icon: History },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/intelligence", label: "Intelligence", icon: Brain },
  ];

  // Minimal navigation items - shown when logged out
  const loggedOutNavItems = [{ path: "/", label: "Home", icon: Home }];

  // Authentication items - only shown when logged out
  const authItems = [
    { path: "/login", label: "Login", icon: User },
    { path: "/register", label: "Register", icon: Sparkles },
  ];

  // Determine which navigation items to show
  const navItems = user ? loggedInNavItems : [...loggedOutNavItems, ...authItems];

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  const getRandomColor = (username) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo/Brand */}
          <div className="nav-brand">
            <Link to="/" className="logo-wrapper">
              <div className="logo-icon">🤖</div>
              <div className="logo-text">
                <span className="logo-primary">ChatVault</span>
                <span className="logo-secondary">AI chat Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-menu">
            {!loading &&
              navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${
                      location.pathname === item.path ? "nav-item-active" : ""
                    }`}
                  >
                    <IconComponent className="nav-icon" size={18} />
                    <span className="nav-label">{item.label}</span>
                    <div className="nav-indicator"></div>
                  </Link>
                );
              })}

            {/* User Menu - Desktop (Only when logged in) */}
            {!loading && user && (
              <div className="user-menu-container relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group border border-white/20"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getRandomColor(
                      user.username
                    )} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
                  >
                    {getInitials(user.username)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      {user.username}
                      <Crown className="w-3 h-3 text-yellow-400" />
                    </p>
                    <p className="text-xs text-gray-300">
                      {getWelcomeMessage()}! 👋
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in-0 zoom-in-95">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getRandomColor(
                            user.username
                          )} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {getInitials(user.username)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                            {user.username}
                            <Crown className="w-3 h-3 text-yellow-500" />
                          </p>
                          <p className="text-xs text-gray-600">
                            Premium Member
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User
                          size={16}
                          className="text-blue-600 group-hover:scale-110 transition-transform"
                        />
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings
                          size={16}
                          className="text-purple-600 group-hover:scale-110 transition-transform"
                        />
                        <span>Preferences</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/10 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors group"
                      >
                        <LogOut
                          size={16}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-toggle ${
              isMobileMenuOpen ? "mobile-toggle-active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* ✅ Mobile Navigation Menu */}
        <div
          className={`mobile-menu ${
            isMobileMenuOpen ? "mobile-menu-open" : ""
          }`}
        >
          <div className="mobile-menu-content">
            {!loading && (
              <>
                {/* Mobile User Info */}
                {user && (
                  <div className="mobile-user-info">
                    <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRandomColor(
                          user.username
                        )} flex items-center justify-center text-white font-semibold text-lg shadow-lg`}
                      >
                        {getInitials(user.username)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold flex items-center gap-2">
                          {user.username}
                          <Crown className="w-4 h-4 text-yellow-400" />
                        </p>
                        <p className="text-gray-300 text-sm">
                          {getWelcomeMessage()}! 👋
                        </p>
                        <p className="text-gray-400 text-xs">Premium Member</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Welcome Message for Logged Out Users */}
                {!user && (
                  <div className="mobile-welcome-message p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl mb-4 border border-white/10">
                    <h3 className="text-white font-semibold mb-1">
                      Welcome to AI Chat Portal
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Sign in to start intelligent conversations
                    </p>
                  </div>
                )}

                {/* Mobile Navigation Items */}
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-item ${
                        location.pathname === item.path
                          ? "mobile-nav-item-active"
                          : ""
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="mobile-nav-icon" size={20} />
                      <span className="mobile-nav-label">{item.label}</span>
                      <div className="mobile-nav-highlight"></div>
                    </Link>
                  );
                })}

                {/* ✅ Mobile User Actions (Logout now always visible) */}
                {user && (
                  <div className="mobile-user-actions border-t border-white/10 pt-4 mt-4">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-2 px-4">
                      Account
                    </div>
                    <Link
                      to="/profile"
                      className="mobile-nav-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="mobile-nav-icon" size={20} />
                      <span className="mobile-nav-label">Profile Settings</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="mobile-nav-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="mobile-nav-icon" size={20} />
                      <span className="mobile-nav-label">Preferences</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="mobile-nav-item text-red-400"
                    >
                      <LogOut className="mobile-nav-icon" size={20} />
                      <span className="mobile-nav-label">Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

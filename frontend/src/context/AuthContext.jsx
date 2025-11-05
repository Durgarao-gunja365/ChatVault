import { createContext, useState, useEffect } from "react";
import api from "../api/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1️⃣ Listen for userUpdated events (login/logout)
  useEffect(() => {
    const handleUserUpdate = () => {
      setUser((prev) => ({ ...prev })); // triggers re-render for Navbar instantly
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  // ✅ 2️⃣ Fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("auth/me/");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data) => {
    try {
      const res = await api.patch("auth/me/update/", data);
      setUser((prev) => ({ ...prev, ...res.data }));
      return res.data;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  // ✅ 3️⃣ Update login() to broadcast userUpdated event
  const login = async (tokens) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    try {
      const res = await api.get("auth/me/");
      setUser(res.data);

      // 🔔 Trigger global event so Navbar updates immediately
      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      console.error("Failed to fetch user after login:", error);
    }
  };

  // ✅ 4️⃣ Update logout() to also trigger event
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);

    // 🔔 Tell app that user changed
    window.dispatchEvent(new Event("userUpdated"));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

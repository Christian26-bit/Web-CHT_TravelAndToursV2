import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("cht_token");
    const savedUser = localStorage.getItem("cht_user");
    if (savedToken && savedUser) {
      Promise.resolve().then(() => {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setLoading(false);
      });
    } else {
      Promise.resolve().then(() => setLoading(false));
    }
  }, []);

  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem("cht_token", tokenValue);
    localStorage.setItem("cht_user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cht_token");
    localStorage.removeItem("cht_user");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

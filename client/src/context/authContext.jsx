import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      // Refresh user data from server to get latest profilePhoto etc.
      api
        .get(`/users/${parsed.id}`)
        .then(({ data }) => {
          const updated = {
            ...parsed,
            profilePhoto: data.profilePhoto,
            name: data.name
          };
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
        })
        .catch(() => {}) // fail silently
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, updateUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

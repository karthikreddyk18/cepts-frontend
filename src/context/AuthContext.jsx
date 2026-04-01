import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // 🔹 Register
  const register = async (formData) => {
    const { data } = await registerUser(formData);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  // 🔹 Login
  const login = async (formData) => {
  const res = await loginUser(formData);

  // ✅ store token
  localStorage.setItem("token", res.data.token);

  return res.data; // 🔥 THIS LINE IS MISSING
};

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(form); // renamed for clarity

      console.log("Login Success:", user);

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        navigate("/admin-dashboard");
      }

    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login 🔐</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
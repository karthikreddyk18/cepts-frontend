import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await register(form);
      console.log("Registered:", res);

      if (form.role === "student") {
        navigate("/student-dashboard");
      } else if (form.role === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        navigate("/admin-dashboard");
      }

    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

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

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
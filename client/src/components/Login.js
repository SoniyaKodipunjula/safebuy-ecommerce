import React, { useState } from "react";
import API from "../api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting login with:", formData);

      const res = await API.post("/auth/login", formData);
      console.log("Login successful:", res.data);

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");

      // Fetch user info
      const userRes = await API.get("/auth/me");
      console.log("User info:", userRes.data);
      setUser(userRes.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      console.error("Login error:", errorMsg);
      setMessage(errorMsg);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMessage("You have been logged out.");
  };
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Login to SafeBuy</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>

      {user && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Welcome, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
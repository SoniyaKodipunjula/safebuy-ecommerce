import React, { useState } from "react";
import API from "../api";

const Login = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      setMessage(res.data.message);
      setStep(2); // Show OTP input
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      console.error("Login error:", errorMsg);
      setMessage(errorMsg);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");

      // Fetch user details
      const userRes = await API.get("/auth/me");
      setUser(userRes.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "OTP verification failed";
      console.error("OTP error:", errorMsg);
      setMessage(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setFormData({ email: "", password: "", otp: "" });
    setStep(1);
    setMessage("You have been logged out.");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Login to SafeBuy</h2>

      {step === 1 && (
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
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP from email"
            value={formData.otp}
            onChange={handleChange}
            required
          /><br /><br />
          <button type="submit">Verify OTP</button>
        </form>
      )}

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

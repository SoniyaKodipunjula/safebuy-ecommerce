import React, { useState } from "react";
import API from "../api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);
  
      console.log("REGISTER RESPONSE:", res); // 👈 Add this to inspect
  
      if (res.status === 201 && res.data?.message) {
        setMessage(res.data.message);
      } else if (res.status === 200 && res.data?.message) {
        setMessage(res.data.message);
      } else {
        setMessage("Unexpected response from server.");
      }
      
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <br /><br />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <br /><br />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <br /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;

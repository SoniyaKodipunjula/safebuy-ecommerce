import React, { useEffect, useState } from "react";
import API from "../api";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("Unauthorized. Please login.");
      return;
    }

    const fetchProtectedData = async () => {
      try {
        const res = await API.get("/protected/dashboard");
        setMessage(res.data.message || "Welcome to your dashboard!");
      } catch (err) {
        setMessage("Access denied or session expired.");
      }
    };

    fetchProtectedData();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <p>{message}</p>
      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

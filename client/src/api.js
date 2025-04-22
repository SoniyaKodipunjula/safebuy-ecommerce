import axios from "axios";

const API = axios.create({
  baseURL: "https://safebuy-ecommerce-backend.onrender.com/api", // ✅ PRODUCTION BACKEND
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
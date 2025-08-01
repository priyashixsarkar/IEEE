import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://your-backend.onrender.com/api",
  withCredentials: true,
});

export default instance;

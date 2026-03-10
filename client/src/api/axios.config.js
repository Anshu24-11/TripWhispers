import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  // withCredentials: true, // for cookie JWT
});

export default API;

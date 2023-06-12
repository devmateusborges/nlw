import axios from "axios";

// api lempre de por ip servidor
export const api = axios.create({
  baseURL: "http://192.168.100.64:3333",
});

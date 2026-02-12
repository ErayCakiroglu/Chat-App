import axios from "axios";

// Backend API adresi
const API_URL = "http://192.168.1.15:3000/api";

// Axios örneği oluşturuluyor (Credentials true ile cookie/session desteği sağlanır)
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export default api;
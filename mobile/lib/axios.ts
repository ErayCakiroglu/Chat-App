import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useCallback, useEffect } from "react";

const API_URL = "http://192.168.1.15:3000/api";

// Temel Axios istemcisini oluştur
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Kimlik doğrulama gerektiren istekler için özel hook
export const useApi = () => {
    const { getToken } = useAuth();

    const apiWithAuth = useCallback(
        async <T>(config: Parameters<typeof api.request>[0]) => {
            // Clerk'ten güncel token'ı al
            const token = await getToken();
            // İsteğe Authorization header'ını ekle
            return api.request<T>({
                ...config,
                headers: { ...config.headers, ...(token && { Authorization: `Bearer ${token}` }) }
            });
        }, [getToken]
    );

    return { api, apiWithAuth };
}
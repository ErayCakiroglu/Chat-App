import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import api from "../lib/axios";

/**
 * useMessages hook: Belirli bir sohbetin mesajlarını getirir.
 * @param {string} chatId - Mesajları getirilecek sohbetin ID'si.
 */
export const useMessages = (chatId) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["messages", chatId],
        queryFn: async () => {
            const token = await getToken();
            const res = await api.get(`/messages/chatId/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!chatId, // Sadece chatId varsa çalışır
    });
}
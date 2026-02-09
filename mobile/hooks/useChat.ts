import { useApi } from "@/lib/axios";
import { Chat } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
    const { apiWithAuth } = useApi();

    // Kullanıcının sohbetlerini getiren sorgu
    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            // Kimlik doğrulamalı API isteği ile sohbetleri çek
            const { data } = await apiWithAuth<Chat[]>({ method: "GET", url: "/chats" });
            return data;
        }
    });
}
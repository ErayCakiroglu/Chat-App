import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";


/**
 * useChats hook: Kullanıcının mevcut sohbetlerini getirir.
 */
export const useChats = () => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const token = await getToken();
            const res = await api.get("/chats", {
                headers: { Authorization: `Bearer${token}` }
            });
            return res.data;
        }
    });
}

/**
 * useGetOrCreateChat hook: Belirli bir kullanıcıyla sohbeti getirir veya yoksa oluşturur.
 */
export const useGetOrCreateChat = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (participantId) => {
            const token = await getToken();
            const res = await api.post(`/chats/with/${participantId}`,
                {},
                { headers: { Authorization: `Bearer${token}` } }
            );
            return res.data;
        },
        // Başarılı olursa sohbet listesini güncelle
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
    });
}
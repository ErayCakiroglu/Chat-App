import { useApi } from "@/lib/axios";
import { Chat } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Belirli bir kullanıcıyla sohbet başlatmak veya var olanı getirmek için kullanılan hook
export const useGetOrCreateChat = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await apiWithAuth<Chat>({
                method: "POST",
                url: `/chat/with${participantId}`
            });
            return data;
        },
        onSuccess: () => {
            // Sohbet listesini güncelle
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        }
    });
}
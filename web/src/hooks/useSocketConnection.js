import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "../lib/socket";

/**
 * useSocketConnection hook: Socket bağlantısını ve oda katılımlarını yönetir.
 * @param {string} activeChatId - Aktif olan sohbetin ID'si.
 */
export const useSocketConnection = (activeChatId) => {
    const { getToken, isSignedIn } = useAuth();
    const queryClient = useQueryClient();

    const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

    // Kullanıcı giriş yaptığında socket bağlantısını kur
    useEffect(() => {
        if (isSignedIn) {
            getToken().then((token) => {
                if (token) connect(token, queryClient);
            });
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [isSignedIn, connect, disconnect, getToken, queryClient]);

    // Aktif sohbet değiştiğinde odaya katıl veya ayrıl
    useEffect(() => {
        if (activeChatId && socket) {
            joinChat(activeChatId);
            return () => leaveChat(activeChatId);
        }
    }, [activeChatId, socket, joinChat, leaveChat]);
};
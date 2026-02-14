import { create } from "zustand";
import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.15:3000/api";

/**
 * useSocketStore: Socket durumunu ve eylemlerini yöneten Zustand store.
 */
export const useSocketStore = create((set, get) => ({
    socket: null,
    onlineUsers: new Set(),
    typingUsers: new Map(),
    queryClient: null,

    // Socket bağlantısını başlatır
    connect: (token, queryClient) => {
        const existingSocket = get().socket;
        if (existingSocket?.connected || !queryClient) return;

        if (existingSocket) existingSocket.disconnect();

        const socket = io(SOCKET_URL, { auth: { token } });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });

        socket.on("socket-error", (error) => {
            console.error("Socket error:", error);
        });

        // Çevrimiçi kullanıcıları güncelle
        socket.on("online-users", ({ userIds }) => {
            set({ onlineUsers: new Set(userIds) });
        });

        // Yeni bir kullanıcı çevrimiçi olduğunda
        socket.on("user-online", ({ userId }) => {
            set((state) => ({
                onlineUsers: new Set([...state.onlineUsers, userId]),
            }));
        });

        socket.on("user-offline", ({ userId }) => {
            set((state) => {
                const onlineUsers = new Set(state.onlineUsers);
                onlineUsers.delete(userId);
                return { onlineUsers };
            });
        });

        // Yazıyor bilgisini güncelle
        socket.on("typing", ({ userId, chatId, isTyping }) => {
            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                if (isTyping) typingUsers.set(chatId, userId);
                else typingUsers.delete(chatId);
                return { typingUsers };
            });
        });

        // Yeni mesaj geldiğinde
        socket.on("new-message", (message) => {
            const senderId = message.sender?._id;

            // Mesajlar cache'ini güncelle
            queryClient.setQueryData(["messages", message.chat], (old) => {
                if (!old) return [message];
                const filtered = old.filter((m) => !m._id.startsWith("temp-"));
                const exists = filtered.some((m) => m._id === message._id);
                return exists ? filtered : [...filtered, message];
            });

            // Sohbet listesindeki son mesajı güncelle
            queryClient.setQueryData(["chats"], (oldChats) => {
                return oldChats?.map((chat) => {
                    if (chat._id === message.chat) {
                        return {
                            ...chat,
                            lastMessage: {
                                _id: message._id,
                                text: message.text,
                                sender: senderId,
                                createdAt: message.createdAt,
                            },
                            lastMessageAt: message.createdAt,
                        };
                    }
                    return chat;
                });
            });

            // Yazıyor bilgisini temizle
            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                typingUsers.delete(message.chat);
                return { typingUsers };
            });
        });

        set({ socket, queryClient });
    },

    // Bağlantıyı kes
    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({
                socket: null,
                onlineUsers: new Set(),
                typingUsers: new Map(),
                queryClient: null,
            });
        }
    },

    // Odaya katıl
    joinChat: (chatId) => {
        get().socket?.emit("join-chat", chatId);
    },

    // Odadan ayrıl
    leaveChat: (chatId) => {
        get().socket?.emit("leave-chat", chatId);
    },

    // Mesaj gönder (Optimistic update ile)
    sendMessage: (chatId, text, currentUser) => {
        const { socket, queryClient } = get();
        if (!socket?.connected || !queryClient) return;

        const tempId = `temp-${Date.now()}`;
        // Geçici mesaj objesi (arayüzde hemen göstermek için)
        const optimisticMessage = {
            _id: tempId,
            chat: chatId,
            sender: {
                _id: currentUser._id,
                name: currentUser.fullName || currentUser.firstName || "You",
                email: currentUser.primaryEmailAddress?.emailAddress || "",
                avatar: currentUser.imageUrl,
            },
            text,
            createdAt: new Date().toISOString(),
        };

        // UI'ı hemen güncelle
        queryClient.setQueryData(["messages", chatId], (old) => {
            if (!old) return [optimisticMessage];
            return [...old, optimisticMessage];
        });

        socket.emit("send-message", { chatId, text });

        // Hata olursa geri al
        socket.once("socket-error", () => {
            queryClient.setQueryData(["messages", chatId], (old) => {
                if (!old) return [];
                return old.filter((m) => m._id !== tempId);
            });
        });
    },

    // Yazıyor bilgisini gönder
    setTyping: (chatId, isTyping) => {
        get().socket?.emit("typing", { chatId, isTyping });
    },
}));
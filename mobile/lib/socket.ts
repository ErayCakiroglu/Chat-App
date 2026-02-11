import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { Chat, Message, MessageSender } from "@/types";

const SOCKET_URL = "http://192.168.1.15:3000/api";

// Socket durumunu ve aksiyonlarını tanımlayan arayüz
interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: Set<string>;
    typingUsers: Map<string, string>;
    unreadChats: Set<string>;
    currentChatId: string | null;
    queryClient: QueryClient | null;

    connect: (token: string, queryClient: QueryClient) => void;
    disconnect: () => void;
    joinChat: (chatId: string) => void;
    leaveChat: (chatId: string) => void;
    sendMessage: (chatId: string, text: string, currentUser: MessageSender) => void;
    sendTyping: (chatId: string, isTyping: boolean) => void;
}

// Zustand ile oluşturulan global socket store'u
export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    typingUsers: new Map(),
    unreadChats: new Set(),
    currentChatId: null,
    queryClient: null,
    // Socket bağlantısını başlatır ve olay dinleyicilerini ayarlar
    connect: (token, queryClient) => {
        const existingSocket = get().socket
        if (existingSocket?.connected) return
        if (existingSocket) existingSocket.disconnect()

        const socket = io(SOCKET_URL, { auth: { token } });
        socket.on("connect", () => {
            console.log("Socket connected, id:", socket.id);
            set({ isConnected: true });
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected, id", socket.id);
            set({ isConnected: false });
        });

        // Çevrimiçi kullanıcı listesini al
        socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
            console.log("Received online-users:", userIds);
            set({ onlineUsers: new Set(userIds) });
        });

        // Yeni bir kullanıcı çevrimiçi olduğunda
        socket.on("user-online", ({ userId }: { userId: string }) => {
            set(state => ({ onlineUsers: new Set([...state.onlineUsers, userId]) }))
        });

        socket.on("user-offline", ({ userId }: { userId: string }) => {
            set((state) => {
                const onlineUsers = new Set(state.onlineUsers);
                onlineUsers.delete(userId)
                return { onlineUsers: onlineUsers }
            })
        });

        socket.on("socket-error", (error: { message: string }) => {
            console.error("Socket errors:", error.message);
        });

        // Yeni mesaj geldiğinde
        socket.on("new-message", (message: Message) => {
            const senderId = (message.sender as MessageSender)._id;
            const { currentChatId } = get();

            // React Query önbelleğini güncelle (mesajlar listesi)
            queryClient.setQueryData<Message[]>(["messages", message.chat], (old) => {
                if (!old) return [message];
                const filtered = old.filter((m) => !m._id.startsWith("temp-"));
                if (filtered.some((m) => m._id === message._id)) return filtered;
                return [...filtered, message]
            });

            // Sohbet listesindeki son mesajı güncelle
            queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
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

            // Eğer kullanıcı şu an o sohbette değilse okunmamış olarak işaretle
            if (currentChatId !== message.chat) {
                const chats = queryClient.getQueryData<Chat[]>(["chats"]);
                const chat = chats?.find((c) => c._id === message.chat);
                if (chat?.participant && senderId === chat.participant._id) {
                    set((state) => ({
                        unreadChats: new Set([...state.unreadChats, message.chat]),
                    }));
                }
            }

            // Mesaj geldiğinde yazıyor bilgisini kaldır
            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                typingUsers.delete(message.chat);
                return { typingUsers: typingUsers };
            });
        });

        // Yazıyor etkinliği dinleyicisi
        socket.on("typing", ({ userId, chatId, isTyping }: { userId: string, chatId: string, isTyping: boolean }) => {
            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                if (isTyping) typingUsers.set(chatId, userId);
                else typingUsers.delete(chatId);

                return { typingUsers: typingUsers }
            })
        });

        set({ socket, queryClient })
    },
    // Socket bağlantısını keser ve durumu temizler
    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({
                socket: null,
                isConnected: false,
                onlineUsers: new Set(),
                typingUsers: new Map(),
                unreadChats: new Set(),
                currentChatId: null,
                queryClient: null
            });
        }
    },
    // Belirli bir sohbet odasına katılır
    joinChat: (chatId) => {
        const socket = get().socket;
        set((state) => {
            const unreadChats = new Set(state.unreadChats)
            unreadChats.delete(chatId)
            return { currentChatId: chatId, unreadChats: unreadChats };
        });

        if (socket?.connected) {
            socket.emit("join-chat", chatId);
        }
    },
    // Sohbet odasından ayrılır
    leaveChat: (chatId) => {
        const socket = get().socket;
        set({ currentChatId: null });
        if (socket?.connected) {
            socket.emit("leave-chat", chatId)
        }
    },
    // Mesaj gönderir (Optimistic update ile)
    sendMessage: (chatId, text, currentUser) => {
        const { socket, queryClient } = get();
        if (!socket?.connected || !queryClient) return;

        const tempId = `temp-${Date.now()}`
        // Geçici mesaj objesi (arayüzde hemen göstermek için)
        const optimisticMessage: Message = {
            _id: tempId,
            chat: chatId,
            sender: currentUser,
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Önbelleği güncelle
        queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
            if (!old) return [optimisticMessage];
            return [...old, optimisticMessage];
        });

        socket.emit("send-message", { chatId, text });

        // Hata durumunda geçici mesajı geri al
        const errorHandler = (error: { message: string }) => {
            queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
                if (!old) return [];
                return old.filter((m) => m._id !== tempId);
            });
            socket.off("socket-error", errorHandler);
        }
        socket.once("socket-error", errorHandler);
    },
    // Yazıyor bilgisini gönderir
    sendTyping: (chatId, isTyping) => {
        const { socket } = get();
        if (socket?.connected) {
            socket.emit("typing", { chatId, isTyping });
        }
    },
}));
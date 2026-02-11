import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { Chat } from "../models/Chat";


// Çevrimiçi kullanıcıları takip etmek için Map (userId -> socketId)
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    // İzin verilen kökenleri (origins) belirle
    const allowedOrigins = ["http://localhost:8081",
        "http://localhost:5173",
        "http://192.168.1.15:8081",
        process.env.FRONTEND_URL
    ].filter(Boolean) as string[];

    // Socket.io sunucusunu başlat ve CORS ayarlarını yap
    const io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } });

    // Kimlik doğrulama middleware'i
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));

        try {
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY as string });

            // Clerk ID ile veritabanından kullanıcıyı bul
            const clerkId = session.sub;
            const user = await User.findOne({ clerkId });
            if (!user) return next(new Error("User not found."));

            socket.data.userId = user._id.toString();
            next();
        } catch (error) {
            next(new Error(error as string));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        // Yeni bağlanan kullanıcıya mevcut çevrimiçi kullanıcıları gönder
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        // Kullanıcıyı çevrimiçi listesine ekle
        onlineUsers.set(userId, socket.id);

        // Diğer kullanıcılara bu kullanıcının çevrimiçi olduğunu bildir
        socket.broadcast.emit("user-online", { userId });

        // Kullanıcıya özel odaya katıl (bildirimler vs. için)
        socket.join(`user:${userId}`);

        // Sohbet odasına katılma
        socket.on("join-chat", (chatId: string) => {
            socket.join(`chat:${chatId}`);
        });

        // Sohbet odasından ayrılma
        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`);
        });

        // Mesaj gönderme işlemi
        socket.on("send-message", async (data: { chatId: string, text: string }) => {
            try {
                const { chatId, text } = data;
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                });

                if (!chat) {
                    socket.emit("socket-error", { message: "Chat not found" });
                    return;
                }

                // Mesajı veritabanına kaydet
                const message = await Message.create({
                    text,
                    sender: userId,
                    chat: chatId
                });

                // Sohbetin son mesajını güncelle
                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();

                // Gönderen bilgilerini doldur
                await message.populate("sender", "name avatar");

                // Mesajı sohbet odasındaki herkese gönder
                io.to(`chat:${chatId}`).emit("new-message", message);

                // Ayrıca katılımcıların kendi odalarına da gönder (bildirim için)
                for (const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-message", message);
                }

            } catch (error) {
                socket.emit("socket-error", { message: "Failed to send message" });
            }
        });

        // Yazıyor etkinliği (İsteğe bağlı eklenebilir)
        socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
            const typingPayload = {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping
            }

            socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);

            try {
                const chat = await Chat.findById(data.chatId);
                if (chat) {
                    const otherParticipantId = chat.participants.find((p: any) => p.toString() !== userId);
                    if (otherParticipantId) {
                        socket.to(`user:${otherParticipantId}`).emit("typing", typingPayload);
                    }
                }
            } catch (error) {

            }
        });

        // Bağlantı kopma durumu
        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
        });

    });
    return io;
}
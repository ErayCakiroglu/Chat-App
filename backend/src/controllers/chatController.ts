import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Types } from "mongoose";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        // Kullanıcının dahil olduğu sohbetleri bul, katılımcı ve son mesaj detaylarını doldur
        const chats = Chat.find({ participants: userId }).populate("participants", "name email avatar").populate("lastMessage").sort({ lastMessageAt: -1 });

        // Frontend için veriyi formatla: Sohbetin "diğer" katılımcısını belirle
        const formattedChats = (await chats).map(chat => {
            const otherParticipant = chat.participants.find((participant: any) => participant._id.toString() !== userId);
            return {
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt
            };
        });
        res.json(formattedChats);
    } catch (error) {
        res.status(500);
        next(error);
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { participantId } = req.params as { participantId: string };

        if (!participantId) {
            res.status(400).json({ message: "Participant ID is required" });
            return;
        }

        if (!Types.ObjectId.isValid(participantId)) {
            res.status(400).json({ message: "Invalid participant ID" });
            return;
        }

        if (participantId === userId) {
            res.status(400).json({ message: "You cannot start a chat with yourself" });
            return;
        }

        // İki kullanıcı arasında zaten bir sohbet var mı kontrol et
        let chat = await Chat.findOne({ participants: { $all: [userId, participantId] } }).populate("participants", "name email avatar").populate("lastMessage");
        if (!chat) {
            // Yoksa yeni bir sohbet oluştur
            const newChat = new Chat({ participants: [userId, participantId] });
            await newChat.save();
            chat = await newChat.populate("participants", "name email avatar");
        }
        // Sohbetin diğer katılımcısını belirle
        const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
        res.json({
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt
        });
    } catch (error) {
        res.status(500);
        next(error);
    }
}
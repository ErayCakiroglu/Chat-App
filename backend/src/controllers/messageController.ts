import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { chatId } = req.params;

        // Sohbetin varlığını ve kullanıcının bu sohbete dahil olup olmadığını kontrol et
        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }

        // Mesajları getir ve gönderen bilgilerini (isim, avatar vb.) doldur
        const messages = await Message.find({ chat: chatId }).populate("sender", "name email avatar").sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500);
        next(error);
    }
} 
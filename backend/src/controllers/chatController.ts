import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const chats = Chat.find({ participants: userId }).populate("participants", "name email avatar").populate("lastMessage").sort({ lastMessageAt: -1 });

        const formattedChats = (await chats).map(chat => {
            const otherPrticipant = chat.participants.find(participant => participant._id.toString() !== userId);
            return {
                _id: chat._id,
                participant: otherPrticipant,
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
        const { participantId } = req.params;
        let chat = await Chat.findOne({ participants: { $all: [userId, participantId] } }).populate("participants", "name email avatar").populate("lastMessage");
        if (!chat) {
            const newChat = new Chat({ participants: [userId, participantId] });
            await newChat.save();
            chat = await newChat.populate("participants", "name email avatar");
        }
        const otherPrticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
        res.json({
            _id: chat._id,
            participant: otherPrticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt
        });
    } catch (error) {
        res.status(500);
        next(error);
    }
}
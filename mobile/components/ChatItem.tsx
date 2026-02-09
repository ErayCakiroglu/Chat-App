import { Chat } from "@/types";
import { Image } from "expo-image";
import { Pressable, View, Text } from "react-native";
import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, onPress }: { chat: Chat, onPress: () => void }) => {
    // Sohbetin diğer katılımcısını al
    const participant = chat.participant;
    const isOnline = true;
    const isTyping = false;
    const hasUnread = false;

    return (
        // Sohbet öğesine tıklandığında detay sayfasına git
        <Pressable className="flex-row items-center py-3 active:opacity-70" onPress={onPress}>
            <View className="relative">
                <Image
                    source={{ uri: participant.avatar }}
                    style={{ width: 56, height: 56, borderRadius: 999 }}>
                </Image>
                {/* Çevrimiçi durum göstergesi */}
                {isOnline && (
                    <View className="absolute bottom-0 right-0 size-4 bg-green-300 rounded-full border-[3px] border-surface" />
                )}
            </View>
            <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between">
                    <Text className={`text-base font-medium ${hasUnread ? "text-primary" : "text-foreground"}`}>
                        {participant.name}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">{hasUnread && <View className="size-2.5 bg-primary rounded-full" />}
                    {/* Son mesajın zamanını göster */}
                    <Text className="text-xs text-subtitle-foreground">
                        {chat.lastMessageAt ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false }) : ""}
                    </Text>
                </View>
                <View className="flex-row items-center justify-center mt-1">
                    {isTyping ? (
                        <Text className="text-sm text-primary italic">typing...</Text>
                    ) : (
                        // Son mesaj içeriğini göster
                        <Text className={`text-sm flex-1 mr-3 ${hasUnread ? "text-foreground  font-medium" : "text-subtitle-foreground"}`} numberOfLines={1}>
                            {chat.lastMessage?.text || "No message yet."}
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

export default ChatItem;
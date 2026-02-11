import ChatItem from "@/components/ChatItem";
import EmptyUI from "@/components/EmptyUI";
import { useChats } from "@/hooks/useChat";
import { Chat } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View, ActivityIndicator, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatTab = () => {
    const router = useRouter();
    // Sohbet verilerini çek
    const { data: chats, isLoading, error, refetch } = useChats();

    // Yükleniyor durumu
    if (isLoading) {
        return (
            <View className="bg-surface flex-1 justify-center items-center">
                <ActivityIndicator size={"large"} color={"#F4A261"} />
            </View>
        );
    }

    // Hata durumu
    if (error) {
        return (
            <View className="flex-1 bg-surface justify-center items-center">
                <Text className="text-red-300">Failed to load chats.</Text>
                <Pressable onPress={() => refetch()} className="mt-4 px-4 py-2 bg-primary rounded-lg">
                    <Text className="text-foreground">Retry</Text>
                </Pressable>
            </View>
        );
    }

    // Sohbet detayına yönlendirme
    const handleChatPress = (chat: Chat) => {
        router.push({
            pathname: "/chat/[id]",
            params: {
                id: chat._id,
                participantId: chat.participant._id,
                name: chat.participant.name,
                avatar: chat.participant.avatar
            }
        });
    }

    return (
        <SafeAreaView className="flex-1 bg-surface">
            {/* Sohbet listesi */}
            <FlatList
                data={chats}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ChatItem chat={item} onPress={() => handleChatPress(item)} />}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
                ListHeaderComponent={<Header />}
                // Liste boşsa gösterilecek bileşen
                ListEmptyComponent={<EmptyUI
                    title="No chats yet"
                    subtitle="Start a conversation!"
                    iconName="chatbubbles-outline"
                    iconColor="#6B6B70"
                    iconsSize={64}
                    buttonLabel="New Chat"
                    onPressButton={() => router.push("/new-chat")} />} />
        </SafeAreaView>
    );
}

export default ChatTab;

function Header() {
    const router = useRouter();

    return (
        <View className="px-5 pt-2 pb-5">
            <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-foreground">Chats</Text>
                <Pressable className="size-10 bg-primary rounded-full items-center justify-center" onPress={() => router.push("/new-chat")}>
                    <Ionicons name="create-outline" size={20} color="0D0D0F" />
                </Pressable>
            </View>
        </View>
    );
}
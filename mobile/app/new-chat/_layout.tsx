import { Stack } from "expo-router";

const NewChatLayout = () => {
    return (
        // Header olmadan sadece stack içeriğini göster
        <Stack screenOptions={{ headerShown: false }} />
    );
}

export default NewChatLayout;
import { Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const ChatTab = () => {

    return (
        <SafeAreaView className="flex-1 bg-surface">
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Text className="text-white">Chat Tab</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ChatTab;
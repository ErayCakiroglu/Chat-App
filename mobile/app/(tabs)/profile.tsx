import { useAuth } from "@clerk/clerk-expo";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const ProfileTab = () => {
    const { signOut } = useAuth();
    return (
        <SafeAreaView className="flex-1 bg-surface">
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Text className="text-white">Profile Tab deneme yazısı acaba mobilde çıkacak mı</Text>
                <Pressable onPress={() => signOut()} className="mt-4 bg-red-400 px-4 py-2 rounded-xl">
                    <Text>Sign Out</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileTab;
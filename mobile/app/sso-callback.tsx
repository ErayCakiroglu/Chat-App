import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const SSOCallback = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Kullanıcı yüklendiğinde ve giriş yaptığında ana sekmelere yönlendir
        if (isLoaded && isSignedIn) {
            router.replace("/(tabs)");
        }
    }, [isLoaded, isSignedIn]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D0D0F" }}>
            <ActivityIndicator size="large" color="#F4A261" />
        </View>
    );
};

export default SSOCallback;
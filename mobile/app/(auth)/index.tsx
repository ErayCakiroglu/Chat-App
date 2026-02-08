import { View, Text, Dimensions, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons";
import useAuthSocial from "@/hooks/useSocialAuth";

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {

    const { handleSocialAuth, loadingStrategy } = useAuthSocial();

    return (
        <View className="flex-1 bg-surface-dark">
            <View className="absolute inset-0 overflow-hidden"></View>
            <SafeAreaView className="flex-1">
                <View className="items-center pt-10">
                    <Image source={require("../../assets/images/logo.png")}
                        style={{ width: 100, height: 100, marginVertical: -20 }}
                        contentFit="contain"></Image>
                    <Text className="text-4xl font-bold text-primary font-serif uppercase">Whisper</Text>
                </View>
                <View className="flex-1 justify-center items-center px-6">
                    <Image source={require("../../assets/images/auth.png")}
                        style={{
                            width: width - 48,
                            height: height * 0.3
                        }}
                        contentFit="contain"></Image>

                    <View className="mt-5 items-center">
                        <Text className="text-5xl font-bold text-foreground text-center font-serif">
                            Connect & Chat
                        </Text>
                        <Text className="text-3xl font-bold text-primary font-serif">Seamlessly</Text>
                    </View>

                    <View className="flex-row gap-4 mt-10">
                        <Pressable className="flex-1 flex-row items-center justify-center gap-2 border border-white py-4 rounded-3xl active:scale-[0.97]"
                            disabled={loadingStrategy === "oauth_google"}
                            onPress={() => handleSocialAuth("oauth_google")}>
                            {loadingStrategy === "oauth_google" ? (<ActivityIndicator size="small" color="#AAAAAA" />) : (
                                <>
                                    <Image source={require("../../assets/images/google.png")}
                                        style={{ width: 20, height: 20 }}
                                        contentFit="contain"></Image>
                                    <Text className="text-white font-serif text-sm">Google</Text>
                                </>
                            )}
                        </Pressable>
                        <Pressable className="flex-1 flex-row items-center justify-center gap-2 border border-white py-4 rounded-3xl active:scale-[0.97]"
                            disabled={loadingStrategy === "oath_apple"}
                            onPress={() => handleSocialAuth("oauth_apple")}>
                            {loadingStrategy === "oauth_apple" ? (<ActivityIndicator size="small" color="#AAAAAA" />) : (
                                <>
                                    <Ionicons name="logo-apple" size={20} color="#FFFFFF"></Ionicons>
                                    <Text className="text-white font-serif text-sm">Apple</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
}

export default AuthScreen;
import { View, Text, Dimensions, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons";
import useAuthSocial from "@/hooks/useSocialAuth";
import { LinearGradient } from "expo-linear-gradient"
import { AnimatedOrb } from "@/components/AnimatedOrb";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {

    const { handleSocialAuth, loadingStrategy } = useAuthSocial();
    const isLoading = loadingStrategy !== null;

    return (
        <View className="flex-1 bg-surface-dark">
            <View className="absolute inset-0 overflow-hidden">
                {/* Arka plan gradyanı */}
                <LinearGradient
                    colors={["#0D0D0F", "#1A1A2E", "#16213E", "#0D0D0F"]}
                    style={{ position: "absolute", width: "100%", height: "100%" }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} />
                {/* Arka plandaki hareketli küreler (Orbs) */}
                <AnimatedOrb colors={["#F4A261", "#E76F51"]}
                    size={300}
                    initialX={-80}
                    initialY={height * 0.1}
                    duration={4000} />
                <AnimatedOrb colors={["#34A261", "#776F51"]}
                    size={100}
                    initialX={20}
                    initialY={height * 0.3}
                    duration={3000} />
                <AnimatedOrb colors={["#A4A261", "#C76F51"]}
                    size={150}
                    initialX={0}
                    initialY={height * 0.4}
                    duration={1500} />
                {/* Bulanıklık efekti */}
                <BlurView intensity={90} tint="dark" style={{ position: "absolute", width: "100%", height: "100%" }} />
            </View>
            <SafeAreaView className="flex-1">
                {/* Logo ve Başlık */}
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

                    {/* Sosyal Giriş Butonları */}
                    <View className="flex-row gap-4 mt-10">
                        <Pressable className="flex-1 flex-row items-center justify-center gap-2 border border-white py-4 rounded-3xl active:scale-[0.97]"
                            disabled={isLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Continue With Google"
                            onPress={() => !isLoading && handleSocialAuth("oauth_google")}>
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
                            disabled={isLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Continue With Apple"
                            onPress={() => !isLoading && handleSocialAuth("oauth_apple")}>
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
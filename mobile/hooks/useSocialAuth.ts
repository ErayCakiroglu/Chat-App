import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

function useAuthSocial() {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    // Sosyal medya sağlayıcısı ile giriş işlemini başlatır
    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        if (loadingStrategy) return;
        setLoadingStrategy(strategy);

        try {
            // Clerk SSO akışını başlat
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });
            if (!createdSessionId || !setActive) {
                const provider = strategy === "oauth_google" ? "Google" : "Apple";
                Alert.alert("Sign in complete", `${provider} sign in did not complete. Please try again`);
                return;
            }

            // Oturumu aktif hale getir
            await setActive({ session: createdSessionId });
        } catch (error) {
            console.log("Error in social auth: ", error);
            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again later.`);
        }
        finally {
            setLoadingStrategy(null);
        }
    }

    return { handleSocialAuth, loadingStrategy };
}

export default useAuthSocial;
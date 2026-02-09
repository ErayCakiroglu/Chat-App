import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
    const { apiWithAuth } = useApi();

    // Kullanıcı giriş yaptıktan sonra backend ile senkronizasyon sağlayan mutasyon
    return useMutation({
        mutationFn: async () => {
            // Backend'e kullanıcı bilgilerini kaydetmek/güncellemek için istek atar
            const { data } = await apiWithAuth<User>({ method: "POST", url: "/auth/callback" });
            return data;
        }
    });
}
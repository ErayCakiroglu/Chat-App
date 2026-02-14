import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../lib/axios";

/** Kullanıcıyı backend ile senkronize eden hook */
function useUserSync() {
    const { isSignedIn, getToken } = useAuth();

    // Kullanıcı bilgilerini backend'e göndermek için mutation tanımı
    const { mutate: syncUser, isPending, isSuccess } = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            // Auth token ile backend'e istek atılıyor
            const res = await api.post("/auth/callback", {}, { headers: { Authorization: `Bearer ${token}` } });
            return res.data;
        },
    });

    // Kullanıcı giriş yaptıysa ve henüz senkronize olmadıysa işlemi başlat
    useEffect(() => {
        if (isSignedIn && !isPending && !isSuccess) {
            syncUser();
        }
    }, [isSignedIn, syncUser, isPending, isSuccess]);

    return { isSignedIn: isSuccess, isSyncing: isPending };
}

export default useUserSync;
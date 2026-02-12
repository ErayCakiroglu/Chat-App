import { useAuth } from "@clerk/clerk-react";

// Sohbet sayfası bileşeni: Giriş yapmış kullanıcılar için ana arayüz
function ChatPage() {
    const { signOut } = useAuth();
    return (
        <div> Chat Page
            <button onClick={signOut}>Sign Out</button>

        </div>);

}

export default ChatPage;
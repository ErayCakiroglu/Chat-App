import { Routes, Route, Navigate } from "react-router";
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import { useAuth } from "@clerk/clerk-react";
import PageLoader from "./components/PageLoader";
import useUserSync from "./hooks/useUserSync";

// Ana uygulama bileşeni ve yönlendirme yapılandırması
function App() {
  const { isLoaded, isSignedIn } = useAuth();
  // Kullanıcı giriş yaptıysa backend ile senkronize et
  useUserSync();

  // Auth durumu yüklenirken loader göster
  if (!isLoaded) return <PageLoader />

  return (
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/chat"} />} />
      <Route path="/chat" element={isSignedIn ? <ChatPage /> : <Navigate to={"/"} />} />
    </Routes>
  )
}

export default App

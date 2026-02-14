# Whisper Web Client

Whisper uygulamasının web arayüzü. React ve Vite ile geliştirilmiş modern, hızlı ve responsive bir sohbet uygulamasıdır.

## 🛠 Kullanılan Teknolojiler

- **Core:** React, Vite
- **Styling:** Tailwind CSS, DaisyUI
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Authentication:** Clerk (@clerk/clerk-react)
- **Real-time:** Socket.io Client
- **Icons:** Lucide React

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Çevresel Değişkenleri Ayarlayın (.env)

Ana dizinde bir `.env` dosyası oluşturun:

```env
VITE_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
VITE_API_URL=<YOUR_DEPLOYED_API_URL>
```

*Not: Socket bağlantısı için `lib/socket.js` dosyasındaki IP/URL yapılandırmasını kontrol etmeyi unutmayın.*

### 3. Uygulamayı Başlatın

```bash
npm run dev
```

Uygulama genellikle `http://localhost:5173` adresinde çalışacaktır.

## 📂 Proje Yapısı

- `/src/components`: UI bileşenleri (ChatHeader, MessageBubble vb.)
- `/src/hooks`: Custom hook'lar (useChats, useSocketConnection vb.)
- `/src/lib`: Yardımcı fonksiyonlar ve yapılandırmalar (axios, socket store)
- `/src/pages`: Sayfa düzenleri

## ✨ Özellikler

- Gerçek zamanlı mesajlaşma
- Çevrimiçi/Çevrimdışı durum takibi
- Yazıyor (Typing) göstergesi
- Kullanıcı arama ve yeni sohbet başlatma
```
# Whisper Mobile App

Whisper uygulamasının mobil versiyonu. React Native kullanılarak iOS ve Android platformları için geliştirilmiştir.

## 🛠 Kullanılan Teknolojiler

- **Framework:** React Native (Expo veya CLI)
- **Authentication:** Clerk (React Native SDK)
- **Real-time:** Socket.io Client
- **Styling:** NativeWind / StyleSheet
- **Navigation:** React Navigation

## 🚀 Kurulum

### 1. Ön Hazırlık

- Node.js yüklü olmalıdır.
- iOS için Xcode (Mac gerektirir), Android için Android Studio yüklü olmalıdır.
- Eğer Expo kullanılıyorsa `Expo Go` uygulaması telefonunuzda yüklü olmalıdır.

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 3. Çevresel Değişkenler

Proje kök dizininde `.env` dosyasını yapılandırın:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://<BILGISAYAR_IP_ADRESINIZ>:3000/api
```

*Not: Mobil cihazda test ederken `localhost` yerine bilgisayarınızın yerel IP adresini kullanmanız gerekir.*

### 4. Uygulamayı Başlatın

```bash
npx expo start
# veya CLI kullanıyorsanız
npm run android
# npm run ios
```

## 📱 Test Etme

- **Fiziksel Cihaz:** QR kodu taratarak (Expo) veya USB ile bağlayarak.
- **Emülatör:** Android Studio veya Xcode simülatörleri üzerinden.
```
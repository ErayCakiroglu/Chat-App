# Whisper Backend

Whisper uygulamasının sunucu tarafı. Node.js ve Express üzerinde çalışır, gerçek zamanlı mesajlaşma için Socket.io kullanır ve veritabanı olarak MongoDB'den yararlanır.

## 🛠 Kullanılan Teknolojiler

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Real-time:** Socket.io
- **Authentication:** Clerk (@clerk/express)
- **Language:** TypeScript / JavaScript

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Çevresel Değişkenleri Ayarlayın (.env)

Ana dizinde bir `.env` dosyası oluşturun ve aşağıdaki değerleri kendi yapılandırmanıza göre doldurun:

```env
PORT=3000
MONGODB_URI=<YOUR_MONGO_DB_URI>
CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>
FRONTEND_URL=http://localhost:5173
```

### 3. Uygulamayı Başlatın

Geliştirme modunda başlatmak için:

```bash
npm run dev
```

Production modunda başlatmak için:

```bash
npm start
```

## 📡 Socket.io Olayları (Events)

- `connection`: Kullanıcı bağlandığında tetiklenir.
- `join-chat`: Kullanıcı bir sohbet odasına katıldığında.
- `send-message`: Mesaj gönderildiğinde.
- `typing`: Yazıyor göstergesi için.
- `new-message`: İstemciye yeni mesaj iletildiğinde.
- `online-users`: Çevrimiçi kullanıcı listesini günceller.
```

### 2. Web README

Web tarafında React, Vite, Tailwind CSS ve DaisyUI kullanılmış. State yönetimi için Zustand ve veri çekme işlemleri için React Query (TanStack Query) tercih edilmiş.

```diff

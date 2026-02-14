# Whisper 🤫

Whisper, modern web ve mobil teknolojileri kullanılarak geliştirilmiş, gerçek zamanlı, güvenli ve ölçeklenebilir bir sohbet uygulamasıdır.

Bu proje; sunucu tarafı (Backend), web arayüzü (Web) ve mobil uygulama (Mobile) olmak üzere üç ana katmandan oluşan tam kapsamlı (full-stack) bir çözümdür.

## 📂 Proje Yapısı

Proje, monorepo benzeri bir yapıda organize edilmiştir ve aşağıdaki ana klasörlerden oluşur:

- **[`/backend`](./backend)**: Node.js, Express ve Socket.io ile oluşturulmuş sunucu uygulaması. Veritabanı olarak MongoDB kullanır ve tüm API/Socket isteklerini yönetir.
- **`/web`**: React ve Vite ile geliştirilmiş, Tailwind CSS ve DaisyUI kullanan modern web istemcisi.
- **`/mobile`**: React Native ile geliştirilmiş, iOS ve Android cihazlarda çalışan mobil uygulama.

## 🚀 Temel Özellikler

- **Gerçek Zamanlı İletişim:** Socket.io altyapısı sayesinde mesajlar anlık olarak iletilir.
- **Kimlik Doğrulama:** Clerk entegrasyonu ile güvenli ve kolay kullanıcı girişi/kaydı.
- **Durum Takibi:** Kullanıcıların çevrimiçi/çevrimdışı durumlarını anlık görme.
- **Yazıyor Göstergesi:** Karşı tarafın mesaj yazdığını belirten görsel geri bildirim.
- **Platformlar Arası Senkronizasyon:** Web ve mobil uygulamalar arasında kesintisiz veri akışı.

## 🛠 Teknoloji Yığını (Tech Stack)

| Alan | Teknolojiler |
|---|---|
| **Backend** | Node.js, Express.js, Socket.io, MongoDB, Mongoose |
| **Web** | React, Vite, Tailwind CSS, DaisyUI, Zustand, TanStack Query |
| **Mobile** | React Native, Expo, NativeWind |
| **Auth** | Clerk |

## 🏁 Kurulum ve Başlangıç

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/kullaniciadi/whisper.git
    cd whisper
    ```

2.  **Modülleri Kurun:**
    Her bir klasör (`backend`, `web`, `mobile`) kendi bağımsız `package.json` dosyasına ve kurulum yönergelerine sahiptir. Lütfen detaylı kurulum için ilgili klasörün içindeki `README.md` dosyasını okuyun.

    *Öneri: Önce Backend servisini ayağa kaldırmanız, ardından Web veya Mobile uygulamalarını başlatmanız tavsiye edilir.*

---
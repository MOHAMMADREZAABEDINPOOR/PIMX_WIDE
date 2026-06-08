<div align="center">
<h1>PIMX_WIDE 🔐🌍</h1>
<p><strong>Advanced Multilingual Text Encryption & Decryption Platform</strong></p>
</div>

[![Persian Description](https://img.shields.io/badge/Read-Persian%20Description-0A66C2?style=for-the-badge)](#persian-description)
[![Website](https://img.shields.io/badge/Live-pimxwide.pages.dev-0ea5e9?style=for-the-badge)](https://pimxwide.pages.dev/)

---

## 🌐 Live Website

**Production URL:** [https://pimxwide.pages.dev/](https://pimxwide.pages.dev/)

---

## 🧩 What is PIMX_WIDE?

PIMX_WIDE is a modern, **bilingual (EN/FA)** encryption and decryption web application designed for users who need to securely encode text using creative multilingual character sets. It transforms plain text into encrypted outputs using various alphabets and cipher techniques across **23+ languages**.

### Key Capabilities:
- 🔐 **Advanced Encryption** using PBKDF2 + AES-256-GCM
- 🌍 **23+ Language Support** (English, Persian, Russian, Chinese, German, French, Japanese, Korean, Arabic, Hebrew, Greek, Thai, Spanish, Italian, Portuguese, Swedish, Finnish, Icelandic, Turkish, Romanian, Irish, and more)
- 📝 **Multiple Character Sets** for encoding (Latin Extended, Cyrillic, Persian/Arabic, Chinese, Japanese, Korean, Greek, Hebrew, Thai, and special symbols)
- ⏱️ **Automatic Expiration** - Encrypted data expires after 2 days for security
- 🌗 **Dark/Light Theme Support**
- 📱 **Fully Responsive Design**
- 🔒 **Client-Side Encryption** - Your data stays private

---

## ✨ Core Features

### 🔐 Security
- **AES-256-GCM Encryption** with PBKDF2 key derivation
- Secure random IV and salt generation
- Base64 encoding for safe text transmission
- Private encryption (data never leaves your browser)

### 🎨 User Experience
- **Fast, Intuitive Interface** for encrypt/decrypt operations
- **Real-time Processing** with instant results
- **Shareable Links** for encrypted messages
- **Copy-to-Clipboard** functionality
- **Preset Expiration** (2-day auto-delete)

### 🌐 Multilingual Support
- **Full UI Localization** (English & Persian)
- **RTL/LTR Text Direction Support**
- **Multi-language Character Set Mixing** in cipher

### ⚙️ Advanced Options
- Character set selection
- Custom output formatting
- Encryption validation
- Detailed error messages

### 📊 Admin Analytics Panel
- **Route:** `/pimxwideadmin`
- **Username:** `PIMX_WIDE`
- **Password:** `123456789PIMX_WIDE@#$%^&`
- Real-time encryption/decryption statistics
- Language usage analytics
- Device information tracking

---

## 🔐 Data & Privacy Model

This project prioritizes **user privacy** with a clear data separation strategy:

### Stored in Cloud (Optional Analytics Database):
- Encryption events (timestamps, language pairs)
- Device category metadata
- Feature usage statistics

### Stored Only in Browser (LocalStorage):
- Encrypted message history
- User preferences and settings
- Language/theme selection

**Result:** Analytics are global while all user data remains completely local. ✅

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type-safe Development |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **TweetUI/Lucide** | Icons & Components |
| **Motion** | Smooth Animations |
| **Cloudflare Pages** | Hosting & Deployment |

---

## 🚀 Local Development

### Prerequisites
- Node.js 16+ (18+ recommended)
- npm or yarn

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE.git
   cd PIMX_WIDE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open your browser at: [http://localhost:5173](http://localhost:5173)

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## ☁️ Cloudflare Pages Deployment

### Configuration Requirements

**Build Settings:**
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** 18+ recommended

### wrangler.toml Configuration

Keep only these essential keys for Pages compatibility:

```toml
name = "pimx-wide"
pages_build_output_dir = "dist"
```

**⚠️ Important:** Avoid adding unsupported build blocks to `wrangler.toml` for Pages.

---

## 📁 Project Structure

```
PIMX_WIDE/
├── src/
│   ├── App.tsx                 # Main application entry
│   ├── constants.ts            # Character set definitions
│   ├── types.ts                # TypeScript type definitions
│   ├── components/
│   │   └── Layout.tsx          # Main layout wrapper
│   ├── contexts/
│   │   └── LanguageContext.tsx # Language & theme state
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── Encrypt.tsx         # Encryption interface
│   │   ├── Decrypt.tsx         # Decryption interface
│   │   ├── Admin.tsx           # Analytics dashboard
│   │   ├── About.tsx           # About page
│   │   ├── Privacy.tsx         # Privacy policy
│   │   ├── Terms.tsx           # Terms of service
│   │   └── SLA.tsx             # SLA information
│   ├── services/
│   │   ├── cipherService.ts    # Encryption logic
│   │   ├── storageService.ts   # LocalStorage manager
│   │   └── telemetryService.ts # Analytics service
│   └── data/
│       └── languages.ts        # Language definitions
├── public/
│   └── _redirects              # Cloudflare routing
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## 🔧 Encryption Algorithm Details

**Cipher:** AES-256-GCM  
**Key Derivation:** PBKDF2 (SHA-256)  
**Salt Size:** 16 bytes  
**IV Size:** 12 bytes  
**Iterations:** 100,000  

This ensures military-grade encryption for sensitive text data.

---

## 📜 License & Legal

- **Privacy Policy:** [/privacy](/privacy)
- **Terms of Service:** [/terms](/terms)
- **Service Level Agreement:** [/sla](/sla)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.

---

<a id="persian-description"></a>

# PIMX_WIDE 🔐🌍
## توضیحات فارسی

PIMX_WIDE یک ابزار رمزنگاری و رمزگشایی **دو زبانه (فارسی/انگلیسی)** است که برای کاربرانی طراحی شده‌ است که نیاز به رمزگذاری امن متن دارند. این ابزار از مجموعه‌های کاراکتری متنوع در **23+ زبان** استفاده می‌کند.

### ✨ ویژگی‌های اصلی:
- 🔐 **رمزنگاری پیشرفته** با PBKDF2 + AES-256-GCM
- 🌍 **پشتیبانی 23+ زبان** (انگلیسی، فارسی، روسی، چینی، آلمانی، فرانسوی، ژاپنی، کره‌ای، و بسیاری دیگر)
- 📝 **مجموعه‌های کاراکتری متعدد** برای رمزگذاری
- ⏱️ **انقضای خودکار** - داده‌های رمزشده بعد از 2 روز پاک می‌شوند
- 🌗 **پشتیبانی از تم روشن/تاریک**
- 📱 **طراحی کاملاً واکنش‌پذیر**
- 🔒 **رمزنگاری در سمت کلاینت** - داده‌های شما خصوصی می‌مانند

### 🔐 امنیت
- رمزنگاری **AES-256-GCM** با استخراج کلید PBKDF2
- تولید تصادفی امن برای IV و Salt
- کدگذاری Base64 برای انتقال ایمن
- رمزنگاری خصوصی (داده‌ها هرگز از مرورگر شما خارج نمی‌شوند)

### 🎨 تجربه کاربری
- **رابط سریع و شهودی** برای رمزگذاری/رمزگشایی
- **پردازش بلافاصله** با نتایج آنی
- **لینک‌های قابل اشتراک** برای پیام‌های رمزشده
- **کپی به کلیپ‌بورد**
- **انقضای از پیش تعیین شده** (حذف خودکار 2 روزه)

### 📊 پنل مدیریت و تحلیل‌گر
- **مسیر:** `/pimxwideadmin`
- **نام کاربری:** `PIMX_WIDE`
- **رمز عبور:** `123456789PIMX_WIDE@#$%^&`

### 🌐 پشتیبانی چندزبانه
- **محلی‌سازی کامل رابط** (انگلیسی و فارسی)
- **پشتیبانی از جهت متن RTL/LTR**
- **ترکیب کاراکترهای چندزبانه** در رمز

### 🛠️ پشته تکنولوژی
| تکنولوژی | هدف |
|---------|-----|
| **React 18** | فریم‌ورک UI |
| **TypeScript** | توسعه با تایپ ایمن |
| **Vite** | ابزار Build و Dev Server |
| **Tailwind CSS** | طراحی و استایل‌دهی |
| **Lucide Icons** | آیکون‌ها و کامپوننت‌ها |
| **Cloudflare Pages** | هاست و배포 |

### 🚀 راه‌اندازی محلی

**پیش‌نیازها:**
- Node.js 16+ (18+ توصیه شده)

**مراحل نصب:**

1. **نصب وابستگی‌ها:**
   ```bash
   npm install
   ```

2. **اجرای سرور توسعه:**
   ```bash
   npm run dev
   ```
   آدرس: [http://localhost:5173](http://localhost:5173)

3. **ساخت نسخه تولید:**
   ```bash
   npm run build
   ```

### ☁️배포روی Cloudflare Pages

**تنظیمات ضروری:**
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js:** 18+

### 📜 قوانین و خط‌مشی

- **سیاست حریم‌خصوصی:** [/privacy](/privacy)
- **شرایط استفاده:** [/terms](/terms)
- **توافق‌نامه سطح خدمات:** [/sla](/sla)

---

**Made with ❤️ by [Mohammad Reza Abedinpoor](https://github.com/MOHAMMADREZAABEDINPOOR)**

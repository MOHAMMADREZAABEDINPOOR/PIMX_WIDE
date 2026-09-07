<div align="center">

<!-- ============================================================================== -->
<!-- DYNAMIC ANIMATED CAPSULE HEADER                                                -->
<!-- ============================================================================== -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=220&section=header&text=PIMX_WIDE&fontSize=42&fontAlignY=35&desc=%E2%9A%A1%20Advanced%20Multilingual%20AES-256-GCM%20Cryptographic%20Suite&descFontSize=16&descAlignY=62" alt="PIMX_WIDE Banner" width="100%" />

<!-- ============================================================================== -->
<!-- ANIMATED TYPING SVG TELEMETRY                                                 -->
<!-- ============================================================================== -->
<a href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=1000&color=00D2FF&center=true&vCenter=true&width=780&lines=Military-Grade+AES-256-GCM+Authenticated+Symmetric+Encryption;Hardware-Accelerated+Browser+Web+Crypto+API+Implementation;PBKDF2+Key+Derivation+with+100%2C000%2B+SHA-256+Iterations;Zero-Knowledge+Client-Side+Architecture+(Keys+Never+Leave+RAM);Universal+File%2C+PDF%2C+Text+%26+Code+Payload+Concealment;23%2B+International+Languages+with+Native+Persian+RTL+Support" alt="Typing SVG" />
</a>

<br/>

<!-- ============================================================================== -->
<!-- BADGES MATRIX                                                                  -->
<!-- ============================================================================== -->
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge&logo=gnu)](https://www.gnu.org/licenses/agpl-3.0)
[![React: 18+](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Web Crypto API](https://img.shields.io/badge/Crypto-Web_Crypto_API-0052CC?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Languages: 23+](https://img.shields.io/badge/Languages-23+_Locales-28a745?style=for-the-badge)](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#persian-documentation)

<p align="center">
  <b>PIMX_WIDE</b> is an enterprise zero-knowledge cryptographic web suite supporting 23+ global languages. By executing hardware-accelerated AES-256-GCM authenticated encryption and PBKDF2 key derivation directly in the user's browser memory via the native Web Crypto API, PIMX_WIDE ensures that plaintexts and encryption keys never touch a remote server or persistent storage.
</p>

<!-- ============================================================================== -->
<!-- QUICK NAVIGATION ANCHORS                                                       -->
<!-- ============================================================================== -->
[Cryptographic Specs](#-cryptographic-specifications) •
[Directory Anatomy](#-exhaustive-directory--file-anatomy) •
[Security Architecture](#-security--zero-knowledge-architecture) •
[Quick Start](#-quick-start--local-development) •
[توضیحات فارسی](#persian-documentation) •
[Roadmap](#-strategic-engineering-roadmap) •
[License](#-copyleft-license--legal-attribution)

</div>

---

## 🔒 Cryptographic Specifications

| Parameter | Specification | Implementation Standard |
| :--- | :--- | :--- |
| **Cipher Algorithm** | AES-GCM | NIST SP 800-38D authenticated encryption with 256-bit symmetric keys. |
| **Integrity Tag** | 128-bit Tag | Guarantees tamper detection and protection against chosen-ciphertext attacks. |
| **Key Derivation** | PBKDF2 | RFC 8018 with HMAC-SHA-256 and 100,000+ derivation rounds. |
| **Initialization Vector** | 96-bit CSPRN | Generated uniquely per operation using `window.crypto.getRandomValues()`. |
| **Memory Isolation** | In-Memory Only | Cryptographic buffers are zeroed out after encryption cycle. |

---

## 📂 Exhaustive Directory & File Anatomy

```
d:/code/PIMXWIDE/
│
├── App.tsx                          # Primary layout coordinator, routing state & cipher workbench switcher
├── constants.ts                     # Cipher constants, algorithm parameters & PBKDF2 iteration configurations
├── index.html                       # HTML5 entry point with strict Content Security Policy (CSP) headers
├── index.tsx                        # React 18 DOM bootstrap & mounting
├── metadata.json                    # Package metadata & build descriptors
├── package.json                     # Dependencies (React, TypeScript, Lucide React, Tailwind CSS)
├── README.md                        # Master comprehensive bilingual documentation
│
├── pages/                           # Application Views
│   ├── Home.tsx                     # Landing page with interactive cryptographic workbench
│   ├── Encrypt.tsx                  # Dedicated text and multi-file encryption interface
│   ├── Decrypt.tsx                  # Ciphertext inspector, integrity verifier & payload unpacker
│   ├── Admin.tsx                    # Protected telemetry console viewing usage statistics
│   ├── About.tsx                    # Mathematical breakdown of AES-GCM & PBKDF2
│   ├── SLA.tsx                      # Service Level Agreement & zero-knowledge guarantee
│   ├── Privacy.tsx                  # Comprehensive privacy policy asserting zero-tracking
│   └── Terms.tsx                    # Terms of service and open-source usage guidelines
│
├── services/                        # Cryptographic & Storage Logic
│   ├── cipherService.ts             # Web Crypto API engine executing AES-GCM & PBKDF2
│   ├── storageService.ts            # Local encrypted container storage manager
│   └── telemetryService.ts          # Anonymized client event counter
│
├── contexts/                        # React Context Providers
│   └── LanguageContext.tsx          # 23-language internationalization context & switcher
│
├── data/                            # Static localization resources
│   └── languages.ts                 # Full localization dictionaries (Persian, English, Russian, etc.)
│
└── functions/                       # Cloudflare Pages Serverless Edge API
    └── api/
        └── visits.ts                # Anonymous visit counter endpoint
```

---

## 🔬 Security & Zero-Knowledge Architecture

```
[ User Plaintext / File ] + [ User Passphrase ]
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│             Browser RAM (Zero Network Access)          │
│                                                        │
│ • window.crypto.getRandomValues(salt, iv)              │
│ • PBKDF2-HMAC-SHA256 (100,000 rounds)                 │
│ • AES-256-GCM Hardware-Accelerated Block Cipher       │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│             Authenticated Ciphertext Container         │
│  [ 16-byte Salt ] + [ 12-byte IV ] + [ Ciphertext ] + [ 16-byte Tag ]
└───────────────────────┬────────────────────────────────┘
                        │
        (Export as Base64 String or .pimx Container)
```

---

## 🚀 Quick Start & Local Development

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE.git
cd PIMX_WIDE

npm install
npm run dev
```
Open `http://localhost:5173` to test encryption locally.

---

## Persian Documentation
### 🇮🇷 مستندات فوق‌العاده مفصل، جامع و فنی به زبان فارسی

### ۱. مقدمه و چرایی ساخت سامانه رمزنگاری PIMX_WIDE
پروژه **PIMX_WIDE** یک کارگاه امنیتی و پلتفرم رمزنگاری پیشرفته کلاینت‌ساید بر پایه استاندارد نظامی **AES-256-GCM** است. در عصری که ارتباطات اینترنتی به شدت تحت نظارت، فیلترینگ و استراق سمع قرار دارند، ارسال اطلاعات حساس (مانند رمزهای عبور، کلیدهای خصوصی ارز دیجیتال، و اسناد محرمانه) از طریق پیام‌رسان‌ها خطرات بسیار بزرگی به همراه دارد.

**PIMX_WIDE** تضمین می‌کند که هیچ سروری نمی‌تواند پیام‌های شما را بخواند؛ زیرا تمامی مراحل رمزگذاری درون حافظه موقت (RAM) کامپیوتر یا گوشی شما و به کمک موتور سخت‌افزاری مرورگر انجام شده و خروجی آن به یک متن غیرقابل رمزگشایی با استاندارد نظامی تبدیل می‌شود.

---

### ۲. تشریح ساختار فایل‌های پروژه
- **`services/cipherService.ts`**: مغز محاسباتی پروژه؛ برقراری ارتباط با توابع سطح پایین مرورگر (**Web Crypto API**)، تولید بردار اولیه تصادفی (IV) و اشتقاق کلید با الگوریتم PBKDF2.
- **`pages/Encrypt.tsx` و `pages/Decrypt.tsx`**: رابط‌های گرافیکی مدرن برای رمزگذاری و رمزگشایی متن و فایل‌ها به همراه محاسبه‌گر آنتروپی رمزعبور.
- **`data/languages.ts`**: ترجمه کامل برنامه به بیش از ۲۳ زبان زنده دنیا با پشتیبانی ۱۰۰٪ از خط فارسی و چیدمان راست‌چین.

---

## 📜 Copyleft License & Legal Attribution

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

<div align="center">

<!-- ============================================================================== -->
<!-- ANIMATED CAPSULE FOOTER                                                        -->
<!-- ============================================================================== -->
<img src="./assets/footer.svg" alt="PIMX_WIDE 3D Footer" width="100%" />

<sub>Architected with dedication by <a href="https://github.com/MOHAMMADREZAABEDINPOOR"><b>MOHAMMADREZA ABEDINPOOR</b></a>. If PIMX_WIDE safeguards your digital privacy, consider leaving a ⭐!</sub>

</div>

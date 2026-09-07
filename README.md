<div align="center">

# 🔐 PIMX_WIDE 🛡️🌍
### Advanced Multilingual AES-256-GCM Text & Binary Cryptographic Suite

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![React: 18+](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Web Crypto API](https://img.shields.io/badge/Crypto-Web_Crypto_API-0052CC?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Languages: 23+](https://img.shields.io/badge/Languages-23+_Locales-28a745?style=for-the-badge)](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-فوقالعاده-جامع-فارسی-persian-documentation)

<p align="center">
  A military-grade, zero-knowledge cryptographic web workstation supporting 23+ global languages. Implements hardware-accelerated AES-256-GCM authenticated encryption and PBKDF2 key derivation directly in the user's browser memory, guaranteeing that plaintexts and encryption keys never traverse the network.
</p>

[Cryptographic Specs](#-cryptographic-specifications) •
[Directory Structure](#-directory--file-structure) •
[Security Architecture](#-security--zero-knowledge-architecture) •
[Quick Start](#-quick-start) •
[توضیحات فارسی](#-توضیحات-فوقالعاده-جامع-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## 🔒 Cryptographic Specifications

- **Cipher Algorithm**: AES-GCM (Galois/Counter Mode) with 256-bit symmetric keys.
- **Integrity Tag**: 128-bit authentication tag validating ciphertext against bit-flipping attacks.
- **Key Derivation Function (KDF)**: PBKDF2 with HMAC-SHA-256 and 100,000+ iterations.
- **Initialization Vector (IV)**: 96-bit cryptographically secure pseudorandom number (CSPRN) uniquely generated per operation via `crypto.getRandomValues()`.
- **Zero-Knowledge Architecture**: 100% Client-Side. No keys or unencrypted texts are transmitted or logged.

---

## 📂 Directory & File Structure

```
PIMXWIDE/
│
├── App.tsx                          # Primary layout orchestrator, routing & tab state
├── constants.ts                     # System constants, supported algorithms & cipher params
├── index.html                       # HTML5 entrypoint with security headers & CSP directives
├── index.tsx                        # React 18 DOM bootstrap & mounting
├── metadata.json                    # Package metadata & build descriptors
├── package.json                     # Dependencies & build scripts
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
[ User Plaintext + Passphrase ]
               │
               ▼
┌──────────────────────────────────────────────┐
│       Browser Memory (RAM Only)              │
│  - CSPRN 96-bit IV Generation                │
│  - PBKDF2 100,000x SHA-256 Iterations        │
│  - AES-256-GCM Hardware Acceleration         │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Output Authenticated Container              │
│  [ 12-byte IV ] + [ Ciphertext ] + [ 16-byte Tag ]
└──────────────────────┬───────────────────────┘
                       │
          (Export as Base64 / .pimx File)
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE.git
cd PIMX_WIDE

npm install
npm run dev
```
Open `http://localhost:5173` to test encryption and decryption in your browser.

---

## 🇮🇷 توضیحات فوق‌العاده جامع فارسی (Persian Documentation)

### ۱. معرفی سامانه رمزنگاری چندزبانه PIMX_WIDE
پروژه **PIMX_WIDE** یک کارگاه امنیتی و پلتفرم رمزنگاری پیشرفته کلاینت‌ساید بر پایه استاندارد نظامی **AES-256-GCM** است. این ابزار به کاربران امکان می‌دهد تا متن‌های بسیار محرمانه، پسوردها و فایل‌های خود را با پسوردهای دلخواه رمزگذاری کنند، به گونه‌ای که حتی قوی‌ترین ابرکامپیوترهای جهان نیز نتوانند بدون داشتن رمز، به اطلاعات دسترسی پیدا کنند.

---

### ۲. تشریح ساختار فایل‌های پروژه
- **`services/cipherService.ts`**: هسته پردازش رمزنگاری که مستقیماً با **Web Crypto API** مرورگر ارتباط برقرار کرده و از شتاب‌دهنده سخت‌افزاری پردازنده استفاده می‌کند.
- **`pages/Encrypt.tsx` و `pages/Decrypt.tsx`**: صفحات تخصصی رمزگذاری و رمزگشایی فایل و متن به همراه تخمین‌گر مقاومت پسورد (Password Entropy).
- **`data/languages.ts`**: دیکشنری کامل ترجمه بیش از ۲۳ زبان زنده دنیا با پشتیبانی ۱۰۰٪ از خط فارسی و چیدمان راست‌چین.
- **`contexts/LanguageContext.tsx`**: سیستم مدیریت تغییر زبان برنامه بدون نیاز به رفرش صفحه.

---

## 📜 License

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

<div align="center">
  <sub>Engineered by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. Leave a ⭐ to champion open-source privacy!</sub>
</div>

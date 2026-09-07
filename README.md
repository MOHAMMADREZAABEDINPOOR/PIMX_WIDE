<div align="center">

# 🔐 PIMX_WIDE 🛡️🌍
### Advanced Multilingual AES-256-GCM Text & Binary Cryptographic Suite

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![React: 18+](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Web Crypto API](https://img.shields.io/badge/Crypto-Web_Crypto_API-0052CC?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Languages: 23+](https://img.shields.io/badge/Languages-23+_Global_Locales-28a745?style=for-the-badge)](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-کامل-فارسی-persian-documentation)

<p align="center">
  A military-grade, zero-knowledge cryptographic web suite supporting 23+ languages. Implements hardware-accelerated AES-256-GCM authenticated encryption and PBKDF2 key derivation directly in browser memory, guaranteeing that plaintexts and encryption keys never traverse the network.
</p>

[Cryptographic Specs](#-cryptographic-specifications) •
[Key Features](#-key-features) •
[Quick Start](#-quick-start) •
[توضیحات فارسی](#-توضیحات-کامل-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## 🔒 Cryptographic Specifications

- **Cipher Algorithm**: AES-GCM (Galois/Counter Mode) with 256-bit symmetric keys.
- **Integrity Tag**: 128-bit authentication tag validating ciphertext against bit-flipping attacks.
- **Key Derivation Function (KDF)**: PBKDF2 (Password-Based Key Derivation Function 2) with HMAC-SHA-256 and 100,000+ iterations.
- **Initialization Vector (IV)**: 96-bit cryptographically secure pseudorandom number (CSPRN) uniquely generated per operation via `crypto.getRandomValues()`.
- **Zero-Knowledge Architecture**: 100% Client-Side. No keys or unencrypted texts are transmitted or logged.

---

## ⚡ Key Features

- 🌍 **23+ International Languages Supported**:
  - Full localization for Persian, English, Arabic, Russian, German, French, Chinese, Spanish, and more.
- 📁 **Universal File & Payload Encryption**:
  - Encrypts text snippets, code files, PDFs, archives, and images with automatic payload packaging.
- 🔑 **Passphrase Strength Meter**:
  - Real-time Shannon entropy calculation guiding users to formulate resilient passphrases.
- 📋 **One-Click Shareable Ciphertexts**:
  - Export ciphertexts as Base64 strings, self-decrypting URLs, or downloadable `.pimx` encrypted containers.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE.git
cd PIMX_WIDE

npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to test encryption and decryption in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🇮🇷 توضیحات کامل فارسی (Persian Documentation)

### معرفی پروژه سامانه رمزنگاری چندزبانه PIMX_WIDE
پروژه **PIMX_WIDE** یک سامانه رمزنگاری پیشرفته، امن و بدون واسطه (Zero-Knowledge) برای رمزگذاری متن‌ها و فایل‌ها است که بر پایه پروتکل استاندارد نظامی **AES-256-GCM** و کتابخانه محلی مرورگر (Web Crypto API) توسعه یافته است. این سامانه به بیش از ۲۳ زبان زنده دنیا از جمله فارسی مجهز بوده و امنیت انتقال اطلاعات را در محیط‌های ناامن به بالاترین سطح می‌رساند.

### ویژگی‌های امنیتی و فنی:
1. **رمزنگاری معتبر AES-256-GCM:**
   * تضمین محرمانگی کامل داده‌ها به همراه بررسی اصالت متن رمز شده (تگ احراز هویت ۱۲۸ بیتی).
2. **اشتقاق کلید با الگوریتم PBKDF2:**
   * تبدیل امن رمزهای عبور کاربران به کلیدهای قدرتمند ۲۵۶ بیتی با ۱۰۰ هزار تکرار HMAC-SHA256.
3. **معماری کلاینت-ساید (Zero-Knowledge):**
   * تمامی عملیات رمزگذاری و رمزگشایی درون حافظه رم مرورگر کاربر انجام شده و هیچ داده‌ای به هیچ سروری ارسال نمی‌شود.
4. **پشتیبانی از فایل و متن:**
   * امکان رمزگذاری اسناد، تصاویر و کدهای برنامه‌نویسی به صورت کانتینرهای ایمن خروجی.
5. **پشتیبانی بی‌نقص از زبان فارسی:**
   * رابط کاربری کاملاً راست‌چین و ترجمه دقیق تمامی اصطلاحات فنی به فارسی.

---

## 📜 License

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

<div align="center">
  <sub>Engineered by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. Star ⭐ this repo to champion open-source privacy!</sub>
</div>

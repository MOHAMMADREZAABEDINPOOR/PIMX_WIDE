export type Localize = (fa: string, en: string) => string;
export function informationContent(page: string, l: Localize): string[][] {
  const privacy = [
    [
      l("پردازش محلی", "Local processing"),
      l(
        "رمزکردن و رمزگشایی متن و فایل با Web Crypto در مرورگر انجام می‌شود. ورودی‌های جلسه تا زمان پاک‌کردن یا قفل‌شدن در حافظه برنامه قرار دارند.",
        "Text and files are encrypted and decrypted with Web Crypto in the browser. Session inputs remain in application memory until cleared or locked.",
      ),
    ],
    [
      l("ذخیره‌سازی و پشتیبان", "Storage & backups"),
      l(
        "تنظیمات در localStorage و گاوصندوق به شکل رمز‌شده در IndexedDB ذخیره می‌شوند. عنوان، برچسب و بسته‌ها همگی زیر رمز اصلی گاوصندوق قرار می‌گیرند. حذف داده‌های مرورگر می‌تواند این اطلاعات را حذف کند.",
        "Preferences use localStorage; the encrypted vault uses IndexedDB. Titles, tags and packages are protected by the vault password. Clearing browser data may remove them.",
      ),
    ],
    [
      l("اشتراک لینک", "Share links"),
      l(
        "ساخت لینک انتخابی است. سرور فقط بسته رمز‌شده، زمان انقضا و شمارنده دریافت را ذخیره می‌کند. رمز عبور ارسال نمی‌شود. پس از انقضا یا رسیدن به محدودیت، تحویل متوقف می‌شود؛ نسخه‌های قبلاً دریافت‌شده باقی می‌مانند.",
        "Link creation is optional. The server stores the encrypted package, expiry and download count. No password is sent. Delivery stops after expiry or the limit; previously downloaded copies remain.",
      ),
    ],
    [
      l("آمار بازدید", "Visit analytics"),
      l(
        "به صورت پیش‌فرض خاموش است. با فعال‌کردن آن، زمان بازدید، کشور و نوع دستگاه ذخیره می‌شود. نشانی IP در دیتابیس آمار ذخیره نمی‌شود. میزبان ممکن است لاگ‌های زیرساختی مستقل داشته باشد.",
        "Disabled by default. When enabled, visit time, country and device type are stored. Analytics do not store IP addresses. The host may keep separate infrastructure logs.",
      ),
    ],
    [
      l("محدودیت‌های حفاظت", "Protection limits"),
      l(
        "این پروژه ممیزی امنیتی مستقل نشده است. قفل جلسه پاک‌سازی قطعی حافظه مرورگر یا کلیپ‌بورد را تضمین نمی‌کند. افزونه‌ها و دستگاه آلوده می‌توانند محرمانگی را به خطر بیندازند.",
        "This project has not undergone an independent security audit. Session locking cannot guarantee browser-memory or clipboard erasure. Extensions and compromised devices can affect confidentiality.",
      ),
    ],
  ];
  const terms = [
    [
      l("مسئولیت نگهداری رمز", "Password responsibility"),
      l(
        "بازیابی رمز وجود ندارد. رمز و نسخه پشتیبان را جدا نگه دارید و پیش از حذف اصل داده، رمزگشایی را بررسی کنید.",
        "There is no password recovery. Keep passwords and backups separately and verify decryption before deleting original data.",
      ),
    ],
    [
      l("استفاده از سرویس", "Using the service"),
      l(
        "از برنامه مطابق قوانین قابل‌اعمال استفاده کنید. محدودیت حجم و تعداد دریافت لینک در رابط اعلام می‌شود. لینک یک‌بارمصرف به معنای حذف نسخه گیرنده نیست.",
        "Use the application under applicable rules. Size and link download limits are shown in the interface. A single-use link cannot erase a recipient’s copy.",
      ),
    ],
  ];
  const about = [
    [
      l("ساخته‌شده برای اختیار بیشتر", "Built for more control"),
      l(
        "PIMX WIDE یک ابزار با کد قابل‌مشاهده مبتنی بر React و Web Crypto برای رمزنگاری محلی، گاوصندوق شخصی و اشتراک‌گذاری بسته‌های رمز‌شده است.",
        "PIMX WIDE is a source-available React and Web Crypto application for local encryption, a personal vault and sharing encrypted packages.",
      ),
    ],
    [
      l("قالب رمزنگاری", "Encryption format"),
      l(
        "نسخه ۲ از AES-256-GCM، salt تصادفی ۱۶ بایتی، IV تصادفی ۱۲ بایتی و PBKDF2-SHA256 با ۶۰۰٬۰۰۰ دور استفاده می‌کند. رمزگشایی بسته‌های قدیمی پشتیبانی می‌شود.",
        "Version 2 uses AES-256-GCM, a random 16-byte salt, random 12-byte IV and PBKDF2-SHA256 with 600,000 rounds. Legacy package decryption is supported.",
      ),
    ],
  ];
  const sla = [
    [
      l("دسترسی محلی و شبکه", "Local & network availability"),
      l(
        "ابزارهای محلی پس از کش‌شدن نسخه انتشار بدون شبکه کار می‌کنند. لینک اشتراک و آمار به دسترسی سرور نیاز دارند. برای این پروژه تضمین قراردادی آپ‌تایم ارائه نمی‌شود.",
        "Local tools work without a network after the production app is cached. Share links and analytics need the server. This project offers no contractual uptime guarantee.",
      ),
    ],
  ];
  let content =
    page === "privacy"
      ? privacy
      : page === "terms"
        ? terms
        : page === "sla"
          ? sla
          : about;
  if (page === "terms")
    content = [
      ...terms,
      [
        l("قبل از حذف اصل داده", "Before removing original data"),
        l(
          "یک بار بازیابی بسته را امتحان کنید و یک نسخه پشتیبان جدا نگه دارید. حذف فایل‌های دانلودشده، پاک‌کردن مرورگر یا فراموشی رمز عبور می‌تواند داده‌های شما را از دسترس خارج کند.",
          "Verify decryption once and keep a separate backup. Removing downloaded files, clearing browser storage or forgetting the password can make your data unavailable.",
        ),
      ],
      [
        l("معنای محدودیت دریافت", "What a download limit means"),
        l(
          "لینک اشتراک فقط تحویل بسته از سرور را محدود می‌کند. دریافت موفق از سهمیه کم می‌شود؛ پس از دریافت، نگهداری و بازکردن نسخه گیرنده به زمان اعتبار لینک وابسته نیست.",
          "A share link limits delivery from the server. Successful retrieval uses a download; a recipient can keep and open a received copy independently of the link’s lifetime.",
        ),
      ],
    ];
  if (page === "about")
    content = [
      ...about,
      [
        l("تجربه‌ای برای استفاده روزمره", "Made for everyday moments"),
        l(
          "متن و فایل، گاوصندوق روی دستگاه، رمزساز و بسته‌های قابل‌انتقال در یک محیط قرار دارند. شما تصمیم می‌گیرید کدام بسته ذخیره شود و کدام نسخه رمز‌شده به اشتراک گذاشته شود.",
          "Text and files, a device vault, password generation and portable packages share one space. You decide which packages are saved and which encrypted copies are shared.",
        ),
      ],
      [
        l("شفافیت بخشی از طراحی است", "Transparency is part of the design"),
        l(
          "کد پروژه قابل‌مشاهده است و محدودیت‌ها در صفحات راهنما توضیح داده شده‌اند. این پروژه ممیزی امنیتی مستقل نشده؛ پیش از حذف اصل اطلاعات، بازیابی را بررسی کنید.",
          "The source can be inspected, and limitations are explained in the guides. This project has not undergone an independent security audit. Verify recovery before removing original information.",
        ),
      ],
    ];
  return content;
}

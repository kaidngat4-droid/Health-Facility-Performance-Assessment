<div align="center">

# 🇾🇪 معيار PRO v3.0
## نظام التقييم المعياري للمرافق الصحية
### الجمهورية اليمنية - وزارة الصحة والبيئة - محافظة إب

[![Version](https://img.shields.io/badge/version-3.0.0-gold?style=for-the-badge)](https://github.com/maeyar/pro)
[![License](https://img.shields.io/badge/license-GPL--3.0-darkred?style=for-the-badge)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Offline](https://img.shields.io/badge/Offline-First-green?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers)
[![Arabic](https://img.shields.io/badge/اللغة-العربية-darkgreen?style=for-the-badge)](README.md)

</div>

---

## 📋 فهرس المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات الرئيسية](#-المميزات-الرئيسية)
- [المعايير المعتمدة](#-المعايير-المعتمدة)
- [متطلبات النظام](#-متطلبات-النظام)
- [هيكل المشروع](#-هيكل-المشروع)
- [التثبيت والتشغيل](#-التثبيت-والتشغيل)
- [Service Worker & PWA](#-service-worker--pwa)
- [وضع عدم الاتصال](#-وضع-عدم-الاتصال)
- [الأمان والمصادقة](#-الأمان-والمصادقة)
- [API Reference](#-api-reference)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)
- [التواصل](#-التواصل)

---

## 🔭 نظرة عامة

**معيار PRO** هو نظام تقييم إلكتروني متكامل للمرافق الصحية في الجمهورية اليمنية، يعمل تحت إشراف **وزارة الصحة والبيئة - مكتب الصحة والبيئة بمحافظة إب**.

تم تصميم النظام لتقييم المرافق الصحية العامة والخاصة وفق المعايير الدولية والمحلية المعتمدة، مع دعم كامل للعمل دون اتصال بالإنترنت (Offline-First) عبر تقنية Progressive Web App (PWA).

### الجهات المستفيدة
- 🏥 المستشفيات العامة والخاصة
- 🏥 المراكز الصحية
- 🏥 العيادات الطبية
- 🔬 المختبرات الطبية
- 💊 الصيدليات
- 🏛️ الجهات الرقابية والتنظيمية

---

## ✨ المميزات الرئيسية

### 📊 لوحة التحكم المتكاملة
- إحصائيات حية للمرافق الصحية
- مؤشرات الأداء الرئيسية (KPIs)
- رسوم بيانية تفاعلية
- تنبيهات وإشعارات ذكية

### 🏥 إدارة المرافق الصحية
- تسجيل وإدارة المرافق الصحية
- تصنيف المرافق حسب النوع والفئة
- خرائط الموقع الجغرافي
- سجل التراخيص والاعتمادات

### ✅ نظام التقييم المعياري
- تقييم شامل وفق معايير JCI, HHFA, CBAHI, ISO
- نماذج تقييم تفاعلية
- نظام نقاط ودرجات دقيق
- توصيات تحسين آلية

### 📄 التقارير والتحليلات
- تقارير فورية ودورية
- تصدير PDF/Excel
- تحليلات بيانية متقدمة
- مقارنة الأداء بين المرافق

### 📚 دليل المعايير
- قاعدة بيانات المعايير الكاملة
- شرح تفصيلي لكل معيار
- أمثلة وأدلة تطبيقية
- تحديثات دورية

### 🌐 دعم متعدد اللغات
- اللغة العربية (الافتراضية)
- دعم RTL (من اليمين لليسار)
- خطوط عربية احترافية (Cairo, Tajawal, Amiri)

### 📱 Progressive Web App
- تثبيت على الشاشة الرئيسية
- العمل بدون إنترنت
- مزامنة تلقائية عند استعادة الاتصال
- إشعارات Push
- تحديثات تلقائية في الخلفية

---

## 📐 المعايير المعتمدة

| المعيار | الوصف | المرجع |
|---------|-------|--------|
| **JCI** | Joint Commission International | المعايير الدولية للاعتماد المشترك |
| **HHFA** | Health Facility Assessment | تقييم المرافق الصحية (WHO) |
| **CBAHI** | Central Board for Accreditation | مجلس الاعتماد للمؤسسات الصحية |
| **ISO 15189** | Medical Laboratories | معايير المختبرات الطبية |
| **WHO** | World Health Organization | معايير منظمة الصحة العالمية |

---

## 💻 متطلبات النظام

### المتصفحات المدعومة
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### الأجهزة المدعومة
- 🖥️ أجهزة سطح المكتب (Windows, macOS, Linux)
- 📱 الهواتف الذكية (Android, iOS)
- 📱 الأجهزة اللوحية (iPad, Android Tablets)

### متطلبات الخادم (Server)
- **Node.js** 18+ (للخلفية)
- **Nginx/Apache** (للخادم الويب)
- **HTTPS** (إلزامي للـ PWA)
- **SSL Certificate** (Let's Encrypt موصى به)

---

## 📁 هيكل المشروع

```
maeyar-pro/
├── 📄 index.html              # الصفحة الرئيسية (SPA)
├── 📄 login.html              # صفحة تسجيل الدخول
├── 📄 offline.html            # صفحة عدم الاتصال
├── 📄 style.css               # أنماط CSS الرئيسية
├── 📄 script.js               # منطق التطبيق الرئيسي
├── 📄 sw.js                   # Service Worker (PWA)
├── 📄 sw-register.js          # تسجيل Service Worker
├── 📄 manifest.json           # Web App Manifest
├── 📄 README.md               # هذا الملف
│
├── 📁 images/
│   ├── favicon.png            # أيقونة الموقع
│   ├── yemen-emblem.png       # شعار الجمهورية اليمنية
│   ├── maeyar-logo.png        # شعار معيار
│   ├── icon-*.png             # أيقونات PWA (72x72 إلى 512x512)
│   └── screenshots/           # لقطات شاشة للمتجر
│
├── 📁 js/
│   ├── modules/
│   │   ├── auth.js            # مصادقة المستخدم
│   │   ├── facilities.js      # إدارة المرافق
│   │   ├── assessment.js      # نظام التقييم
│   │   ├── reports.js         # التقارير
│   │   ├── analytics.js       # التحليلات
│   │   └── storage.js         # التخزين المحلي
│   └── utils/
│       ├── helpers.js         # دوال مساعدة
│       ├── validators.js      # التحقق من البيانات
│       └── charts.js          # الرسوم البيانية
│
├── 📁 css/
│   ├── components/            # مكونات CSS
│   ├── themes/               # السمات
│   └── print.css             # أنماط الطباعة
│
├── 📁 docs/
│   ├── standards/            # دليل المعايير
│   ├── user-guide.pdf        # دليل المستخدم
│   └── api-docs.md           # توثيق API
│
└── 📁 data/
    ├── standards.json        # بيانات المعايير
    ├── templates.json        # قوالب التقييم
    └── locales/              # ملفات الترجمة
```

---

## 🚀 التثبيت والتشغيل

### 1. استنساخ المستودع

```bash
git clone https://github.com/maeyar/maeyar-pro.git
cd maeyar-pro
```

### 2. التثبيت المحلي (للتطوير)

```bash
# باستخدام Python
python -m http.server 8000

# باستخدام Node.js
npx serve .

# باستخدام PHP
php -S localhost:8000
```

### 3. الوصول إلى التطبيق

```
http://localhost:8000
```

### 4. التثبيت على الخادم الإنتاجي

```bash
# نسخ الملفات إلى مجلد الويب
sudo cp -r . /var/www/maeyar/

# ضبط أذونات الملفات
sudo chown -R www-data:www-data /var/www/maeyar/
sudo chmod -R 755 /var/www/maeyar/

# تكوين Nginx (انظر docs/nginx-config.md)
```

### 5. تثبيت SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d maeyar.yemen-health.gov
```

---

## ⚙️ Service Worker & PWA

### استراتيجية التخزين المؤقت (Caching Strategy)

| المورد | الاستراتيجية | الوصف |
|--------|-------------|-------|
| **App Shell** | Cache First | HTML, CSS, JS الأساسية |
| **API Calls** | Network First | البيانات الديناميكية |
| **Images** | Cache First | الصور مع fallback SVG |
| **Fonts** | Stale-While-Revalidate | الخطوط مع تحديث خلفي |

### أحداث Service Worker

```
Install  → Cache App Shell
Activate → Clean Old Caches
Fetch    → Stale-While-Revalidate
Sync     → Background Sync
Push     → Push Notifications
```

### تسجيل Service Worker

```javascript
// في index.html (قبل إغلاق </body>)
<script src="sw-register.js"></script>
```

### إشعارات التحديث

عند توفر إصدار جديد، يظهر إشعار في أعلى الصفحة يسمح للمستخدم بتحديث التطبيق فوراً.

---

## 📡 وضع عدم الاتصال

### الميزات المتاحة دون إنترنت

| الميزة | الحالة | المزامنة |
|--------|--------|----------|
| عرض لوحة التحكم | ✅ متاح | - |
| عرض المرافق الصحية | ✅ متاح | - |
| إضافة تقييم جديد | ✅ متاح | ⏳ تلقائية |
| إضافة منشأة جديدة | ✅ متاح | ⏳ تلقائية |
| تصفح دليل المعايير | ✅ متاح | - |
| عرض التقارير المحفوظة | ✅ متاح | - |
| تصدير PDF | ⚠️ محدود | - |
| مزامنة السحابة | ❌ غير متاح | عند الاتصال |

### مزامنة الخلفية (Background Sync)

```javascript
// تسجيل مهمة المزامنة
navigator.serviceWorker.ready.then(registration => {
    registration.sync.register('sync-assessments');
});
```

### IndexedDB Schema

```javascript
// قاعدة بيانات محلية
const DB_NAME = 'MaeyarProDB';
const DB_VERSION = 1;

const stores = {
    facilities: '++id, name, type, city, createdAt',
    assessments: '++id, facilityId, date, status, syncStatus',
    standards: '++id, code, category, title',
    reports: '++id, title, type, createdAt',
    users: '++id, username, role, lastLogin',
    settings: 'key, value'
};
```

---

## 🔒 الأمان والمصادقة

### نظام المصادقة
- **JWT Tokens** مع تاريخ انتهاء
- **LocalStorage + SessionStorage** للجلسات
- **Role-Based Access Control (RBAC)**
- **HTTPS إلزامي** في الإنتاج

### الأدوار (Roles)

| الدور | الصلاحيات |
|-------|----------|
| **Admin** | جميع الصلاحيات |
| **Evaluator** | التقييم + التقارير |
| **Viewer** | عرض فقط |
| **Manager** | إدارة المرافق + التقارير |

### تشفير البيانات
- **AES-256** للبيانات الحساسة في IndexedDB
- **bcrypt** لكلمات المرور (في الخلفية)
- **Content Security Policy (CSP)** في الهيدر

---

## 📖 API Reference

### نقاط النهاية (Endpoints)

```
GET    /api/facilities          # قائمة المرافق
POST   /api/facilities          # إضافة منشأة
GET    /api/facilities/:id      # تفاصيل منشأة
PUT    /api/facilities/:id      # تحديث منشأة
DELETE /api/facilities/:id      # حذف منشأة

GET    /api/assessments         # قائمة التقييمات
POST   /api/assessments         # إضافة تقييم
GET    /api/assessments/:id     # تفاصيل تقييم

GET    /api/standards           # قائمة المعايير
GET    /api/standards/:code     # تفاصيل معيار

GET    /api/reports             # قائمة التقارير
POST   /api/reports/generate    # إنشاء تقرير

POST   /api/auth/login          # تسجيل الدخول
POST   /api/auth/logout         # تسجيل الخروج
GET    /api/auth/me             # معلومات المستخدم
```

### رموز الحالة (Status Codes)

| الرمز | المعنى |
|-------|--------|
| 200 | نجاح |
| 201 | تم الإنشاء |
| 400 | طلب خاطئ |
| 401 | غير مصرح |
| 403 | ممنوع |
| 404 | غير موجود |
| 500 | خطأ في الخادم |
| 503 | وضع عدم الاتصال |

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. **Fork** المستودع
2. إنشاء **Branch** جديد (`git checkout -b feature/amazing-feature`)
3. **Commit** التغييرات (`git commit -m 'Add amazing feature'`)
4. **Push** إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح **Pull Request**

### معايير الكود
- اتباع **ESLint** configuration
- التعليقات باللغة العربية للوظائف الرئيسية
- اختبار جميع الميزات في وضع عدم الاتصال
- دعم RTL في جميع المكونات الجديدة

---

## 
-

## 📞 التواصل

<div align="center">

**وزارة الصحة والبيئة - الجمهورية اليمنية**

📍 **العنوان:** الجمهورية اليمنية - محافظة إب

🏛️ **المؤسسة:** وزارة الصحة والبيئة - مكتب الصحة والبيئة

👨‍⚕️ **المشرف العام:** د/ صلاح الأهدل

📧 **البريد الإلكتروني:** Kaidngat4@gmail.com

📱 **الهاتف:** 711129611

---

**هندسة وتطوير: Dr/Salah Al-ahdel**

**توقيع إلكتروني معتمد: SIG: YEM-MOH-IBB-2026**

</div>

---

<div align="center">

**🇾🇪 بفخر - من اليمن للعالم 🇾🇪**

</div>

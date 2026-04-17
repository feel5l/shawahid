# TOOLING.md

## الأوامر القياسية (Use These First)

- تثبيت الاعتمادات: `npm ci`
- تشغيل التطوير: `npm run dev`
- الاختبارات: `npm test`
- فحص الأنواع/التحقق المعياري: `npm run lint`
- البناء: `npm run build`
- التشغيل بعد البناء: `npm start`
- تحقق شامل قبل الدمج: `npm run verify`

## أوامر قاعدة البيانات

- مزامنة مخطط القاعدة: `npm run db:push`

ملاحظة: هذا الأمر يغيّر مخطط قاعدة البيانات. استخدمه بحذر وعلى بيئة مناسبة فقط.

## أوامر اختبار إضافية

- وضع مراقبة الاختبارات أثناء التطوير: `npm run test:watch`

## CI / Automation الحالية

- `CI Quality Gate`:
  - TypeScript check
  - Tests
  - Build
- `Security Audit (npm)`:
  - تشغيل `npm audit` دوريًا
  - حفظ تقرير JSON كـ artifact
- `Build & Deploy to GitHub Pages`:
  - Workflow نشر منفصل

## مهام شائعة للوكلاء

1. تشغيل سريع بعد سحب المستودع:
   - `npm ci`
   - `npm run dev`

2. قبل فتح PR:
   - `npm run verify`

3. عند تعديل عقود البيانات أو الجداول:
   - تحديث `shared/schema.ts`
   - تشغيل `npm run db:push` في البيئة المناسبة
   - تحديث التوثيق إذا تغيّرت العقود

## TODO للمالك

- اعتماد سياسة Formatter/Linter موحدة (مثل ESLint + Prettier) إن لزم.
- اعتماد سياسة ترقيم الإصدارات (SemVer + changelog) بشكل رسمي.

# AGENT_GUIDE.md

هذا الدليل موجّه للوكلاء البرمجيين للعمل بسرعة وأمان داخل هذا المستودع.

## 1) ملخص المشروع

تطبيق Full-Stack TypeScript لإدارة شواهد الأداء الوظيفي في بيئة تعليمية عربية (RTL).

- Frontend: React + Vite + Wouter + TanStack Query + Tailwind + Radix/Shadcn
- Backend: Express + Node.js
- Database: PostgreSQL عبر Drizzle ORM
- Auth: جلسات + Passport + دعم OpenID/OAuth (حسب البيئة)

## 2) نقاط الدخول المهمة

- واجهة المستخدم: `client/src/main.tsx`
- تطبيق React الرئيسي: `client/src/App.tsx`
- تشغيل الخادم في التطوير: `server/index-dev.ts`
- تشغيل الخادم في الإنتاج: `server/index-prod.ts`
- تهيئة Express العامة: `server/app.ts`
- تعريف الـ API endpoints: `server/routes.ts`
- طبقة التخزين/البيانات: `server/storage.ts`
- مخطط قاعدة البيانات المشترك: `shared/schema.ts`

## 3) أوامر معيارية يجب استخدامها

- تشغيل التطوير: `npm run dev`
- تشغيل الاختبارات: `npm test`
- بناء المشروع: `npm run build`
- تشغيل نسخة production بعد البناء: `npm start`
- فحص الكود المعياري (TypeScript): `npm run lint`
- فحص شامل قبل الدمج: `npm run verify`
- مزامنة مخطط القاعدة: `npm run db:push`

## 4) أماكن الإعداد

- متغيرات البيئة النموذجية: `.env.example`
- تهيئة Drizzle: `drizzle.config.ts`
- إعدادات Vite: `vite.config.ts`
- إعدادات TypeScript: `tsconfig.json`
- إعدادات CI: `.github/workflows/`

متغيرات البيئة الحرجة:
- `DATABASE_URL`
- `SESSION_SECRET`

متغيرات إضافية حسب الميزات:
- `ADMIN_PASSWORD`, `CREATOR_PASSWORD`
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
- `OPENID_CLIENT_ID`, `OPENID_CLIENT_SECRET`, `OPENID_ISSUER`, `REPL_ID`

## 5) قواعد مساهمة للوكلاء

- أي تعديل في API يجب أن يحدّث الاختبارات ذات الصلة تحت `tests/`.
- أي تعديل بنيوي (هيكل مجلدات/نقاط دخول/أوامر) يجب أن يحدّث:
  - `AGENT_GUIDE.md`
  - `ARCHITECTURE.md`
  - `TOOLING.md`
- لا تغيّر سلوك الإنتاج بدون توثيق واضح في `README.md` أو ملاحظة تغيير ضمن PR.
- لا تضف أسرار داخل المستودع. استخدم `.env.example` للتوثيق فقط.

## 6) TODO للمالك (نقاط تحتاج قرارًا)

- تأكيد استراتيجية النشر الأساسية المعتمدة رسميًا (Netlify أم Render) لتقليل ازدواجية التعليمات.
- تحديد سياسة موحدة لعمليات قاعدة البيانات في الإنتاج (migrations المصرّح بها مقابل `db:push`).
- تأكيد ما إذا كان مطلوبًا اعتماد linter منفصل (ESLint) بدل الاكتفاء بـ TypeScript check.

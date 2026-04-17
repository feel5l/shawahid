# ARCHITECTURE.md

## نظرة معمارية مختصرة

هذا المستودع يعتمد نمط Full-Stack Monorepo (واجهة + خادم + مخطط مشترك).

```text
[Browser]
   |
   v
[React SPA: client/]
   |  HTTP /api + session cookies
   v
[Express API: server/routes.ts]
   |
   v
[Storage Layer: server/storage.ts]
   |
   v
[PostgreSQL + Drizzle: shared/schema.ts, server/db.ts]
```

## الطبقات الرئيسية

- Presentation/UI:
  - `client/src/pages/`, `client/src/components/`
  - إدارة بيانات العميل عبر React Query
- API Layer:
  - `server/routes.ts` يحتوي المسارات ومنطق التوجيه
- Domain/Service Layer:
  - `server/services/` (إشعارات، دورات، تدقيق، بريد)
- Data Access Layer:
  - `server/storage.ts` + Drizzle ORM
- Shared Contracts:
  - `shared/schema.ts` (Schemas + Types)

## مسار التنفيذ

- Development:
  - `server/index-dev.ts` يشغل Express مع Vite middleware
- Production-like runtime:
  - `npm run build` ينتج:
    - عميل: `dist/public`
    - خادم: `dist/index.js`
  - `npm start` يشغل `dist/index.js`

## قرارات تصميم مهمة

- TypeScript عبر كامل الطبقات لتقليل اختلاف العقود بين الواجهة والخادم.
- الاعتماد على `shared/schema.ts` كمصدر مركزي لتعريفات البيانات.
- تصميم RTL-first للواجهة العربية.
- المصادقة المعتمدة على الجلسات كأساس، مع دعم OAuth/OpenID عند توافر المتغيرات.

## حدود ومعروفات تحتاج انتباه

- توجد مسارات نشر متعددة موثقة (Netlify/Render) وتحتاج قرار اعتماد رسمي.
- لا يوجد توثيق قرار معماري رسمي حول استراتيجية migrations الإنتاجية (TODO للمالك).
- لا يوجد تقسيم Packages متعدد؛ المشروع أحادي المستودع مع حدود طبقية منطقية.

## مراجع تفصيلية

- `docs/architecture.md`
- `docs/database.md`
- `docs/api-routes.md`

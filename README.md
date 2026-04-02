# 天皇尺碼試穿遊戲

這是一個使用 Next.js 14、TypeScript、Tailwind CSS、shadcn/ui 風格元件、Prisma 與 PostgreSQL 製作的 MVP 標註遊戲，用來蒐集服飾尺碼的人工標註資料。

## 功能

- 首頁 `/`：顯示產品簡介、開始標註入口、管理頁入口
- 遊戲頁 `/play`：逐題標註客人的實際尺碼與穿著感受
- 管理頁 `/admin`：查看標註紀錄，並依商品名稱、實際尺碼、穿著感受篩選
- API：
  - `GET /api/cases/next`
  - `POST /api/labels`
  - `GET /api/admin/labels`

## 技術棧

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 風格元件
- Prisma
- PostgreSQL

## 專案結構

```text
.
├── app
│   ├── admin/page.tsx
│   ├── api
│   │   ├── admin/labels/route.ts
│   │   ├── cases/next/route.ts
│   │   └── labels/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── play/page.tsx
├── components
│   ├── admin-table.tsx
│   ├── home-hero.tsx
│   ├── play-game.tsx
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── table.tsx
├── lib
│   ├── db.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validators.ts
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .eslintrc.json
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 本地執行

1. 安裝依賴

```bash
npm install
```

2. 建立環境變數

```bash
cp .env.example .env
```

3. 確認 PostgreSQL 已建立資料庫，例如 `fitdata`

4. 產生 Prisma Client 並同步 schema

如果你是從舊版 MVP 更新上來，因為 schema 已移除 `annotatorName` 並新增 `fitPreference` 欄位，請使用：

```bash
npx prisma generate
npx prisma db push --accept-data-loss
```

5. 匯入 56 筆模擬資料

```bash
npm run db:seed
```

6. 啟動開發環境

```bash
npm run dev
```

7. 開啟瀏覽器

```text
http://localhost:3000
```

## 資料模型

### TryOnCase

- `id`
- `productName`
- `heightCm`
- `weightKg`
- `waistCm`
- `suggestedSize`
- `actualSize`
- `fitPreference`
- `isLabeled`
- `createdAt`
- `updatedAt`

### TryOnLabel

- `id`
- `caseId`
- `selectedSize`
- `fitPreference`
- `createdAt`

## 備註

- `POST /api/labels` 會同時建立 `TryOnLabel` 歷史紀錄，並更新 `TryOnCase.actualSize`、`TryOnCase.fitPreference` 與 `TryOnCase.isLabeled`
- 種子資料為中文商品名稱與模擬亞洲男性身形資料
- 管理頁顯示的是每一筆標註紀錄，方便保留歷史

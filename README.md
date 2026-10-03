# Dearly 📖✨

> **"For Your Dear's & Loved ones"**  
> A bespoke digital memory magazine & scrapbook keepsake featuring realistic 3D page-flipping, photobooth strips, freeform draggable polaroids & stickers, and private 24-hour self-destructing links.

---

## ✨ Features

- **📖 Interactive 3D Page-Flip**: Turn pages realistically using keyboard arrow keys or touch navigation with natural physics and shadow depth (powered by StPageFlip).
- **🎞️ Photobooth Strips**: Classic retro photobooth layout with one-tap device photo selection and washi tape accents.
- **🏷️ Freeform Scrapbook Workspace**: Drag, scale, and rotate custom stickers, polaroids, and handwritten notes across spreads with continuous spine crossing.
- **🔒 24-Hour Ephemeral Keepsake**: Create private shareable links (`/m/[id]`) that permanently self-destruct after 24 hours. All cloud-stored photos and records are automatically erased.
- **🛡️ Read-Only Showcase Mode**: Dedicated read-only presentation mode for recipients and previews. All editing tools and cues are locked out so your memories remain untampered.
- **✨ Gold Foil & Vintage Aesthetics**: Luxurious leather-textured burgundy cover, gold foil embossing, and handwritten typography.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with localStorage persistence
- **Icons**: [Lucide React](https://lucide.dev/)
- **Book Physics**: [Page-Flip](https://github.com/Nodlik/StPageFlip)
- **Backend & Storage**: [Supabase](https://supabase.com/) (PostgreSQL, Storage Buckets, Row-Level Security, pg_cron)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/GAMER-SATU/Dearly.git
cd Dearly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Ensure your Supabase project URL and keys are populated:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Database & Storage Setup
Run the SQL setup script located at [`supabase/schema.sql`](supabase/schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard):
- Creates the `magazines` table with indexes
- Sets up Row Level Security (RLS) policies
- Configures the `magazines` public storage bucket
- Initializes the `pg_cron` auto-delete job (runs every 15 minutes)

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes (/api/magazine/share, /api/stickers)
│   │   ├── create/           # Studio & layout editor
│   │   ├── m/[id]/           # Recipient read-only showcase viewer
│   │   └── page.tsx          # Main reader & creator hub
│   ├── components/
│   │   ├── book/             # PageFlipMagazine 3D canvas
│   │   ├── layout/           # DeskStickers, BookContainer
│   │   ├── modals/           # ShareModal (24h link generation)
│   │   ├── pages/            # FrontCover, MemoryPage, PolaroidCollage, AboutUs, BackCover
│   │   ├── tools/            # StickersToolSheet, ImageToolSheet, TextToolSheet
│   │   └── ui/               # DraggableStickersLayer, WashiTape
│   ├── lib/
│   │   ├── supabase/         # Supabase client helpers & magazine actions
│   │   └── defaultMagazine.ts# Default template data
│   └── store/
│       └── useMagazineStore.ts # Zustand global studio state
├── supabase/
│   └── schema.sql            # Full database, RLS, storage & cron setup
```

---

## 📄 License

MIT © [Dearly](https://github.com/GAMER-SATU/Dearly)

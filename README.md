# ✅ TaskFlow — Project & Task Management

A clean, Kanban-style **task management app** with a dashboard, multiple boards, and full task CRUD. Move tasks across **To Do → In Progress → Done**, set priorities and due dates, and track progress at a glance.

Built with **Next.js 14 (App Router)**, **Prisma**, **SQLite**, **TypeScript** and **Tailwind CSS**.

![Tech](https://img.shields.io/badge/Next.js-14-black) ![Tech](https://img.shields.io/badge/Prisma-5-2D3748) ![Tech](https://img.shields.io/badge/SQLite-003B57) ![Tech](https://img.shields.io/badge/TypeScript-5-3178C6) ![Tech](https://img.shields.io/badge/TailwindCSS-3-38BDF8)

---

## ✨ Features
- **Dashboard** — KPIs (total / in-progress / done / overdue), progress bar, status distribution & upcoming deadlines
- **Multiple boards** — color-coded, each with its own progress
- **Kanban view** — three columns; move tasks left/right between statuses
- **Full task CRUD** — create, edit, delete via a clean modal
- **Priorities** (Low / Medium / High) with color coding
- **Due dates** with overdue highlighting
- Type-safe **Server Actions** + **Zod** validation
- **Zero database setup** — uses SQLite, created automatically

---

## 🚀 Getting Started

```bash
npm install            # installs deps + generates Prisma client
npm run setup          # creates the SQLite DB and seeds demo data
npm run dev            # start the dev server
```

Open **http://localhost:3000** 🎉

> `npm run setup` = `prisma db push` + `tsx prisma/seed.ts`. It creates `prisma/dev.db` with 3 demo boards and 13 tasks.

---

## 📦 Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run setup` | Create DB + seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

## 🧱 Structure
```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── boards/           # Boards list, new board, board detail (Kanban)
│   └── actions.ts        # Server Actions (board + task CRUD)
├── components/
│   ├── Sidebar.tsx
│   ├── BoardForm.tsx
│   └── board/            # BoardView, TaskCard, TaskModal
└── lib/                  # prisma, constants, utils, validators
prisma/
├── schema.prisma         # Board, Task
└── seed.ts               # Demo data
```

## ☁️ Deploy
Works on Vercel. For production you may prefer Postgres — change the `datasource` provider in `prisma/schema.prisma` to `postgresql` and set `DATABASE_URL` (e.g. a free [Neon](https://neon.tech) database).

---

Built as a portfolio project. ⭐

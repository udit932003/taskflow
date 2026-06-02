import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TaskFlow...");
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();

  const now = new Date();
  const day = (n: number) => new Date(now.getTime() + n * 86400000);

  const website = await prisma.board.create({
    data: {
      name: "Website Redesign",
      description: "Revamp the company marketing site",
      color: "#6366f1",
    },
  });
  const mobile = await prisma.board.create({
    data: {
      name: "Mobile App v2",
      description: "New features for the iOS & Android app",
      color: "#0ea5e9",
    },
  });
  const marketing = await prisma.board.create({
    data: {
      name: "Q3 Marketing",
      description: "Campaigns and content calendar",
      color: "#f59e0b",
    },
  });

  const tasks = [
    { board: website.id, title: "Design new landing page", status: "DONE", priority: "HIGH", due: day(-2), pos: 0, desc: "Hero, features, pricing sections." },
    { board: website.id, title: "Set up Tailwind design system", status: "DONE", priority: "MEDIUM", due: day(-1), pos: 1, desc: "Tokens, spacing, components." },
    { board: website.id, title: "Build contact form with validation", status: "IN_PROGRESS", priority: "HIGH", due: day(2), pos: 0, desc: "Zod + server action." },
    { board: website.id, title: "Optimize images & Lighthouse score", status: "IN_PROGRESS", priority: "MEDIUM", due: day(4), pos: 1, desc: "Target 95+ performance." },
    { board: website.id, title: "Write SEO meta tags", status: "TODO", priority: "LOW", due: day(6), pos: 0, desc: "OG tags, sitemap, robots." },
    { board: website.id, title: "Cross-browser QA", status: "TODO", priority: "MEDIUM", due: day(8), pos: 1, desc: "Chrome, Safari, Firefox, Edge." },

    { board: mobile.id, title: "Push notifications", status: "IN_PROGRESS", priority: "HIGH", due: day(3), pos: 0, desc: "FCM + APNs integration." },
    { board: mobile.id, title: "Dark mode support", status: "TODO", priority: "MEDIUM", due: day(10), pos: 0, desc: "System + manual toggle." },
    { board: mobile.id, title: "Fix login crash on Android 14", status: "TODO", priority: "HIGH", due: day(1), pos: 1, desc: "Reported by 3 users." },
    { board: mobile.id, title: "App store screenshots", status: "DONE", priority: "LOW", due: day(-3), pos: 0, desc: "All device sizes." },

    { board: marketing.id, title: "Plan webinar series", status: "TODO", priority: "MEDIUM", due: day(12), pos: 0, desc: "3 sessions, guest speakers." },
    { board: marketing.id, title: "Draft email newsletter", status: "IN_PROGRESS", priority: "MEDIUM", due: day(2), pos: 0, desc: "Monthly product update." },
    { board: marketing.id, title: "Analyze last campaign metrics", status: "DONE", priority: "LOW", due: day(-5), pos: 0, desc: "CTR, conversions, ROI." },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: {
        title: t.title,
        description: t.desc,
        status: t.status,
        priority: t.priority,
        dueDate: t.due,
        position: t.pos,
        boardId: t.board,
      },
    });
  }

  console.log(`✅ Created 3 boards and ${tasks.length} tasks`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

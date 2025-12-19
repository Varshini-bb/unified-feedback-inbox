import { prisma } from "../prisma";

async function syncFeedback() {
  const forms = await prisma.feedbackForm.findMany();
  const tickets = await prisma.supportTicket.findMany();
  const sales = await prisma.salesNote.findMany();

  for (const f of forms) {
    await prisma.feedbackItem.create({
      data: {
        source: "form",
        sourceId: f.id,
        title: f.title,
        description: f.description,
        severity: f.severity,
        productArea: f.productArea,
      },
    });
  }

  for (const t of tickets) {
    await prisma.feedbackItem.create({
      data: {
        source: "support",
        sourceId: t.id,
        title: t.subject,
        description: t.body,
        severity: t.priority,
        productArea: t.productArea,
      },
    });
  }

  for (const s of sales) {
    await prisma.feedbackItem.create({
      data: {
        source: "sales",
        sourceId: s.id,
        title: "Sales feedback",
        description: s.note,
        severity: s.urgency,
        productArea: s.productArea,
      },
    });
  }

  console.log("Feedback synced successfully");
}

syncFeedback()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

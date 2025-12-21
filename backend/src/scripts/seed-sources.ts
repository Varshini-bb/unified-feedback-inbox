import { prisma } from "../prisma.js";

async function seedSources() {
  await prisma.feedbackForm.createMany({
    data: [
      {
        title: "Signup flow is confusing",
        description: "Too many steps during signup",
        severity: "high",
        productArea: "onboarding",
      },
    ],
  });

  await prisma.supportTicket.createMany({
    data: [
      {
        subject: "Login not working",
        body: "Users are unable to login on Android",
        priority: "critical",
        productArea: "auth",
      },
    ],
  });

  await prisma.salesNote.createMany({
    data: [
      {
        note: "Customer requesting bulk pricing",
        urgency: "medium",
        productArea: "pricing",
      },
    ],
  });

  console.log("Source tables seeded successfully");
}

seedSources()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

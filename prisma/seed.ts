
import { PrismaClient, Role } from 'src/generated/prisma/client';
// import { PrismaClient, Role } from "@prisma/client";
import { seedUsers } from "./seeds/users.seed";
import { seedOyoState } from "./seeds/states/oyo.seed";
import { createPrismaClient } from 'src/lib/prisma';

// const prisma = new PrismaClient();
const prisma = createPrismaClient();

async function main() {
  console.log("Starting database seed...\n");

  await seedUsers(prisma);
  await seedOyoState(prisma);

  // Next states get wired in here the same way, e.g.:
  // await seedLagosState(prisma);
  // await seedFctState(prisma);

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import { seedAdmin } from "./seeds/admin.seed";

// async function main() {
//     console.log("Seeding database with admin user...");
//     await seedAdmin();
//     console.log("Database seeded successfully.");
// }
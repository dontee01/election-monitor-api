import { seedAdmin } from "./seeds/admin.seed";

async function main() {
    console.log("Seeding database with admin user...");
    await seedAdmin();
    console.log("Database seeded successfully.");
}
/**
 * Seeds baseline User accounts for local/dev environments — one per Role
 * (ADMIN, AGENT, OBSERVER, CITIZEN) so auth/RBAC flows have something to
 * log in as immediately after a fresh seed.
 *
 * Passwords are bcrypt-hashed before insert — never stored in plaintext.
 * Requires bcrypt: `npm install bcrypt` (and `npm install -D @types/bcrypt`).
 *
 * SECURITY: these are DEV-ONLY placeholder credentials. Never run this
 * seed against a staging/production database, and rotate/remove these
 * accounts before any environment is exposed publicly.
 *
 * Run standalone:
 *   npx ts-node prisma/seeds/users.seed.ts
 * or wired into prisma/seed.ts:
 *   import { seedUsers } from "./seeds/users.seed";
 *   await seedUsers(prisma);
 */

// import { PrismaClient, Role } from "../../generated/prisma";
import { PrismaClient, Role } from "generated/prisma/client";
import { createPrismaClient } from 'src/lib/prisma';
import * as bcrypt from "bcrypt";

const prisma = createPrismaClient();

const SALT_ROUNDS = 10;

// Every account uses this password in dev. Change immediately if this seed
// ever touches a non-local environment.
const DEV_PASSWORD = "changeme1234";

interface UserSeed {
  fullName: string;
  email: string;
  role: Role;
}

const USERS: UserSeed[] = [
  { fullName: "Ada Admin", email: "admin@electionmonitor.dev", role: Role.ADMIN },
  { fullName: "Femi Agent", email: "agent@electionmonitor.dev", role: Role.AGENT },
  { fullName: "Ola Observer", email: "observer@electionmonitor.dev", role: Role.OBSERVER },
  { fullName: "Chidi Citizen", email: "citizen@electionmonitor.dev", role: Role.CITIZEN },
];

export async function seedUsers(prisma) {
  console.log("Seeding users...");

  const hashedPassword = await bcrypt.hash(DEV_PASSWORD, SALT_ROUNDS);

  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        fullName: u.fullName,
        email: u.email,
        password: hashedPassword,
        role: u.role,
      },
    });
    console.log(`  ${u.role.padEnd(9)} -> ${u.email}`);
  }

  console.log(`Done. Users: ${USERS.length} (dev password for all: "${DEV_PASSWORD}")`);
}

// Allow running this file directly: `npx ts-node prisma/seeds/users.seed.ts`
if (require.main === module) {
  seedUsers(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
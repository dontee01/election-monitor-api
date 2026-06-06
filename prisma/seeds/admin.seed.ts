import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { Role } from "src/common/enums/role.enum";
import { createPrismaClient } from "src/lib/prisma";

// const prisma = new PrismaClient();
const prisma = createPrismaClient();

export async function seedAdmin() {
    const password = await bcrypt.hash('Password123@', 10);

    await prisma.user.upsert({
        where: {
            email: 'admin@test.com',
        },
        update: {},
        create: {
            fullName: 'Sys Administrator',
            email: 'admin@test.com',
            password,
            role: 'ADMIN',
        },
    });

    console.log('Admin user seeded');
}

seedAdmin().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
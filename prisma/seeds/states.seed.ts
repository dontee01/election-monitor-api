import { createPrismaClient } from "src/lib/prisma";


const states = [

];

const prisma = createPrismaClient();

export async function seedStates() {
    await prisma.state.createMany({
        data: states,
        skipDuplicates: true,
    });
}

seedStates().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
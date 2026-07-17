/**
 * Seeds State -> LGA -> Ward -> PollingUnit for Oyo State.
 *
 * Run standalone:
 *   npx ts-node prisma/seeds/oyo-state.seed.ts
 * or wire into prisma/seed.ts:
 *   import { seedOyoState } from "./seeds/oyo-state.seed";
 *   await seedOyoState(prisma);
 *
 * Idempotent: safe to re-run. Uses upsert on the natural unique keys
 * (State.code, [name, stateId] on Lga, [name, lgaId] on Ward,
 * PollingUnit.code) so re-running won't create duplicates.
 */

import { PrismaClient, Role } from "generated/prisma/client";
import { createPrismaClient } from 'src/lib/prisma';
import { OYO_STATE, OYO_LGAS } from "../data/oyo-state.data";

const prisma = createPrismaClient();

/** Zero-pad a number, e.g. pad(7, 3) -> "007" */
function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

/** Slug a ward name into a short code segment for readability in PU codes, e.g. "Ojoo/Ajibode/Laniba" -> "OJOO-AJIBODE-LANIBA" (kept, but sequence number is what guarantees uniqueness) */
function wardSeqCode(wardIndex: number): string {
  return pad(wardIndex + 1, 2);
}

export async function seedOyoState(client: PrismaClient = prisma) {
  console.log(`Seeding state: ${OYO_STATE.name}`);

  const state = await client.state.upsert({
    where: { code: OYO_STATE.code },
    update: {},
    create: {
      name: OYO_STATE.name,
      code: OYO_STATE.code,
    },
  });

  let totalWards = 0;
  let totalPUs = 0;

  for (const lgaSeed of OYO_LGAS) {
    const lga = await client.lga.upsert({
      where: { name_stateId: { name: lgaSeed.name, stateId: state.id } },
      update: {},
      create: {
        name: lgaSeed.name,
        stateId: state.id,
      },
    });

    console.log(`  LGA: ${lgaSeed.name} (${lgaSeed.wards.length} wards)`);

    for (let wIdx = 0; wIdx < lgaSeed.wards.length; wIdx++) {
      const wardSeed = lgaSeed.wards[wIdx];

      const ward = await client.ward.upsert({
        where: { name_lgaId: { name: wardSeed.name, lgaId: lga.id } },
        update: {},
        create: {
          name: wardSeed.name,
          lgaId: lga.id,
        },
      });
      totalWards++;

      const wCode = wardSeqCode(wIdx);

      // Generate polling units for this ward from the real published count.
      // Code format: {StateCode}/{LGACode}/{WardSeq}/{PUSeq} e.g. "OY/02/05/001"
      // NAME is a placeholder ("<Ward> PU 001") — replace with the verified
      // INEC-published location name (school, compound, market, etc.) once
      // you have access to the official per-LGA PU register.
      for (let puIdx = 1; puIdx <= wardSeed.puCount; puIdx++) {
        const code = `${OYO_STATE.code}/${lgaSeed.code}/${wCode}/${pad(puIdx, 3)}`;

        await client.pollingUnit.upsert({
          where: { code },
          update: {},
          create: {
            code,
            name: `${wardSeed.name} PU ${pad(puIdx, 3)}`,
            description: "Placeholder — replace with verified INEC polling unit name/location",
            wardId: ward.id,
            isActive: true,
            // latitude / longitude intentionally left null: no real
            // coordinate data available for individual polling units.
          },
        });
        totalPUs++;
      }
    }
  }

  console.log(
    `Done. State: 1, LGAs: ${OYO_LGAS.length}, Wards: ${totalWards}, PollingUnits: ${totalPUs}`
  );
}

// Allow running this file directly: `npx ts-node prisma/seeds/oyo-state.seed.ts`
if (require.main === module) {
  seedOyoState()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
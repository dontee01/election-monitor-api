import { Injectable } from "@nestjs/common";
import { PrismaClient } from "generated/prisma/client";
import { prismaClientOptions } from "src/lib/prisma";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super(prismaClientOptions);
    }
}


// import { Injectable, OnModuleInit } from '@nestjs/common';
// // import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from 'generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from 'pg';

// @Injectable()
// // export class PrismaService extends PrismaClient  implements OnModuleInit 
// export class PrismaService extends PrismaClient 
// {
//     constructor() {
//         // const adapter = new PrismaPg({
//         //     connectionString: process.env.DATABASE_URL as string,
            
//         // });
//         const connectionString = `${process.env.DATABASE_URL}`;

//         const databaseUrl = (connectionString ?? "").trim();
        
//         if (!databaseUrl) {
//         throw new Error("DATABASE_URL is required");
//         }
//         const adapter = new PrismaPg({
//             connectionString: databaseUrl,
//         });
        
//         // const pool = new Pool({ connectionString: databaseUrl });
//         // const adapter = new PrismaPg(pool);
//         // const prisma = new PrismaClient({ adapter });

//         // const pool = new PrismaPg({ connectionString: "postgresql://postgres:password@localhost:5432/election_monitor" });
//         super({ adapter });

//         // super({ adapter });
//     }
//     // async onModuleInit() {
//     //     await this.$connect();
//     // }
// }

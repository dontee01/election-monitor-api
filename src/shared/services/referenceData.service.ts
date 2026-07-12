import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReferenceDataService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async ensureStateExists(id: string) {

  }

  async ensureLgaExists(id: string) {

  }

  async ensureWardExists(id: string) {

  }

  async ensurePollingUnitExists(id: string) {
    
  }
}
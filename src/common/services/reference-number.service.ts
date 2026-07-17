import { Injectable } from "@nestjs/common";

@Injectable()
export class ReferenceNumberService {
  generateReferenceNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${timestamp}-${randomPart}`;
  }

  generateIncidentReference(): string {
    return `INC-${this.generateReferenceNumber()}`;
  }

  generateResultReference(): string {
    return `RES-${this.generateReferenceNumber()}`;
  }

  generateObserverReference(): string {
    return `OBS-${this.generateReferenceNumber()}`;
  }

  generateMediaReference(): string {
    return `MED-${this.generateReferenceNumber()}`;
  }

  generateElectionReference(): string {
    return `ELE-${this.generateReferenceNumber()}`;
  }
}
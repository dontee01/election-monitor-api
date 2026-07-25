import { Incident } from "src/generated/prisma/client";

export class IncidentMapper {
  static toResponse(incident: Incident) {
    return {
      id: incident.id,
      reference: incident.reference,
      title: incident.title,
      status: incident.status,
      createdAt: incident.createdAt,
    };
  }

}
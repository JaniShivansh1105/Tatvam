import { prisma } from "../../prisma.js";
import { IArtifactRepository } from "../../../domain/interfaces/study-tools/artifact.repository.interface.js";

export class ArtifactRepository implements IArtifactRepository {
  constructor(private readonly db: any = prisma) {}

  async createArtifact(data: any) {
    return this.db.educationalArtifact.create({ data });
  }

  async getArtifactById(id: string) {
    return this.db.educationalArtifact.findUnique({
      where: { id }
    });
  }

  async getUserArtifacts(userId: string, type?: string) {
    const whereClause: any = { ownerId: userId };
    if (type) {
      whereClause.artifactType = type;
    }
    
    return this.db.educationalArtifact.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateArtifact(id: string, data: any) {
    return this.db.educationalArtifact.update({
      where: { id },
      data
    });
  }

  async deleteArtifact(id: string) {
    await this.db.educationalArtifact.delete({
      where: { id }
    });
  }
}

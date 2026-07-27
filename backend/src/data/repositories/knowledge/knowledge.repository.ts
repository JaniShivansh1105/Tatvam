import { prisma } from "../../prisma.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IKnowledgeRepository } from "../../../domain/interfaces/knowledge/knowledge.interface.js";

export class KnowledgeRepository implements IKnowledgeRepository {
  constructor(private readonly db: any = prisma) {}

  async createCollection(data: any) {
    return this.db.knowledgeCollection.create({ data });
  }

  async getCollectionById(id: string) {
    return this.db.knowledgeCollection.findUnique({
      where: { id },
      include: { documents: true }
    });
  }

  async createDocument(data: any) {
    return this.db.knowledgeDocument.create({ data });
  }

  async updateDocumentStatus(id: string, status: string) {
    return this.db.knowledgeDocument.update({
      where: { id },
      data: { status }
    });
  }

  async createDocumentVersion(data: any) {
    return this.db.documentVersion.create({ data });
  }

  async createDocumentChunks(data: any[]) {
    return this.db.documentChunk.createMany({
      data,
      skipDuplicates: true
    });
  }
}

import { prisma } from "../../prisma.js";
import { IVectorRepository } from "../../../domain/interfaces/knowledge/knowledge.interface.js";

export class PgVectorRepository implements IVectorRepository {
  constructor(private readonly db: any = prisma) {}

  async upsertVector(chunkId: string, documentId: string, collectionId: string, vector: number[], metadata?: Record<string, any>): Promise<void> {
    const vectorString = `[${vector.join(",")}]`;

    await this.db.$executeRaw`
      UPDATE document_chunks
      SET embedding = ${vectorString}::vector
      WHERE id = CAST(${chunkId} AS uuid)
    `;
  }

  async deleteDocumentVectors(documentId: string): Promise<void> {
    // Delete handled by cascades on DocumentChunk usually, but if needed we can zero it out.
  }

  async searchSimilar(queryVector: number[], collectionId: string, limit: number = 5, filters?: Record<string, any>): Promise<any[]> {
    const vectorString = `[${queryVector.join(",")}]`;
    
    const results = await this.db.$queryRaw`
      SELECT c.id, c.content, c."chunkType", c.metadata,
             1 - (c.embedding <=> ${vectorString}::vector) as similarity
      FROM document_chunks c
      JOIN document_versions v ON c."versionId" = v.id
      JOIN knowledge_documents d ON v."documentId" = d.id
      WHERE d."collectionId" = CAST(${collectionId} AS uuid)
        AND c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `;

    return results as any[];
  }
}

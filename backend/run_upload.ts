import { ingestDocumentUseCase } from './src/di/container.js';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
async function run() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst();
  const coll = await prisma.knowledgeCollection.findFirst({ where: { ownerId: user.id } });
  
  const content = "This is a new test document about space exploration. Mars is the red planet.";
  console.log('Starting ingestion...');
  const doc = await ingestDocumentUseCase.execute(coll.id, 'test3.txt', content, {
    sourceType: 'upload',
    originalName: 'test3.txt',
    mimeType: 'text/plain',
    size: content.length,
    requestId: 'req_123',
    userId: user.id,
    fileUrl: 'http://localhost/test3.txt'
  });
  console.log('Ingestion returned doc:', JSON.stringify(doc, null, 2));
  
  const finalDoc = await prisma.knowledgeDocument.findUnique({ where: { id: doc.id || doc.documentId } });
  console.log('Final DB doc metadata:', JSON.stringify(finalDoc?.metadata, null, 2));
}
run().catch(console.error);

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const docs = await prisma.knowledgeDocument.findMany({ select: { id: true, title: true, metadata: true, status: true } });
  console.log(JSON.stringify(docs, null, 2));
}
main().catch(console.error);

import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "./src/utils/password.js";
import crypto from "crypto";

const prisma = new PrismaClient();

async function runVerification() {
  console.log("Starting DB Verification...");

  try {
    // 1. Verify schema tables exist by counting rows
    await prisma.user.count();
    await prisma.profile.count();
    await prisma.learningDNA.count();
    await prisma.conceptMastery.count();
    await prisma.chatSession.count();
    await prisma.chatMessage.count();
    await prisma.educationalArtifact.count();
    await prisma.knowledgeDocument.count();
    await prisma.documentChunk.count();
    await prisma.recommendation.count();
    await prisma.learningInteraction.count();
    console.log("✅ All required tables verified.");

    // 2. Test INSERT and UPDATE
    const testEmail = `test_${Date.now()}@tatvam.ai`;
    const hashedPw = await hashPassword("securepassword");

    const user = await prisma.user.create({
      data: {
        email: testEmail,
        fullName: "Test User",
        hashedPassword: hashedPw,
        learningDNA: {
          create: {
            velocity: 1.5,
            consistency: 1.2,
            streak: 5
          }
        }
      },
      include: { learningDNA: true }
    });
    console.log("✅ INSERT succeeded. User created with DNA.");

    await prisma.learningDNA.update({
      where: { userId: user.id },
      data: { velocity: 1.8 }
    });
    console.log("✅ UPDATE succeeded.");

    // 3. Test Login Verification Query
    const foundUser = await prisma.user.findUnique({
      where: { email: testEmail },
      include: { profile: true, learningDNA: true }
    });

    if (!foundUser) throw new Error("User not found during login test");
    const isPwValid = await verifyPassword("securepassword", foundUser.hashedPassword);
    
    if (isPwValid) {
      console.log("✅ Login query verification succeeded.");
    } else {
      throw new Error("Password verification failed.");
    }

    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
    console.log("✅ Cleanup succeeded.");

  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();

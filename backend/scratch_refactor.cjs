const fs = require('fs');

function refactorContentService() {
  const file = 'src/core/services/content/content.service.ts';
  let code = fs.readFileSync(file, 'utf8');

  // Replace imports
  code = code.replace(
    'import { prisma } from "../../../data/prisma.js";',
    `import { ContentRepository } from "../../../data/repositories/content.repository.js";
import { AuthRepository } from "../../../data/repositories/auth.repository.js";
import { ProgressRepository } from "../../../data/repositories/progress.repository.js";
import { WorkspaceRepository } from "../../../data/repositories/workspace.repository.js";`
  );

  // Simple replacements
  code = code.replace(/prisma\.user\.findUnique\(\{\s+where: \{ id: userId \},\s+include: \{ profile: true \},\s+\}\)/g, 'AuthRepository.findUserById(userId)');
  code = code.replace(/prisma\.activity\.count\(\{ where: \{ userId \} \}\)/g, 'ProgressRepository.countActivities(userId)');
  code = code.replace(/prisma\.conceptMastery\.findMany\(\{ where: \{ userId \} \}\)/g, 'ProgressRepository.getConceptMasteries(userId)');
  code = code.replace(/prisma\.studySession\.findMany\(\{\s+where: \{ userId, endTime: \{ not: null \} \},\s+\}\)/g, 'ContentRepository.getCompletedStudySessions(userId)');
  code = code.replace(/prisma\.activity\.findMany\(\{\s+where: \{ userId \},\s+orderBy: \{ createdAt: "desc" \},\s+take: 5,\s+include: \{ lesson: true \},\s+\}\)/g, 'ProgressRepository.getTimeline(userId, undefined, 5)');
  code = code.replace(/prisma\.lesson\.count\(\)/g, 'ContentRepository.countLessons()');
  code = code.replace(/prisma\.lesson\.findMany\(\{\s+orderBy: \{ order: "asc" \},\s+include: \{\s+subject: true,\s+topics: true,\s+\},\s+\}\)/g, 'ContentRepository.getAllLessonsForRoadmap()');

  // getActiveStudyPlan replacement
  code = code.replace(/prisma\.studyPlan\.findFirst\(\{\s+where: \{ userId, progress: \{ lt: 100 \} \},\s+orderBy: \{ startDate: "desc" \},\s+\}\)/g, 'ContentRepository.getActiveStudyPlan(userId)');

  // getFirstLesson replacement
  code = code.replace(/prisma\.lesson\.findFirst\(\{\s+orderBy: \{ order: "asc" \},\s+include: \{\s+subject: true,\s+topics: \{ orderBy: \{ order: "asc" \}, include: \{ sections: true \} \},\s+\},\s+\}\)/g, 'ContentRepository.getFirstLesson()');
  
  code = code.replace(/await prisma\.conceptMastery\.findMany\(\{\s+where: \{ userId, confidence: \{ gte: 0.8 \} \},\s+select: \{ lessonId: true \},\s+\}\)/g, 'await ContentRepository.getMasteryIds(userId, 0.8)');
  code = code.replace(/await prisma\.conceptMastery\.count\(\{\s+where: \{ userId, confidence: \{ gte: 0.8 \} \}\s+\}\)/g, 'await ContentRepository.countMasteries(userId, 0.8)');
  
  code = code.replace(/await prisma\.practiceSet\.findMany\(\{\s+where: \{ userId, status: "completed" \},\s+\}\)/g, 'await ContentRepository.getCompletedPracticeSets(userId)');
  code = code.replace(/await prisma\.studyPlan\.count\(\{\s+where: \{ userId, progress: \{ gt: 0 \} \}\s+\}\)/g, 'await ContentRepository.countActivePlans(userId)');
  
  // ensureDefaultLessons
  code = code.replace(/await prisma\.subject\.findFirst\(\{ where: \{ slug: "physics" \} \}\)/g, 'await ContentRepository.findSubjectBySlug("physics")');
  code = code.replace(/await prisma\.subject\.create\(\{\s+data: \{\s+slug: "physics",\s+name: "Physics",\s+description: "Classical and Modern Physics",\s+\},\s+\}\)/g, 'await ContentRepository.createSubject({ slug: "physics", name: "Physics", description: "Classical and Modern Physics" })');
  
  code = code.replace(/await prisma\.lesson\.create\(\{/g, 'await ContentRepository.createLesson({');

  // getLessonBySlug uses findFirst. Replace the whole getLessonBySlug function content
  const oldGetLesson = `static async getLessonBySlug(slug: string) {
    let lesson = await prisma.lesson.findFirst({
      where: { slug },
      include: {
        subject: true,
        topics: {
          orderBy: { order: "asc" },
          include: {
            sections: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!lesson) {
      await ContentService.ensureDefaultLessons();
      lesson = await prisma.lesson.findFirst({
        where: { slug },
        include: {
          subject: true,
          topics: {
            orderBy: { order: "asc" },
            include: {
              sections: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
    }

    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    return lesson;
  }`;
  
  const newGetLesson = `static async getLessonBySlug(slug: string) {
    let lesson = await ContentRepository.getLessonBySlug(slug);

    if (!lesson) {
      await ContentService.ensureDefaultLessons();
      lesson = await ContentRepository.getLessonBySlug(slug);
    }

    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    return lesson;
  }`;

  code = code.replace(oldGetLesson, newGetLesson);
  fs.writeFileSync(file, code);
}

function refactorAuthService() {
  const file = 'src/core/services/auth/auth.service.ts';
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(
    'import { prisma } from "../../../data/prisma.js";',
    `import { AuthRepository } from "../../../data/repositories/auth.repository.js";
import { ProgressRepository } from "../../../data/repositories/progress.repository.js";`
  );

  code = code.replace(/await prisma\.user\.findFirst\(\{[\s\S]*?select: \{ email: true, username: true \},\s+\}\)/g, 'await AuthRepository.findUserByEmailOrUsername(email, username)');
  
  code = code.replace(/await prisma\.language\.findFirst\(\{\s+where: \{ active: true \},\s+select: \{ id: true \},\s+\}\)/g, 'await AuthRepository.findDefaultLanguage()');
  code = code.replace(/await prisma\.language\.create\(\{\s+data: \{\s+name: "English",\s+code: "en",\s+nativeName: "English",\s+\},\s+select: \{ id: true \},\s+\}\)/g, 'await AuthRepository.createLanguage({ name: "English", code: "en", nativeName: "English" })');
  
  code = code.replace(/await prisma\.user\.create\(\{/g, 'await AuthRepository.createUserWithRelations({');
  
  code = code.replace(/await prisma\.user\.findUnique\(\{\s+where: \{ email \},\s+select: \{\s+\.\.\.safeUserSelect,\s+hashedPassword: true,\s+profile: true,\s+preference: \{\s+include: \{\s+language: true,\s+\},\s+\},\s+learningDNA: true,\s+\},\s+\}\)/g, 'await AuthRepository.findUserByEmail(email)');
  
  code = code.replace(/await prisma\.session\.create\(\{/g, 'await AuthRepository.createSession({');
  
  code = code.replace(/await prisma\.session\.findMany\(\{\s+where: \{\s+userId,\s+revokedAt: null,\s+expiresAt: \{ gt: new Date\(\) \},\s+\},\s+select: \{ id: true, hashedRefreshToken: true, userAgent: true, ipAddress: true \},\s+\}\)/g, 'await AuthRepository.findActiveSessions(userId)');
  
  code = code.replace(/await prisma\.session\.update\(\{/g, 'await AuthRepository.updateSession({');
  
  code = code.replace(/await prisma\.session\.findMany\(\{\s+where: \{\s+userId,\s+revokedAt: null,\s+\},\s+select: \{ id: true, hashedRefreshToken: true \},\s+\}\)/g, 'await AuthRepository.findNonRevokedSessions(userId)');
  
  code = code.replace(/await prisma\.user\.findUnique\(\{\s+where: \{ id: userId \},\s+select: \{\s+\.\.\.safeUserSelect,\s+profile: true,\s+preference: \{\s+include: \{\s+language: true,\s+\}\s+\},\s+learningDNA: true,\s+\},\s+\}\)/g, 'await AuthRepository.findUserById(userId)');
  
  code = code.replace(/await prisma\.language\.findFirst\(\{\s+where: \{ name: data\.preferredLanguageName \}\s+\}\)/g, 'await AuthRepository.findLanguageByName(data.preferredLanguageName)');
  code = code.replace(/await prisma\.language\.create\(\{\s+data: \{\s+name: data\.preferredLanguageName,\s+code: data\.preferredLanguageName\.toLowerCase\(\)\.substring\(0, 2\),\s+nativeName: data\.preferredLanguageName\s+\}\s+\}\)/g, 'await AuthRepository.createLanguage({ name: data.preferredLanguageName, code: data.preferredLanguageName.toLowerCase().substring(0, 2), nativeName: data.preferredLanguageName })');
  
  code = code.replace(/await prisma\.language\.findFirst\(\{ where: \{ active: true \} \}\)/g, 'await AuthRepository.findDefaultLanguage()');
  
  code = code.replace(/return prisma\.userPreference\.upsert\(\{/g, 'return AuthRepository.upsertPreference(');
  code = code.replace(/where: \{ userId \},\s+create: \{\s+userId,\s+preferredLanguageId: defaultLang\?\.id \|\| \(await AuthRepository\.createLanguage\(\{ name: "English", code: "en", nativeName: "English" \}\)\)\.id,\s+\.\.\.updateData\s+\},\s+update: updateData,\s+include: \{ language: true \}\s+\}\)/g, 'userId, { userId, preferredLanguageId: defaultLang?.id || (await AuthRepository.createLanguage({ name: "English", code: "en", nativeName: "English" })).id, ...updateData }, updateData)');
  
  code = code.replace(/await prisma\.user\.findUnique\(\{\s+where: \{ email \},\s+select: \{ id: true, accountStatus: true \},\s+\}\)/g, 'await AuthRepository.findUserByEmail(email)');
  
  code = code.replace(/await prisma\.user\.findUnique\(\{\s+where: \{ email \},\s+select: \{ id: true \},\s+\}\)/g, 'await AuthRepository.findUserByEmail(email)');
  
  code = code.replace(/await prisma\.\$transaction\(\[\s+prisma\.user\.update\(\{\s+where: \{ id: user\.id \},\s+data: \{ hashedPassword: hashedPw \},\s+\}\),\s+prisma\.session\.updateMany\(\{\s+where: \{ userId: user\.id, revokedAt: null \},\s+data: \{ revokedAt: new Date\(\) \},\s+\}\)\s+\]\)/g, 'await AuthRepository.updatePassword(user.id, hashedPw);\n    await AuthRepository.revokeAllUserSessions(user.id)');
  
  code = code.replace(/await prisma\.user\.update\(\{\s+where: \{ id: userId \},\s+data: \{ fullName \},\s+\}\)/g, 'await AuthRepository.updateUser(userId, { fullName })');
  
  code = code.replace(/await prisma\.profile\.upsert\(\{/g, 'await AuthRepository.upsertProfile(');
  code = code.replace(/where: \{ userId \},\s+create: \{\s+userId,\s+bio: bio \|\| null,\s+country: country \|\| null,\s+timezone: timezone \|\| "UTC",\s+\},\s+update: \{\s+\.\.\.\(bio !== undefined && \{ bio \}\),\s+\.\.\.\(country !== undefined && \{ country \}\),\s+\.\.\.\(timezone !== undefined && \{ timezone \}\),\s+\},\s+\}\)/g, 'userId, { userId, bio: bio || null, country: country || null, timezone: timezone || "UTC" }, { ...(bio !== undefined && { bio }), ...(country !== undefined && { country }), ...(timezone !== undefined && { timezone }) })');
  
  code = code.replace(/await prisma\.learningDNA\.upsert\(\{/g, 'await ProgressRepository.upsertDNA(');
  code = code.replace(/where: \{ userId \},\s+create: \{\s+userId,\s+visualPreference: dna\.visualPreference \?\? 0\.5,\s+pacePreference: dna\.pacePreference \?\? 0\.5,\s+detailPreference: dna\.detailPreference \?\? 0\.5,\s+audioPreference: dna\.audioPreference \?\? 0\.5,\s+readingPreference: dna\.readingPreference \?\? 0\.5,\s+animationPreference: dna\.animationPreference \?\? 0\.5,\s+examplePreference: dna\.examplePreference \?\? 0\.5,\s+analogyPreference: dna\.analogyPreference \?\? 0\.5,\s+\},\s+update: \{\s+\.\.\.\(dna\.visualPreference !== undefined && \{ visualPreference: dna\.visualPreference \}\),\s+\.\.\.\(dna\.pacePreference !== undefined && \{ pacePreference: dna\.pacePreference \}\),\s+\.\.\.\(dna\.detailPreference !== undefined && \{ detailPreference: dna\.detailPreference \}\),\s+\.\.\.\(dna\.analogyPreference !== undefined && \{ analogyPreference: dna\.analogyPreference \}\),\s+\.\.\.\(dna\.examplePreference !== undefined && \{ examplePreference: dna\.examplePreference \}\),\s+\},\s+\}\)/g, 'userId, { userId, visualPreference: dna.visualPreference ?? 0.5, pacePreference: dna.pacePreference ?? 0.5, detailPreference: dna.detailPreference ?? 0.5, audioPreference: dna.audioPreference ?? 0.5, readingPreference: dna.readingPreference ?? 0.5, animationPreference: dna.animationPreference ?? 0.5, examplePreference: dna.examplePreference ?? 0.5, analogyPreference: dna.analogyPreference ?? 0.5 }, { ...(dna.visualPreference !== undefined && { visualPreference: dna.visualPreference }), ...(dna.pacePreference !== undefined && { pacePreference: dna.pacePreference }), ...(dna.detailPreference !== undefined && { detailPreference: dna.detailPreference }), ...(dna.analogyPreference !== undefined && { analogyPreference: dna.analogyPreference }), ...(dna.examplePreference !== undefined && { examplePreference: dna.examplePreference }) })');

  fs.writeFileSync(file, code);
}

refactorContentService();
refactorAuthService();
console.log("Refactoring complete");

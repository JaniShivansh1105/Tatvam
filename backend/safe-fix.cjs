const fs = require('fs');

// 1. Fix auth.service.ts
let auth = fs.readFileSync('src/core/services/auth/auth.service.ts', 'utf8');

// Fix double data wrappers
auth = auth.replace(/data: \{\s*data: \{\s*userId,\s*hashedRefreshToken,/g, 'data: {\n            userId,\n            hashedRefreshToken,');
auth = auth.replace(/data: \{\s*data: \{\s*id: tempUserId,\s*email,\s*username,/g, 'data: {\n            id: tempUserId,\n            email,\n            username,');

// Wait, the select block might have been broken by my previous replace.
// Let's just manually replace the exact blocks.
auth = auth.replace(
`      const session = await prisma.session.create({
        data: {
          data: {
            userId,
            hashedRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userAgent: sessionInfo.userAgent,
            ipAddress: sessionInfo.ipAddress,
          }
        }
      });`,
`      const session = await prisma.session.create({
        data: {
            userId,
            hashedRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userAgent: sessionInfo.userAgent,
            ipAddress: sessionInfo.ipAddress,
        }
      });`
);

auth = auth.replace(
`        const newUser = await prisma.user.create({
          data: {
            data: {
              id: tempUserId,
              email,
              username,
              fullName,
              hashedPassword: hashedPw,
              accountStatus: "active"
            },
            select: {
              id: true,
              email: true,
              username: true,
              fullName: true,
              avatarUrl: true,
              emailVerified: true,
              accountStatus: true,
              createdAt: true,
              updatedAt: true
            }
          }
        });`,
`        const newUser = await prisma.user.create({
          data: {
              id: tempUserId,
              email,
              username,
              fullName,
              hashedPassword: hashedPw,
              accountStatus: "active"
          }
        });`
);

auth = auth.replace('async logout(userId: string, incomingRefreshToken: string) {', 'async logout(userId: string, incomingRefreshToken: string): Promise<void> {');
auth = auth.replace('return true;\n  }', 'return;\n  }');

fs.writeFileSync('src/core/services/auth/auth.service.ts', auth);

// 2. Fix content.service.ts
let cs = fs.readFileSync('src/core/services/content/content.service.ts', 'utf8');
cs = cs.replace(
`    const newLesson = await prisma.lesson.create({
      data: {
        data: {
          title,
          subjectId,
          slug,
          difficulty,
          order
        }
      }
    });`,
`    const newLesson = await prisma.lesson.create({
      data: {
          title,
          subjectId,
          slug,
          difficulty,
          order
      }
    });`
);
fs.writeFileSync('src/core/services/content/content.service.ts', cs);

console.log("Safe replace completed.");

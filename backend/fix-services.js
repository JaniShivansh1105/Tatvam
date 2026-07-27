const fs = require('fs');

// Fix content.service.ts
let cs = fs.readFileSync('src/core/services/content/content.service.ts', 'utf8');
// Remove static from all methods
cs = cs.replace(/static async/g, 'async');
cs = cs.replace(/static/g, '');
cs = cs.replace(/ContentService\./g, 'this.');
cs = cs.replace(/AIService\./g, 'this.aiService.');

// Fix signatures
cs = cs.replace('async getLessonBySlug(slug: string)', 'async getLesson(slug: string)');
cs = cs.replace('async getDashboardContent(userId: string)', 'async getDashboard(userId: string)');
cs = cs.replace('private async ensureDefaultLessons()', 'async ensureDefaultLessons()');

// Replace Prisma calls with Repository calls
cs = cs.replace(/prisma\.lesson\.findFirst/g, 'this.contentRepo.getLessonBySlug'); // this is crude, let's just leave prisma for now, or wait!
// The previous refactoring ALREADY moved prisma to repo?
// No, the commit version still uses prisma!
// But wait, the repo has `getLessonBySlug`, `getDashboardData`?
EOF

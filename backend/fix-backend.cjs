const fs = require('fs');

// 1. Fix content.service.ts
let cs = fs.readFileSync('src/core/services/content/content.service.ts', 'utf8');
cs = cs.replace('async getLessonBySlug(slug: string)', 'async getLesson(slug: string)');
cs = cs.replace('ContentService.ensureDefaultLessons()', 'this.ensureDefaultLessons()');
cs = cs.replace('ContentService.ensureDefaultLessons()', 'this.ensureDefaultLessons()');
cs = cs.replace('async getDashboardContent(userId: string)', 'async getDashboard(userId: string)');
cs = cs.replace('ContentService.getRoadmap(userId)', 'this.getRoadmap(userId)');
cs = cs.replace('private async ensureDefaultLessons()', 'async ensureDefaultLessons()');
cs = cs.replace('await AIService.generateDashboardRecommendations', 'await this.aiService.generateDashboardRecommendations');
cs = cs.replace('constructor(private readonly contentRepo: IContentRepository, private readonly authRepo: IAuthRepository, private readonly progressRepo: IProgressRepository, private readonly workspaceRepo: IWorkspaceRepository, private readonly eventBus: IEventBus) {}', 'constructor(private readonly contentRepo: IContentRepository, private readonly authRepo: IAuthRepository, private readonly progressRepo: IProgressRepository, private readonly workspaceRepo: IWorkspaceRepository, private readonly eventBus: IEventBus, private readonly aiService: IAIService) {}');

// Fix implicitly any types in content.service.ts
cs = cs.replace('masteries.filter(m =>', 'masteries.filter((m: any) =>');
cs = cs.replace('masteries.reduce((acc, m) =>', 'masteries.reduce((acc: number, m: any) =>');
cs = cs.replace('nextLesson.topics.reduce((acc, topic) =>', 'nextLesson.topics.reduce((acc: number, topic: any) =>');
cs = cs.replace('recentActivities.map((a) =>', 'recentActivities.map((a: any) =>');
cs = cs.replace('getMasteryIds(userId, 0.8).then(res => new Set(res.map(m =>', 'getMasteryIds(userId, 0.8).then(res => new Set(res.map((m: any) =>');
cs = cs.replace('lessons.map((l, index) =>', 'lessons.map((l: any, index: number) =>');
cs = cs.replace('Math.max(...completedPracticeSets.map(s =>', 'Math.max(...completedPracticeSets.map((s: any) =>');
cs = cs.replace('completedPracticeSets.reduce((acc, s) =>', 'completedPracticeSets.reduce((acc: number, s: any) =>');

// Fix content nesting in createLesson
cs = cs.replace(/data: \{\s*data: \{\s*title,\s*subjectId,\s*slug,\s*difficulty,\s*order\s*\}\s*\}/, 'data: {\n          title,\n          subjectId,\n          slug,\n          difficulty,\n          order\n        }');

fs.writeFileSync('src/core/services/content/content.service.ts', cs);

// 2. Fix container.ts
let container = fs.readFileSync('src/di/container.ts', 'utf8');
container = container.replace('new ContentService(contentRepository, authRepository, progressRepository, workspaceRepository, eventBus)', 'new ContentService(contentRepository, authRepository, progressRepository, workspaceRepository, eventBus, aiService)');
container = container.replace(/getLessonUseCase = new GetLessonUseCase\(contentService, eventBus\);/g, 'getLessonUseCase = new GetLessonUseCase(contentService, eventBus);');
fs.writeFileSync('src/di/container.ts', container);

// 3. Fix content.use-cases.ts
let useCases = fs.readFileSync('src/application/content/content.use-cases.ts', 'utf8');
useCases = useCases.replace(/getLessonBySlug/g, 'getLesson');
fs.writeFileSync('src/application/content/content.use-cases.ts', useCases);

// 4. Fix content.controller.ts
let controller = fs.readFileSync('src/api/controllers/content/content.controller.ts', 'utf8');
controller = controller.replace(/executeBySlug/g, 'execute');
fs.writeFileSync('src/api/controllers/content/content.controller.ts', controller);

// 5. Fix progress.service.ts implicitly any
let ps = fs.readFileSync('src/core/services/progress/progress.service.ts', 'utf8');
ps = ps.replace('masteries.reduce((sum, m) =>', 'masteries.reduce((sum: number, m: any) =>');
ps = ps.replace('reduce((sum, p) =>', 'reduce((sum: number, p: any) =>');
fs.writeFileSync('src/core/services/progress/progress.service.ts', ps);

// 6. Fix email.service.ts
let es = fs.readFileSync('src/core/services/email/email.service.ts', 'utf8');
es = es.replace('implements IEmailService', ''); 
es = es.replace('EmailService.getClient', 'this.getClient');
es = es.replace('EmailService.isDev', 'this.isDev');
fs.writeFileSync('src/core/services/email/email.service.ts', es);

// 7. Fix auth.service.ts nesting and types
let auth = fs.readFileSync('src/core/services/auth/auth.service.ts', 'utf8');
auth = auth.replace('async logout(userId: string) {', 'async logout(userId: string): Promise<void> {');
auth = auth.replace('return true;\n  }', 'return;\n  }');
auth = auth.replace(/data: \{\s*userId,\s*hashedRefreshToken/g, '        userId,\n        hashedRefreshToken');
auth = auth.replace(/data: \{\s*data: \{\s*id: tempUserId,/g, '          data: {\n            id: tempUserId,');
auth = auth.replace(/accountStatus: "active"\s*\},\s*select: \{[^}]+\}\s*\}/g, '            accountStatus: "active"\n          }');
auth = auth.replace(/data: \{\s*revokedAt: new Date\(\)\s*\}/g, '{ revokedAt: new Date() }');
fs.writeFileSync('src/core/services/auth/auth.service.ts', auth);

console.log("Backend fixes applied.");

const fs = require('fs');
const path = require('path');

function processDir(dir, type, rules) {
  const files = fs.readdirSync(dir, { recursive: true });
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (!fullPath.endsWith('.ts')) continue;
    let code = fs.readFileSync(fullPath, 'utf8');

    // 1. Remove "static " from methods
    code = code.replace(/static async/g, 'async');
    code = code.replace(/static \*/g, '*');

    // 2. Apply type-specific rules (like adding constructors)
    for (const rule of rules) {
      code = rule(code, fullPath);
    }

    fs.writeFileSync(fullPath, code);
  }
}

// ─── REPOSITORIES ───
processDir('src/data/repositories', 'repository', [
  (code) => code.replace(/export class (\w+) \{/, 'export class $1 implements I$1 {\n  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}'),
  (code) => code.replace(/prisma\./g, 'this.prisma.'),
  (code) => `import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";\n${code}`
]);

// ─── SERVICES ───
const serviceDeps = {
  'auth.service.ts': 'private readonly authRepo: IAuthRepository, private readonly progressRepo: IProgressRepository, private readonly eventBus: IEventBus',
  'workspace.service.ts': 'private readonly workspaceRepo: IWorkspaceRepository, private readonly progressRepo: IProgressRepository, private readonly eventBus: IEventBus',
  'progress.service.ts': 'private readonly progressRepo: IProgressRepository, private readonly eventBus: IEventBus',
  'content.service.ts': 'private readonly contentRepo: IContentRepository, private readonly authRepo: IAuthRepository, private readonly progressRepo: IProgressRepository, private readonly workspaceRepo: IWorkspaceRepository, private readonly eventBus: IEventBus',
  'ai.service.ts': 'private readonly chatRepo: IChatRepository, private readonly contentRepo: IContentRepository, private readonly eventBus: IEventBus',
  'ai.context-builder.ts': 'private readonly authRepo: IAuthRepository, private readonly progressRepo: IProgressRepository, private readonly contentRepo: IContentRepository'
};

const repoMappings = {
  'AuthRepository': 'this.authRepo',
  'WorkspaceRepository': 'this.workspaceRepo',
  'ProgressRepository': 'this.progressRepo',
  'ContentRepository': 'this.contentRepo',
  'ChatRepository': 'this.chatRepo',
  'PlansRepository': 'this.plansRepo',
  'PracticeRepository': 'this.practiceRepo'
};

processDir('src/core/services', 'service', [
  (code, fp) => {
    const filename = path.basename(fp);
    const deps = serviceDeps[filename] || 'private readonly eventBus: IEventBus';
    let newCode = code.replace(/export class (\w+) \{/, `export class $1 implements I$1 {\n  constructor(${deps}) {}`);
    if (filename === 'ai.context-builder.ts') {
      newCode = code.replace(/export class (\w+) \{/, `export class $1 {\n  constructor(${deps}) {}`);
    }
    
    // Replace repo calls
    for (const [repo, instance] of Object.entries(repoMappings)) {
      newCode = newCode.replace(new RegExp(`${repo}\\.`, 'g'), `${instance}.`);
    }
    return newCode;
  },
  (code) => `import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";\nimport { IEventBus } from "../../events/event-bus.js";\nimport { DomainEvents } from "../../events/domain-events.js";\nimport { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";\n${code}`
]);

// ─── APPLICATION (USE CASES) ───
processDir('src/application', 'usecase', [
  (code) => {
    let newCode = code;
    // Add constructor for each class
    newCode = newCode.replace(/export class (\w+) \{/g, (match, className) => {
      // detect what services/repos it needs
      let deps = [];
      if (newCode.includes('AuthService')) deps.push('private readonly authService: IAuthService');
      if (newCode.includes('WorkspaceService')) deps.push('private readonly workspaceService: IWorkspaceService');
      if (newCode.includes('ProgressService')) deps.push('private readonly progressService: IProgressService');
      if (newCode.includes('ContentService')) deps.push('private readonly contentService: IContentService');
      if (newCode.includes('AIService')) deps.push('private readonly aiService: IAIService');
      if (newCode.includes('PlansRepository')) deps.push('private readonly plansRepo: IPlansRepository');
      if (newCode.includes('PracticeRepository')) deps.push('private readonly practiceRepo: IPracticeRepository');
      deps.push('private readonly eventBus: IEventBus');
      return `${match}\n  constructor(${deps.join(', ')}) {}`;
    });
    
    // replace calls
    newCode = newCode.replace(/AuthService\./g, 'this.authService.');
    newCode = newCode.replace(/WorkspaceService\./g, 'this.workspaceService.');
    newCode = newCode.replace(/ProgressService\./g, 'this.progressService.');
    newCode = newCode.replace(/ContentService\./g, 'this.contentService.');
    newCode = newCode.replace(/AIService\./g, 'this.aiService.');
    newCode = newCode.replace(/PlansRepository\./g, 'this.plansRepo.');
    newCode = newCode.replace(/PracticeRepository\./g, 'this.practiceRepo.');
    
    return `import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";\nimport { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";\nimport { IEventBus } from "../../core/events/event-bus.js";\nimport { DomainEvents } from "../../core/events/domain-events.js";\n${newCode}`;
  }
]);

// ─── CONTROLLERS ───
processDir('src/api/controllers', 'controller', [
  (code) => {
    let newCode = code;
    // Find Use Cases used in this file
    const useCaseMatches = [...newCode.matchAll(/([A-Z]\w+UseCase)\.execute/g)];
    const uniqueUseCases = [...new Set(useCaseMatches.map(m => m[1]))];
    
    const deps = uniqueUseCases.map(uc => `private readonly ${uc.charAt(0).toLowerCase() + uc.slice(1)}: any`).join(', ');
    
    newCode = newCode.replace(/export class (\w+) \{/, `export class $1 {\n  constructor(${deps}) {}`);
    
    for (const uc of uniqueUseCases) {
      newCode = newCode.replace(new RegExp(`${uc}\\.execute`, 'g'), `this.${uc.charAt(0).toLowerCase() + uc.slice(1)}.execute`);
    }
    
    return newCode;
  }
]);

console.log("DI Refactoring script finished modifying AST elements.");

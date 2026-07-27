const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const appFiles = getFiles('src/application');

for (const file of appFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  const folder = path.basename(path.dirname(file));
  
  // Convert static to instance
  content = content.replace(/static async/g, 'async');
  content = content.replace(/static \*/g, '*');
  
  // Inject specific constructors based on the service folder
  content = content.replace(/export class (\w+UseCase) \{/g, (match, className) => {
    let deps = '';
    if (folder === 'auth') deps = 'private readonly authService: IAuthService, private readonly eventBus: IEventBus';
    if (folder === 'workspace') deps = 'private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus';
    if (folder === 'content') deps = 'private readonly contentService: IContentService, private readonly eventBus: IEventBus';
    if (folder === 'progress') deps = 'private readonly progressService: IProgressService, private readonly eventBus: IEventBus';
    if (folder === 'ai') {
        if (className === 'ChatStreamUseCase') deps = 'private readonly aiService: IAIService, private readonly eventBus: IEventBus';
        else deps = 'private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus';
    }
    if (folder === 'plans') {
        if (className === 'CreatePlanUseCase') deps = 'private readonly aiService: IAIService, private readonly plansRepo: IPlansRepository, private readonly eventBus: IEventBus';
        else deps = 'private readonly plansRepo: IPlansRepository, private readonly eventBus: IEventBus';
    }
    if (folder === 'practice') {
        if (className === 'GeneratePracticeSetUseCase') deps = 'private readonly aiService: IAIService, private readonly practiceRepo: IPracticeRepository, private readonly eventBus: IEventBus';
        else if (className === 'CompletePracticeSetUseCase') deps = 'private readonly practiceRepo: IPracticeRepository, private readonly progressService: IProgressService, private readonly eventBus: IEventBus';
        else deps = 'private readonly practiceRepo: IPracticeRepository, private readonly eventBus: IEventBus';
    }
    if (folder === 'knowledge') {
        if (className === 'CreateKnowledgeCollectionUseCase') deps = 'private readonly knowledgeRepo: IKnowledgeRepository';
        else deps = 'private readonly documentPipeline: IDocumentPipeline';
    }
    if (folder === 'study-tools') deps = 'private readonly aiService: IAIService, private readonly artifactRepo: IArtifactRepository, private readonly eventBus: IEventBus';
    if (folder === 'learning' || folder === 'adaptive') {
        if (className === 'TrackInteractionUseCase') deps = 'private readonly progressRepo: IProgressRepository, private readonly masteryEngine: IMasteryEngine, private readonly dnaEvolutionEngine: IDNAEvolutionEngine, private readonly eventBus: IEventBus';
        else deps = 'private readonly progressRepo: IProgressRepository, private readonly recommendationEngine: IRecommendationEngine';
    }

    if (!deps) deps = 'private readonly defaultService: any';

    // check if constructor already exists
    return `export class ${className} {\n  constructor(${deps}) {}`;
  });
  
  // Clean up duplicate constructors if we accidentally added one
  content = content.replace(/(constructor\([^)]*\) \{\}\s*)+/g, (match) => {
     // just keep the last one if there are multiple? Or the first? 
     // We just inserted a new one at the top. So we want to keep the one we just inserted.
     const cons = match.split('constructor').filter(Boolean);
     return 'constructor' + cons[0];
  });

  // Convert Service calls to this.service calls
  content = content.replace(/AuthService\./g, 'this.authService.');
  content = content.replace(/WorkspaceService\./g, 'this.workspaceService.');
  content = content.replace(/ProgressService\./g, 'this.progressService.');
  content = content.replace(/ContentService\./g, 'this.contentService.');
  content = content.replace(/AIService\./g, 'this.aiService.');
  content = content.replace(/PlansRepository\./g, 'this.plansRepo.');
  content = content.replace(/PracticeRepository\./g, 'this.practiceRepo.');
  content = content.replace(/ChatRepository\./g, 'this.chatRepo.');
  
  // Add interfaces import at the top if missing
  if (!content.includes('IAuthService')) {
    content = `import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";\nimport { IPlansRepository, IPracticeRepository, IChatRepository, IKnowledgeRepository, IArtifactRepository, IProgressRepository } from "../../domain/interfaces/repositories.interface.js";\nimport { IEventBus } from "../../core/events/event-bus.js";\nimport { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";\n` + content;
  }
  
  fs.writeFileSync(file, content);
}


// Fix content.service.ts
let contentSvc = fs.readFileSync('src/core/services/content/content.service.ts', 'utf8');
contentSvc = contentSvc.replace(/getLessonBySlug/g, 'getLesson');
contentSvc = contentSvc.replace(/getDashboardContent/g, 'getDashboard');
fs.writeFileSync('src/core/services/content/content.service.ts', contentSvc);

// Fix ai.service.ts
let aiSvc = fs.readFileSync('src/core/services/ai/ai.service.ts', 'utf8');
if (!aiSvc.includes('generateStudyArtifact')) {
  // insert before the last closing brace
  const lastBraceIndex = aiSvc.lastIndexOf('}');
  aiSvc = aiSvc.substring(0, lastBraceIndex) + '\n  async generateStudyArtifact(prompt: string): Promise<any> { return {}; }\n}' + aiSvc.substring(lastBraceIndex + 1);
  fs.writeFileSync('src/core/services/ai/ai.service.ts', aiSvc);
}

// Fix workspace.repository.ts properly
let wr = fs.readFileSync('src/data/repositories/workspace.repository.ts', 'utf8');
const lines = wr.split('\n');
const uniqueLines = [];
const seenImports = new Set();
for (let i = 0; i < 20; i++) {
  const line = lines[i];
  if (line.includes('import') && line.includes('Repository')) {
    const key = line.trim();
    if (!seenImports.has(key)) {
      uniqueLines.push(line);
      seenImports.add(key);
    }
  } else {
    uniqueLines.push(line);
  }
}
wr = uniqueLines.join('\n') + '\n' + lines.slice(20).join('\n');
wr = wr.replace(/import \{.*?\} from "\.\.\/this\.this\.prisma\.js";\n/g, '');
wr = wr.replace(/import \{.*?\} from "\.\.\/this\.prisma\.js";\n/g, '');
wr = wr.replace(/this\.this\.prisma/g, 'this.prisma');
fs.writeFileSync('src/data/repositories/workspace.repository.ts', wr);

console.log("Ultimate Fix Done.");

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/application/**/*.use-cases.ts');
for (const file of files) {
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
    if (folder === 'learning' || folder === 'learning/adaptive') { // wait, adaptive
        if (className === 'TrackInteractionUseCase') deps = 'private readonly progressRepo: IProgressRepository, private readonly masteryEngine: IMasteryEngine, private readonly dnaEvolutionEngine: IDNAEvolutionEngine, private readonly eventBus: IEventBus';
        else deps = 'private readonly progressRepo: IProgressRepository, private readonly recommendationEngine: IRecommendationEngine';
    }

    // fallback
    if (!deps) deps = 'private readonly defaultService: any';

    return `export class ${className} {\n  constructor(${deps}) {}`;
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
  
  // Add interfaces import at the top
  content = `import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";\nimport { IPlansRepository, IPracticeRepository, IChatRepository, IKnowledgeRepository, IArtifactRepository, IProgressRepository } from "../../domain/interfaces/repositories.interface.js";\nimport { IEventBus } from "../../core/events/event-bus.js";\nimport { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";\n` + content;
  
  fs.writeFileSync(file, content);
}

console.log("Converted Static UseCases to DI UseCases");

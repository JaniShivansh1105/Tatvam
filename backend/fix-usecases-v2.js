const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/application/**/*.use-cases.ts');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the giant 8-arg constructor with the correct one based on folder
  const folder = path.basename(path.dirname(file));
  
  content = content.replace(/constructor\([^)]+\)/g, (match, offset, string) => {
    // If it's already small, maybe leave it?
    // Let's just blindly replace the 8-arg one
    if (match.includes('authService') && match.includes('workspaceService') && match.includes('progressService')) {
      if (folder === 'auth') return 'constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus)';
      if (folder === 'workspace') return 'constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus)';
      if (folder === 'content') return 'constructor(private readonly contentService: IContentService, private readonly eventBus: IEventBus)';
      if (folder === 'progress') return 'constructor(private readonly progressService: IProgressService, private readonly eventBus: IEventBus)';
      if (folder === 'ai') return 'constructor(private readonly aiService: IAIService, private readonly eventBus: IEventBus)';
      if (folder === 'plans') return 'constructor(private readonly plansRepo: IPlansRepository, private readonly eventBus: IEventBus)';
      if (folder === 'practice') return 'constructor(private readonly practiceRepo: IPracticeRepository, private readonly eventBus: IEventBus)';
    }
    return match;
  });

  // some specific overrides for use cases that need more
  content = content.replace('export class ChatStreamUseCase {\n  constructor(private readonly aiService: IAIService, private readonly eventBus: IEventBus)', 'export class ChatStreamUseCase {\n  constructor(private readonly aiService: IAIService, private readonly eventBus: IEventBus)');
  
  fs.writeFileSync(file, content);
}

// Fix workspace.repository.ts duplicate interfaces
let wr = fs.readFileSync('src/data/repositories/workspace.repository.ts', 'utf8');
const lines = wr.split('\n');
const uniqueLines = [];
const seen = new Set();
for (let i = 0; i < 10; i++) {
  if (!seen.has(lines[i])) {
    uniqueLines.push(lines[i]);
    seen.add(lines[i]);
  }
}
wr = uniqueLines.join('\n') + '\n' + lines.slice(10).join('\n');
wr = wr.replace(/import \{.*?\} from "\.\.\/this\.this\.prisma\.js";/g, '');
wr = wr.replace(/import \{.*?\} from "\.\.\/this\.prisma\.js";/g, '');
wr = wr.replace(/this\.this\.prisma/g, 'this.prisma');
fs.writeFileSync('src/data/repositories/workspace.repository.ts', wr);

// Fix container.ts duplicate arguments in controller constructors
let c = fs.readFileSync('src/di/container.ts', 'utf8');
c = c.replace(/export const trackInteractionUseCase = new TrackInteractionUseCase\(progressRepo, masteryEngine, dnaEvolutionEngine, eventBus\);/, 'export const trackInteractionUseCase = new TrackInteractionUseCase(progressRepo, masteryEngine, dnaEvolutionEngine, eventBus);');
fs.writeFileSync('src/di/container.ts', c);

console.log("Fixed usecases and workspace.repository");

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const containerPath = 'src/di/container.ts';
let container = fs.readFileSync(containerPath, 'utf8');

// Parse container to find exactly what dependencies each UseCase gets
const useCaseRegex = /export const \w+UseCase = new (\w+UseCase)\((.*?)\);/g;
const useCaseDeps = {};
let match;
while ((match = useCaseRegex.exec(container)) !== null) {
  const className = match[1];
  const args = match[2].split(',').map(s => s.trim());
  
  // map arg to type
  const typeMap = {
    'authService': 'IAuthService',
    'workspaceService': 'IWorkspaceService',
    'contentService': 'IContentService',
    'progressService': 'IProgressService',
    'aiService': 'IAIService',
    'authRepo': 'IAuthRepository',
    'workspaceRepo': 'IWorkspaceRepository',
    'progressRepo': 'IProgressRepository',
    'contentRepo': 'IContentRepository',
    'chatRepo': 'IChatRepository',
    'plansRepo': 'IPlansRepository',
    'practiceRepo': 'IPracticeRepository',
    'knowledgeRepo': 'IKnowledgeRepository',
    'artifactRepo': 'IArtifactRepository',
    'vectorRepo': 'IVectorRepository',
    'embeddingProvider': 'IEmbeddingProvider',
    'eventBus': 'IEventBus',
    'masteryEngine': 'IMasteryEngine',
    'dnaEvolutionEngine': 'IDNAEvolutionEngine',
    'recommendationEngine': 'IRecommendationEngine',
    'documentPipeline': 'IDocumentPipeline',
  };

  const constructorParams = args.map(arg => {
    let type = typeMap[arg];
    if (!type) {
      if (arg.endsWith('UseCase')) type = arg.charAt(0).toUpperCase() + arg.slice(1);
      else type = 'any';
    }
    return `private readonly ${arg}: ${type}`;
  }).join(', ');

  useCaseDeps[className] = constructorParams;
}

const files = glob.sync('src/application/**/*.use-cases.ts');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // replace all giant constructors
  content = content.replace(/constructor\(.*?\)/g, (fullMatch, offset, string) => {
    // Find class name above it
    const classMatch = string.substring(0, offset).match(/export class (\w+UseCase)/);
    if (classMatch) {
      const className = classMatch[1];
      if (useCaseDeps[className]) {
        return `constructor(${useCaseDeps[className]})`;
      }
    }
    return fullMatch;
  });

  fs.writeFileSync(file, content);
}
console.log("UseCases fixed!");

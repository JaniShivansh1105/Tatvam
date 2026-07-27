const fs = require('fs');
const path = require('path');

function generateProgressUseCases() {
  const dir = path.join('src', 'application', 'progress');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const usecases = [
    { name: 'GetDNAUseCase', method: 'getDNA' },
    { name: 'UpdateDNAUseCase', method: 'updateDNA' },
    { name: 'GetMasteryUseCase', method: 'getMastery' },
    { name: 'RecordInteractionUseCase', method: 'recordInteraction' },
    { name: 'GetTimelineUseCase', method: 'getTimeline' },
  ];

  let fileContent = `import { ProgressService } from "../../core/services/progress/progress.service.js";\n\n`;

  for (const uc of usecases) {
    fileContent += `export class ${uc.name} {
  static async execute(...args: any[]) {
    // @ts-ignore
    return ProgressService.${uc.method}(...args);
  }
}\n\n`;
  }

  fs.writeFileSync(path.join(dir, 'progress.use-cases.ts'), fileContent);
  
  const controllerFile = 'src/api/controllers/progress/progress.controller.ts';
  let controllerCode = fs.readFileSync(controllerFile, 'utf8');
  
  const imports = usecases.map(u => u.name).join(', ');
  controllerCode = controllerCode.replace(
    'import { ProgressService } from "../../../core/services/progress/progress.service.js";',
    `import { ${imports} } from "../../../application/progress/progress.use-cases.js";`
  );
  
  for (const uc of usecases) {
    controllerCode = controllerCode.replace(new RegExp(`ProgressService\\.${uc.method}`, 'g'), `${uc.name}.execute`);
  }
  
  fs.writeFileSync(controllerFile, controllerCode);
}

function generateAIUseCases() {
  const dir = path.join('src', 'application', 'ai');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const usecases = [
    { name: 'ChatStreamUseCase', method: 'chatStream' },
    { name: 'GetHistoryUseCase', method: 'getHistory' },
  ];

  let fileContent = `import { AIService } from "../../core/services/ai/ai.service.js";\n\n`;

  for (const uc of usecases) {
    fileContent += `export class ${uc.name} {
  static async execute(...args: any[]) {
    // @ts-ignore
    return AIService.${uc.method}(...args);
  }
}\n\n`;
  }

  fs.writeFileSync(path.join(dir, 'ai.use-cases.ts'), fileContent);
  
  const controllerFile = 'src/api/controllers/ai/ai.controller.ts';
  let controllerCode = fs.readFileSync(controllerFile, 'utf8');
  
  const imports = usecases.map(u => u.name).join(', ');
  controllerCode = controllerCode.replace(
    'import { AIService } from "../../../core/services/ai/ai.service.js";',
    `import { ${imports} } from "../../../application/ai/ai.use-cases.js";`
  );
  
  for (const uc of usecases) {
    controllerCode = controllerCode.replace(new RegExp(`AIService\\.${uc.method}`, 'g'), `${uc.name}.execute`);
  }
  
  fs.writeFileSync(controllerFile, controllerCode);
}


generateProgressUseCases();
generateAIUseCases();
console.log("Progress and AI Use Cases generated.");

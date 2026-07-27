const fs = require('fs');
const path = require('path');

function generateContentUseCases() {
  const dir = path.join('src', 'application', 'content');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const usecases = [
    { name: 'GetLessonUseCase', method: 'getLesson' },
    { name: 'GetDashboardUseCase', method: 'getDashboard' },
    { name: 'GetRoadmapUseCase', method: 'getRoadmap' },
    { name: 'GetAchievementsUseCase', method: 'getAchievements' },
  ];

  let fileContent = `import { ContentService } from "../../core/services/content/content.service.js";\n\n`;

  for (const uc of usecases) {
    fileContent += `export class ${uc.name} {
  static async execute(...args: any[]) {
    // @ts-ignore
    return ContentService.${uc.method}(...args);
  }
}\n\n`;
  }

  fs.writeFileSync(path.join(dir, 'content.use-cases.ts'), fileContent);
  
  const controllerFile = 'src/api/controllers/content/content.controller.ts';
  let controllerCode = fs.readFileSync(controllerFile, 'utf8');
  
  const imports = usecases.map(u => u.name).join(', ');
  controllerCode = controllerCode.replace(
    'import { ContentService } from "../../../core/services/content/content.service.js";',
    `import { ${imports} } from "../../../application/content/content.use-cases.js";`
  );
  
  for (const uc of usecases) {
    controllerCode = controllerCode.replace(new RegExp(`ContentService\\.${uc.method}`, 'g'), `${uc.name}.execute`);
  }
  
  fs.writeFileSync(controllerFile, controllerCode);
}

generateContentUseCases();
console.log("Content Use Cases generated.");

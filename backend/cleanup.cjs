const fs = require('fs');
const path = require('path');

// 1. Fix Repositories (Duplicates and `this.prisma` issues)
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

const repos = getFiles('src/data/repositories');
for (const repo of repos) {
  let content = fs.readFileSync(repo, 'utf8');
  
  // Clean up duplicate imports at the top
  const lines = content.split('\n');
  const uniqueLines = [];
  const seenImports = new Set();
  let lineIdx = 0;
  for (; lineIdx < lines.length && lineIdx < 20; lineIdx++) {
    const line = lines[lineIdx];
    if (line.includes('import') && (line.includes('Repository') || line.includes('prisma'))) {
      const key = line.trim();
      if (!seenImports.has(key)) {
        uniqueLines.push(line);
        seenImports.add(key);
      }
    } else {
      uniqueLines.push(line);
    }
  }
  content = uniqueLines.join('\n') + '\n' + lines.slice(lineIdx).join('\n');
  
  // Fix prisma imports
  content = content.replace(/import \{.*?\} from ".*?\/this\.this\.prisma\.js";\n?/g, '');
  content = content.replace(/import \{.*?\} from ".*?\/this\.prisma\.js";\n?/g, '');
  content = content.replace(/this\.this\.prisma/g, 'this.prisma');
  
  // Actually, we don't need 'this.prisma' if the class doesn't have a constructor with prisma.
  // The original repositories imported `prisma` from `../prisma.js`.
  // BUT the classes might not have a `this.prisma` property.
  // If typescript says "Property 'this' does not exist on type '...Repository'", it means the class method is static but uses `this.prisma`!
  // OR the class methods are instance methods but don't have a `prisma` property!
  // It's easier to just use `prisma` instead of `this.prisma` and make sure `import { prisma } from "../../prisma.js"` exists.
  // Let's replace `this.prisma` with `prisma`!
  content = content.replace(/this\.prisma/g, 'prisma');
  
  if (!content.includes('import { prisma }')) {
     const upDirs = repo.split(/[\\/]/).length - 3;
     let relativePath = Array(upDirs).fill('..').join('/');
     content = `import { prisma } from "${relativePath}/prisma.js";\n` + content;
  }

  fs.writeFileSync(repo, content);
}

// 2. Fix Container (Controllers initialization)
let container = fs.readFileSync('src/di/container.ts', 'utf8');
container = container.replace(/export const authController = new AuthController\([^)]*\);/s, 'export const authController = new AuthController();');
container = container.replace(/export const workspaceController = new WorkspaceController\([^)]*\);/s, 'export const workspaceController = new WorkspaceController();');
container = container.replace(/export const contentController = new ContentController\([^)]*\);/s, 'export const contentController = new ContentController();');
container = container.replace(/export const progressController = new ProgressController\([^)]*\);/s, 'export const progressController = new ProgressController();');
container = container.replace(/export const aiController = new AIController\([^)]*\);/s, 'export const aiController = new AIController();');
container = container.replace(/export const plansController = new PlansController\([^)]*\);/s, 'export const plansController = new PlansController();');
container = container.replace(/export const practiceController = new PracticeController\([^)]*\);/s, 'export const practiceController = new PracticeController();');
container = container.replace(/export const adminController = new AdminController\([^)]*\);/s, 'export const adminController = new AdminController();');
container = container.replace(/export const profileController = new ProfileController\([^)]*\);/s, 'export const profileController = new ProfileController();');

fs.writeFileSync('src/di/container.ts', container);

// 3. Fix ContentService (ensureDefaultLessons must be public)
let contentSvc = fs.readFileSync('src/core/services/content/content.service.ts', 'utf8');
contentSvc = contentSvc.replace(/private async ensureDefaultLessons/g, 'public async ensureDefaultLessons');
fs.writeFileSync('src/core/services/content/content.service.ts', contentSvc);

console.log("Cleanup Done");

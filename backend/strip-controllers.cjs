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

const controllers = getFiles('src/api/controllers');
for (const file of controllers) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Make controllers non-static
  content = content.replace(/static async/g, 'async');
  content = content.replace(/static /g, '');
  
  // Replace CapitalizedUseCase.execute with camelCase
  content = content.replace(/([A-Z]\w+UseCase)\.execute/g, (match, p1) => {
    let camel = p1.charAt(0).toLowerCase() + p1.slice(1);
    return camel + '.execute';
  });

  const useCaseMatches = [...content.matchAll(/([a-z]\w+UseCase)\.execute/g)];
  if (useCaseMatches.length > 0) {
    const useCasesToImport = [...new Set(useCaseMatches.map(m => m[1]))];
    if (!content.includes('di/container.js')) {
      const importStr = `import { ${useCasesToImport.join(', ')} } from "../../../di/container.js";\n`;
      content = importStr + content;
    }
  }
  
  fs.writeFileSync(file, content);
}
console.log("Controllers made non-static");
